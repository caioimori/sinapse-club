import Link from "next/link";
import { Compass } from "lucide-react";

export default function ForumNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Compass className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Nada por aqui</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Essa categoria ou post não existe — ou foi removido pela moderação.
      </p>
      <Link
        href="/forum"
        className="mt-2 inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground hover:bg-primary/80"
      >
        Voltar para o feed
      </Link>
    </div>
  );
}
