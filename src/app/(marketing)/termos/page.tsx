import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | sinapse.club",
  description: "Termos e condições de uso da plataforma sinapse.club.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold mb-3">Termos de Uso</h1>
          <p className="text-zinc-400 text-sm">
            Última atualização: 11 de abril de 2026 &nbsp;·&nbsp; Vigência imediata
          </p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-10 text-[15px] leading-relaxed">

          {/* 1. Aceitação */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
            <p className="text-zinc-300">
              Ao criar uma conta ou utilizar a plataforma <strong>sinapse.club</strong>, você declara ter lido, compreendido e concordado com estes Termos de Uso e com nossa{" "}
              <Link href="/privacidade" className="text-white underline hover:text-zinc-300">
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer disposição, você não deve criar uma conta ou utilizar o serviço.
            </p>
          </section>

          {/* 2. Serviço */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Descrição do Serviço</h2>
            <p className="text-zinc-300">
              A sinapse.club é uma plataforma de comunidade online voltada a profissionais de inteligência artificial. O serviço inclui fórum de discussão, feed de conteúdo, perfis de usuário, acesso a curadoria de conteúdo sobre IA e, para assinantes, recursos premium como mentorias e conteúdos exclusivos.
            </p>
          </section>

          {/* 3. Elegibilidade */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Elegibilidade</h2>
            <p className="text-zinc-300">
              Para criar uma conta na sinapse.club, você deve:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2 mt-2">
              <li>Ter <strong>18 anos ou mais</strong></li>
              <li>Ter capacidade legal para celebrar contratos</li>
              <li>Não ter tido conta previamente suspensa ou encerrada por violação destes Termos</li>
              <li>Concordar com estes Termos de Uso e com a Política de Privacidade</li>
            </ul>
          </section>

          {/* 4. Uso aceitável */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Uso Aceitável</h2>
            <p className="text-zinc-300 mb-3">
              Ao usar a sinapse.club, você se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>Publicar conteúdo profissional, relevante e de boa qualidade relacionado a inteligência artificial e áreas correlatas</li>
              <li>Tratar outros membros com respeito, mesmo em caso de discordância</li>
              <li>Identificar-se com suas informações reais no cadastro</li>
              <li>Manter a confidencialidade das suas credenciais de acesso</li>
              <li>Reportar conteúdo inadequado ou violações destes Termos à equipe da plataforma</li>
            </ul>
          </section>

          {/* 5. Proibições */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Condutas Proibidas</h2>
            <p className="text-zinc-300 mb-3">
              É expressamente proibido:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 pl-2">
              <li>Criar contas falsas, perfis fictícios ou se passar por outra pessoa</li>
              <li>Publicar spam, conteúdo promocional não solicitado ou links de afiliado sem identificação</li>
              <li>Publicar conteúdo violento, de ódio, discriminatório, obsceno ou ilegal</li>
              <li>Assediar, ameaçar ou intimidar outros usuários</li>
              <li>Vender ou transferir o acesso à sua conta para terceiros</li>
              <li>Realizar scraping, crawling ou coleta automatizada de dados da plataforma sem autorização prévia</li>
              <li>Tentar burlar mecanismos de segurança, acessar contas de outros usuários ou sistemas internos</li>
              <li>Publicar informações confidenciais de terceiros sem autorização</li>
              <li>Usar a plataforma para fins ilegais ou que violem direitos de terceiros</li>
              <li>Interferir no funcionamento normal da plataforma (ataques DDoS, injeção de código, etc.)</li>
            </ul>
          </section>

          {/* 6. Planos e pagamentos */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Planos e Pagamentos</h2>
            <p className="text-zinc-300 mb-3">
              A sinapse.club oferece os seguintes planos:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="font-medium text-white">Plano Gratuito</p>
                <p className="text-zinc-400 text-sm mt-1">Acesso limitado ao fórum e feed de conteúdo. Sem custo.</p>
              </div>
              <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="font-medium text-white">Plano Membro — a partir de R$ 29,90/mês</p>
                <p className="text-zinc-400 text-sm mt-1">Acesso completo à comunidade, conteúdos exclusivos, badge de membro e recursos premium. Disponível nos ciclos mensal (R$ 37,90), semestral (R$ 203,40) e anual (R$ 358,80). Cancelamento a qualquer momento, sem multa.</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm mt-4">
              Pagamentos são processados pela AbacatePay. Em caso de cancelamento, o acesso premium permanece ativo até o fim do período pago. Não realizamos reembolso de mensalidades já cobradas, salvo determinação legal.
            </p>
          </section>

          {/* 7. Propriedade intelectual */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Propriedade Intelectual e Conteúdo do Usuário</h2>
            <p className="text-zinc-300 mb-3">
              <strong>Seu conteúdo é seu.</strong> Você retém todos os direitos sobre o conteúdo que publica na plataforma (posts, comentários, imagens).
            </p>
            <p className="text-zinc-300">
              Ao publicar na sinapse.club, você concede uma licença não exclusiva, gratuita, mundial e sublicenciável para que a plataforma exiba, distribua e reproduza seu conteúdo dentro da plataforma e em materiais de divulgação da sinapse.club (com devida atribuição).
            </p>
            <p className="text-zinc-300 mt-3">
              O código-fonte, design, marca, logotipos e demais elementos da plataforma sinapse.club são de propriedade exclusiva da sinapse.club e não podem ser reproduzidos sem autorização.
            </p>
          </section>

          {/* 8. Exclusão de conta */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Exclusão e Suspensão de Conta</h2>
            <p className="text-zinc-300 mb-3">
              <strong>Exclusão pelo usuário:</strong> Você pode excluir sua conta a qualquer momento em{" "}
              <Link href="/settings" className="text-white underline hover:text-zinc-300">
                Configurações
              </Link>
              . Após a exclusão, seus dados pessoais serão removidos em até 30 dias, conforme nossa Política de Privacidade. O conteúdo publicado pode ser anonimizado.
            </p>
            <p className="text-zinc-300">
              <strong>Suspensão pela plataforma:</strong> A sinapse.club se reserva o direito de suspender ou encerrar contas que violem estes Termos, sem aviso prévio em casos graves. Poderemos notificar o usuário por e-mail em casos de infração não grave antes de tomar qualquer ação.
            </p>
          </section>

          {/* 9. Limitação de responsabilidade */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Limitação de Responsabilidade</h2>
            <p className="text-zinc-300">
              A sinapse.club não garante disponibilidade ininterrupta do serviço (100% de uptime). A plataforma é fornecida &quot;como está&quot; e poderá passar por manutenções programadas ou emergenciais. Não nos responsabilizamos por perdas de dados decorrentes de falhas técnicas, por conteúdo publicado por usuários, ou por danos indiretos resultantes do uso da plataforma.
            </p>
          </section>

          {/* 10. Lei aplicável */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Lei Aplicável e Foro</h2>
            <p className="text-zinc-300">
              Estes Termos são regidos pelas leis da República Federativa do Brasil, incluindo a LGPD (Lei nº 13.709/2018) e o Código de Defesa do Consumidor (Lei nº 8.078/1990). Fica eleito o foro da Comarca de <strong>São Paulo — SP</strong> para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* 11. Alterações */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Alterações nestes Termos</h2>
            <p className="text-zinc-300">
              Podemos atualizar estes Termos periodicamente. Notificaremos você por e-mail e/ou por aviso na plataforma com antecedência mínima de 15 dias antes da entrada em vigor das alterações. O uso continuado da plataforma após a data de vigência constitui aceite das novas condições.
            </p>
          </section>

          {/* 12. Contato */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contato</h2>
            <p className="text-zinc-300">
              Para dúvidas, reclamações ou solicitações relacionadas a estes Termos de Uso:
            </p>
            <p className="text-zinc-300 mt-2">
              <strong>E-mail:</strong>{" "}
              <a href="mailto:contato@sinapse.club" className="text-white underline hover:text-zinc-300">
                contato@sinapse.club
              </a>
            </p>
            <p className="text-zinc-300 mt-1">
              Para assuntos relacionados à privacidade e LGPD:{" "}
              <a href="mailto:privacidade@sinapse.club" className="text-white underline hover:text-zinc-300">
                privacidade@sinapse.club
              </a>
            </p>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-sm">
            <Link href="/privacidade" className="text-zinc-400 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <a href="mailto:contato@sinapse.club" className="text-zinc-400 hover:text-white transition-colors">
              contato@sinapse.club
            </a>
            <Link href="/forum" className="text-zinc-400 hover:text-white transition-colors">
              Voltar à plataforma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
