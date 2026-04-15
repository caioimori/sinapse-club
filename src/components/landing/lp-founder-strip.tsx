/* eslint-disable @next/next/no-img-element */

export function LpFounderStrip() {
  return (
    <section
      aria-label="Fundadores"
      className="border-t border-border bg-card py-10 sm:py-12"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div className="flex -space-x-3">
          <img
            src="/matheus-soier.png"
            alt="Matheus Soier"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-card object-cover"
          />
          <img
            src="/caio-imori.png"
            alt="Caio Imori"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-card object-cover"
          />
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Construído por quem opera IA em produção todo dia, não por quem
          escreve post sobre.
        </p>
      </div>
    </section>
  );
}
