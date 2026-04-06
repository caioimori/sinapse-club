import { redirect } from "next/navigation";

export default async function ForumNewThreadPage() {
  redirect("/forum");
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4 flex-shrink-0" />
        <Link
          href="/forum"
          className="hover:text-foreground transition-colors"
        >
          Forum
        </Link>
        <ChevronRight className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium text-foreground">Novo Thread</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Novo Thread
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compartilhe uma duvida, ideia ou topico com a comunidade.
        </p>
      </div>

      {/* Thread limit warning */}
      {threadLimitReached && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Limite de threads atingido</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Membros Free podem criar ate 3 threads por mes.{" "}
              <Link href="/pricing?upgrade=pro&from=/forum/new" className="underline hover:text-foreground transition-colors">
                Faca upgrade para Pro
              </Link>{" "}
              para threads ilimitados.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      {!threadLimitReached && (
        <div className="rounded-lg border border-border bg-card p-5">
          <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Carregando...</div>}>
            <ThreadCreateForm
              userRole={userRole}
              threadsCreatedThisMonth={threadsCreatedThisMonth}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
