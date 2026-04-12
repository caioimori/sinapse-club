'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── Zod schemas ───────────────────────────────────────────────────
const UuidSchema = z.string().uuid('ID inválido');

const UpdateReplySchema = z.object({
  replyId: UuidSchema,
  content: z.string().trim().min(1, 'Conteúdo vazio').max(10_000, 'Conteúdo muito longo'),
});

const UpdatePostSchema = z.object({
  postId: UuidSchema,
  title: z.string().trim().min(1, 'Título vazio').max(300, 'Título muito longo'),
  content: z.string().trim().min(1, 'Conteúdo vazio').max(50_000, 'Conteúdo muito longo'),
});

const IdSchema = z.object({ id: UuidSchema });

const ReportSchema = z
  .object({
    postId: UuidSchema.optional(),
    commentId: UuidSchema.optional(),
    reason: z.enum(['inappropriate', 'spam', 'harassment', 'offtopic', 'other']).default('inappropriate'),
  })
  .refine((d) => d.postId || d.commentId, { message: 'postId ou commentId obrigatório' });

function firstError(issues: z.ZodIssue[]): string {
  return issues[0]?.message ?? 'Dados inválidos';
}

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');
  return { supabase, user };
}

async function requireAdmin() {
  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if ((profile as { role?: string } | null)?.role !== 'admin') throw new Error('Sem permissão');
  return { supabase, user };
}

// ─── Actions ───────────────────────────────────────────────────────
export async function updateReply(replyId: string, content: string) {
  const parsed = UpdateReplySchema.safeParse({ replyId, content });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('comments')
    .update({ content: parsed.data.content, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.replyId)
    .eq('author_id', user.id);

  if (error) throw new Error('Não foi possível atualizar');
  revalidatePath('/forum');
}

export async function deleteReply(replyId: string) {
  const parsed = IdSchema.safeParse({ id: replyId });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('comments')
    .delete()
    .eq('id', parsed.data.id)
    .eq('author_id', user.id);

  if (error) throw new Error('Não foi possível deletar');
  revalidatePath('/forum');
}

export async function updatePost(postId: string, title: string, content: string) {
  const parsed = UpdatePostSchema.safeParse({ postId, title, content });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('posts')
    .update({
      title: parsed.data.title,
      content: parsed.data.content,
      content_plain: parsed.data.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.postId)
    .eq('author_id', user.id);

  if (error) throw new Error('Não foi possível atualizar');
  revalidatePath('/forum');
}

export async function deletePost(postId: string) {
  const parsed = IdSchema.safeParse({ id: postId });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('posts')
    .delete()
    .eq('id', parsed.data.id)
    .eq('author_id', user.id);

  if (error) throw new Error('Não foi possível deletar');
  revalidatePath('/forum');
}

export async function adminDeletePost(postId: string) {
  const parsed = IdSchema.safeParse({ id: postId });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase } = await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('posts').delete().eq('id', parsed.data.id);
  if (error) throw new Error('Não foi possível deletar');
  revalidatePath('/forum');
}

export async function adminDeleteReply(commentId: string) {
  const parsed = IdSchema.safeParse({ id: commentId });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase } = await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('comments').delete().eq('id', parsed.data.id);
  if (error) throw new Error('Não foi possível deletar');
  revalidatePath('/forum');
}

export async function reportContent(
  postId?: string,
  commentId?: string,
  reason: 'inappropriate' | 'spam' | 'harassment' | 'offtopic' | 'other' = 'inappropriate',
) {
  const parsed = ReportSchema.safeParse({ postId, commentId, reason });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase, user } = await requireUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reports').insert({
    reporter_id: user.id,
    post_id: parsed.data.postId ?? null,
    comment_id: parsed.data.commentId ?? null,
    reason: parsed.data.reason,
  });
  if (error) throw new Error('Não foi possível reportar');
}

export async function dismissReport(reportId: string) {
  const parsed = IdSchema.safeParse({ id: reportId });
  if (!parsed.success) throw new Error(firstError(parsed.error.issues));

  const { supabase } = await requireAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', parsed.data.id);
  if (error) throw new Error('Não foi possível atualizar relatório');
}
