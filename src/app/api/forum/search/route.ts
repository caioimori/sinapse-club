import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requirePaidTier, PaywallError, PAYWALL_ERROR_CODES } from '@/lib/access/paywall';

export async function GET(req: NextRequest) {
  // Hard paywall: bloqueia anon (401) e free (403) antes de qualquer query.
  try {
    await requirePaidTier();
  } catch (err) {
    if (err instanceof PaywallError) {
      if (err.code === PAYWALL_ERROR_CODES.UNAUTHENTICATED) {
        return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
      }
      return NextResponse.json(
        { error: 'paywall', upgrade_url: '/pricing?upgrade=pro' },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }

  const q = req.nextUrl.searchParams.get('q')?.trim();
  const categoryId = req.nextUrl.searchParams.get('category');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();

  let query = (supabase as any)
    .from('posts')
    .select(`
      id, title, content_plain, created_at,
      author:profiles!author_id(username, display_name, avatar_url),
      category:forum_categories!category_id(name, slug)
    `)
    .eq('type', 'thread')
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ results: data ?? [] });
}
