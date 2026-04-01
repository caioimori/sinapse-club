import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { ThreadCreateForm } from "@/components/forum/thread-create-form";

export const metadata = {
  title: "Novo Thread",
};

export default function ForumNewThreadPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
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

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-5">
        <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Carregando...</div>}>
          <ThreadCreateForm />
        </Suspense>
      </div>
    </div>
  );
}
