import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Shield, Trash2, X } from "lucide-react";
import { adminDeletePost, adminDeleteReply, dismissReport } from "@/app/(dashboard)/forum/actions";

export const metadata = {
  title: "Moderação — Admin",
};

export default async function ModerationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/forum");

  // Fetch pending reports with post/comment details
  const { data: reports } = await (supabase as any)
    .from("reports")
    .select(
      `
      id, reason, status, created_at,
      reporter:profiles!reporter_id(username, display_name),
      post:posts!post_id(id, title, content_plain, author_id, profiles!author_id(username, display_name)),
      comment:comments!comment_id(id, content, author_id, profiles!author_id(username, display_name))
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  const pendingReports = reports ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-amber-500" />
        <div>
          <h1 className="text-2xl font-bold">Moderação</h1>
          <p className="text-sm text-muted-foreground">
            {pendingReports.length} report{pendingReports.length !== 1 ? "s" : ""} pendente
            {pendingReports.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {pendingReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Shield className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Nenhum report pendente</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Tudo limpo por aqui 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingReports.map((report: any) => {
            const isPostReport = !!report.post;
            const contentAuthor = isPostReport
              ? report.post?.profiles?.display_name ?? report.post?.profiles?.username
              : report.comment?.profiles?.display_name ?? report.comment?.profiles?.username;
            const contentPreview = isPostReport
              ? (report.post?.title ?? report.post?.content_plain ?? "")?.slice(0, 120)
              : (report.comment?.content ?? "")?.slice(0, 120);
            const contentId = isPostReport ? report.post?.id : report.comment?.id;
            const reporterName =
              report.reporter?.display_name ?? report.reporter?.username ?? "Anônimo";

            return (
              <div
                key={report.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-amber-500">
                        {isPostReport ? "Post" : "Comentário"}
                      </span>
                      <span>·</span>
                      <span>por {contentAuthor}</span>
                      <span>·</span>
                      <span>reportado por {reporterName}</span>
                      <span>·</span>
                      <span className="capitalize">{report.reason}</span>
                    </div>
                    <p className="text-sm text-foreground/80 truncate">{contentPreview}</p>
                    {isPostReport && contentId && (
                      <Link
                        href={`/forum/thread/${contentId}`}
                        className="text-xs text-muted-foreground underline hover:text-foreground"
                        target="_blank"
                      >
                        Ver thread →
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete content */}
                  <form
                    action={async () => {
                      "use server";
                      if (isPostReport && report.post?.id) {
                        await adminDeletePost(report.post.id);
                      } else if (!isPostReport && report.comment?.id) {
                        await adminDeleteReply(report.comment.id);
                      }
                      await dismissReport(report.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Excluir conteúdo
                    </button>
                  </form>

                  {/* Dismiss report */}
                  <form
                    action={async () => {
                      "use server";
                      await dismissReport(report.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Dispensar
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
