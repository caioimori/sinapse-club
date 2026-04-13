import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encarregado de Proteção de Dados (DPO)",
  description:
    "Canal oficial do Encarregado de Proteção de Dados Pessoais do sinapse.club. Exerça seus direitos LGPD.",
};

export default function DpoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground">
        ← Voltar para Política de Privacidade
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Encarregado de Proteção de Dados (DPO)
      </h1>

      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <p>
          Em cumprimento ao Art. 41 da Lei Geral de Proteção de Dados Pessoais
          (Lei nº 13.709/2018 — LGPD), o sinapse.club designou um Encarregado
          para atuar como canal de comunicação entre o controlador dos dados
          (sinapse.club), os titulares dos dados (você) e a Autoridade Nacional
          de Proteção de Dados (ANPD).
        </p>

        <section>
          <h2 className="text-xl font-semibold">Como falar com o DPO</h2>
          <p className="mt-2">
            Para exercer qualquer um dos direitos previstos no Art. 18 da LGPD
            (acesso, correção, portabilidade, anonimização, eliminação, revogação
            de consentimento, entre outros), ou para reportar incidentes de
            segurança, entre em contato por um dos canais abaixo:
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:dpo@sinapse.club"
                className="underline hover:text-foreground"
              >
                dpo@sinapse.club
              </a>
            </li>
            <li>
              <strong>Prazo de resposta:</strong> até 15 dias corridos a partir
              do recebimento da solicitação.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Seus direitos (Art. 18 LGPD)</h2>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>
              <strong>Acesso:</strong> confirmar a existência de tratamento e
              acessar seus dados.
            </li>
            <li>
              <strong>Correção:</strong> corrigir dados incompletos, inexatos ou
              desatualizados.
            </li>
            <li>
              <strong>Anonimização / bloqueio / eliminação:</strong> de dados
              desnecessários, excessivos ou tratados em desconformidade.
            </li>
            <li>
              <strong>Portabilidade:</strong>{" "}
              <Link href="/api/user/export" className="underline hover:text-foreground">
                baixar uma cópia JSON dos seus dados
              </Link>
              , diretamente pela sua área de configurações.
            </li>
            <li>
              <strong>Eliminação:</strong> dos dados tratados com base em
              consentimento (Art. 15, LGPD).
            </li>
            <li>
              <strong>Informação:</strong> sobre compartilhamento de dados com
              terceiros.
            </li>
            <li>
              <strong>Revogação de consentimento:</strong> a qualquer momento,
              sem custo.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Reportar incidente</h2>
          <p className="mt-2">
            Se você identificar um incidente de segurança envolvendo seus dados
            pessoais, por favor entre em contato imediatamente em{" "}
            <a
              href="mailto:dpo@sinapse.club?subject=Incidente%20de%20seguran%C3%A7a"
              className="underline hover:text-foreground"
            >
              dpo@sinapse.club
            </a>
            . Temos o compromisso de notificar a ANPD e os titulares afetados em
            prazo razoável, conforme o Art. 48 da LGPD.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Autoridade Nacional</h2>
          <p className="mt-2">
            Caso sua solicitação não seja atendida adequadamente, você pode
            registrar uma reclamação junto à Autoridade Nacional de Proteção de
            Dados (ANPD) em{" "}
            <a
              href="https://www.gov.br/anpd/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              gov.br/anpd
            </a>
            .
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
      </p>
    </div>
  );
}
