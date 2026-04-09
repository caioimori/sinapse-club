'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReply(replyId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { error } = await (supabase as any)
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', replyId)
    .eq('author_id', user.id);

  if (error) throw error;
  revalidatePath('/forum');
}

export async function deleteReply(replyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { error } = await (supabase as any)
    .from('comments')
    .delete()
    .eq('id', replyId)
    .eq('author_id', user.id);

  if (error) throw error;
  revalidatePath('/forum');
}

export async function updatePost(postId: string, title: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { error } = await (supabase as any)
    .from('posts')
    .update({ title, content, content_plain: content, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .eq('author_id', user.id);

  if (error) throw error;
  revalidatePath('/forum');
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { error } = await (supabase as any)
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id);

  if (error) throw error;
  revalidatePath('/forum');
}

export async function adminDeletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Sem permissão');

  await (supabase as any).from('posts').delete().eq('id', postId);
  revalidatePath('/forum');
}

export async function adminDeleteReply(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Sem permissão');

  await (supabase as any).from('comments').delete().eq('id', commentId);
  revalidatePath('/forum');
}

export async function reportContent(postId?: string, commentId?: string, reason = 'inappropriate') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  await (supabase as any).from('reports').insert({
    reporter_id: user.id,
    post_id: postId ?? null,
    comment_id: commentId ?? null,
    reason,
  });
}

export async function dismissReport(reportId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error('Sem permissão');

  await (supabase as any)
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', reportId);
}
