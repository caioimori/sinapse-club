import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LpCtaFinal() {
  return (
    <section className="relative border-t border-border bg-foreground py-24 text-background sm:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-6 text-4xl font-semibold tracking-tight sm:text-6xl">
          Por menos que um almoço.
          <br />
          <span className="text-background/60">Por mais do que você imagina.</span>
        </h2>

        <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-background/70 sm:text-lg">
          Entre na comunidade, faça a primeira pergunta hoje, comece a aplicar
          IA na operação real já na próxima semana.
        </p>

        <div>
          <Link
            href="#pricing"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 bg-background text-foreground border-0 px-8 text-sm font-semibold hover:bg-background/90"
            )}
          >
            Escolher meu plano
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <p className="mt-5 text-xs text-background/50">
            7 dias de garantia · cancele quando quiser · pix, cartão ou boleto
          </p>
        </div>
      </div>
    </section>
  );
}
