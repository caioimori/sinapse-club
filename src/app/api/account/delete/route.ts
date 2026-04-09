import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminConfig } from '@/lib/supabase/admin-config';
import type { Database } from '@/types/database';

export const runtime = 'nodejs';

export async function DELETE() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { url, serviceRoleKey } = getSupabaseAdminConfig();
    const adminClient = createSupabaseClient<Database>(url, serviceRoleKey);

    // 1. Delete comments authored by user (comments table uses ON DELETE CASCADE via profiles,
    //    but we do it explicitly to be safe)
    await adminClient
      .from('comments')
      .delete()
      .eq('author_id', user.id);

    // 2. Handle posts: author_id is NOT NULL in the schema.
    //    We delete the user's posts. Content from community discussions is handled separately
    //    (replies/comments on others' threads are already deleted above).
    //    NOTE: If you prefer to keep posts visible as "[usuário excluído]",
    //    create a sentinel profile first and update author_id to that sentinel UUID.
    await adminClient
      .from('posts')
      .delete()
      .eq('author_id', user.id);

    // 3. Delete notifications involving this user
    await adminClient
      .from('notifications')
      .delete()
      .eq('recipient_id', user.id);

    // 4. Delete user profile
    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('[DELETE /api/account/delete] profile delete error:', profileError);
      // Continue — auth user deletion is still required for LGPD compliance
    }

    // 5. Sign out all sessions
    await supabase.auth.signOut();

    // 6. Delete auth user (requires service role)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Conta excluída com sucesso. Seus dados serão completamente removidos em até 30 dias.',
    });
  } catch (err) {
    console.error('[DELETE /api/account/delete] error:', err);
    return NextResponse.json(
      {
        error: 'Erro ao excluir conta. Tente novamente ou contate privacidade@sinapse.club',
      },
      { status: 500 }
    );
  }
}
