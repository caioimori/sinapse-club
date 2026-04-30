import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | sinapse.club",
  description: "Como a sinapse.club coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold mb-3 text-foreground">Política de Privacidade</h1>
          <p className="text-muted-foreground text-sm">
            Última atualização: 11 de abril de 2026 &nbsp;·&nbsp; Vigência imediata
          </p>
        </div>

        <div className="max-w-none space-y-10 text-[15px] leading-relaxed">

          {/* 1. Controlador */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Controlador dos Dados</h2>
            <p className="text-foreground/80">
              A <strong className="text-foreground">sinapse.club</strong> é a plataforma de comunidade para profissionais de inteligência artificial, operada por Caio Imori. Para fins da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD), a sinapse.club atua como <strong className="text-foreground">controladora</strong> dos dados pessoais tratados nesta plataforma.
            </p>
            <p className="text-foreground/80 mt-2">
              <strong className="text-foreground">Contato:</strong>{" "}
              <a href="mailto:privacidade@sinapse.club" className="text-foreground underline hover:opacity-70">
                privacidade@sinapse.club
              </a>
            </p>
          </section>

          {/* 2. Dados coletados */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Dados Pessoais Coletados</h2>
            <p className="text-foreground/80 mb-3">
              Coletamos apenas os dados necessários para o funcionamento da plataforma:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li><strong className="text-foreground">Dados de cadastro:</strong> nome completo, endereço de e-mail, nome de usuário (username)</li>
              <li><strong className="text-foreground">Dados de autenticação OAuth:</strong> foto de perfil, nome e e-mail fornecidos pelo Google ou GitHub ao realizar login social</li>
              <li><strong className="text-foreground">Conteúdo publicado:</strong> posts, comentários, enquetes, imagens enviadas pelo usuário</li>
              <li><strong className="text-foreground">Dados de uso:</strong> páginas visitadas, interações com conteúdo, timestamps de acesso</li>
              <li><strong className="text-foreground">Dados de perfil (opcionais):</strong> headline, bio, localização, empresa, website, username do GitHub</li>
              <li><strong className="text-foreground">Dados de pagamento:</strong> processados exclusivamente pela AbacatePay — não armazenamos dados de cartão</li>
            </ul>
          </section>

          {/* 3. Base legal */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Base Legal para o Tratamento</h2>
            <p className="text-foreground/80 mb-3">
              O tratamento de dados pessoais na sinapse.club é realizado com fundamento nas seguintes bases legais da LGPD:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li><strong className="text-foreground">Consentimento (Art. 7º, I):</strong> coletado explicitamente no ato do cadastro, por meio de checkbox de aceite dos Termos de Uso e desta Política de Privacidade</li>
              <li><strong className="text-foreground">Execução de contrato (Art. 7º, V):</strong> tratamento necessário para prestar os serviços contratados pelo usuário (acesso à plataforma, gestão de conta, processamento de assinatura)</li>
              <li><strong className="text-foreground">Interesse legítimo (Art. 7º, IX):</strong> dados de uso para melhorias da plataforma, segurança e prevenção a fraudes, respeitando os direitos e expectativas dos titulares</li>
              <li><strong className="text-foreground">Cumprimento de obrigação legal (Art. 7º, II):</strong> quando exigido por lei ou autoridade competente</li>
            </ul>
          </section>

          {/* 4. Finalidades */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Finalidades do Tratamento</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li>Criação e gestão de conta de usuário</li>
              <li>Operação da plataforma de comunidade (fórum, feed, conteúdo)</li>
              <li>Comunicação com o usuário sobre sua conta, atualizações da plataforma e novidades relevantes</li>
              <li>Processamento de assinaturas e pagamentos</li>
              <li>Melhoria contínua do serviço com base em dados de uso agregados e anonimizados</li>
              <li>Segurança, prevenção a fraudes e cumprimento de obrigações legais</li>
              <li>Notificações sobre interações com seu conteúdo (respostas, curtidas, menções)</li>
            </ul>
          </section>

          {/* 5. Subprocessadores */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Subprocessadores e Transferências Internacionais</h2>
            <p className="text-foreground/80 mb-3">
              Para operar a plataforma, compartilhamos dados com os seguintes prestadores de serviço:
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-foreground/80">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Empresa</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Finalidade</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">País</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Salvaguarda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3">Supabase</td>
                    <td className="px-4 py-3">Banco de dados, autenticação, armazenamento de arquivos</td>
                    <td className="px-4 py-3">EUA</td>
                    <td className="px-4 py-3">Adequação GDPR, SCCs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Vercel</td>
                    <td className="px-4 py-3">Hospedagem e entrega da aplicação web</td>
                    <td className="px-4 py-3">EUA</td>
                    <td className="px-4 py-3">SCCs (GDPR)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">AbacatePay</td>
                    <td className="px-4 py-3">Processamento de pagamentos e assinaturas</td>
                    <td className="px-4 py-3">Brasil</td>
                    <td className="px-4 py-3">LGPD</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Google OAuth</td>
                    <td className="px-4 py-3">Autenticação via conta Google (opcional)</td>
                    <td className="px-4 py-3">EUA</td>
                    <td className="px-4 py-3">SCCs (GDPR)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">GitHub OAuth</td>
                    <td className="px-4 py-3">Autenticação e sincronização de repositórios (opcional)</td>
                    <td className="px-4 py-3">EUA</td>
                    <td className="px-4 py-3">SCCs (GDPR)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-sm mt-3">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing.
            </p>
          </section>

          {/* 6. Retenção */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Retenção e Exclusão de Dados</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li><strong className="text-foreground">Conta ativa:</strong> os dados são mantidos enquanto a conta estiver ativa e o serviço estiver sendo utilizado</li>
              <li><strong className="text-foreground">Após exclusão da conta:</strong> os dados pessoais identificáveis são removidos ou anonimizados em até <strong className="text-foreground">30 dias</strong> após a solicitação de exclusão</li>
              <li><strong className="text-foreground">Conteúdo publicado:</strong> posts e comentários são anonimizados (autor desvinculado) mas o conteúdo pode ser mantido por interesse legítimo da comunidade, salvo solicitação contrária</li>
              <li><strong className="text-foreground">Dados financeiros:</strong> registros de transações podem ser retidos pelo prazo legal de 5 anos (Lei nº 9.613/1998)</li>
              <li><strong className="text-foreground">Logs de segurança:</strong> mantidos por até 12 meses para fins de segurança e auditoria</li>
            </ul>
          </section>

          {/* 7. Direitos do titular */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Seus Direitos como Titular (Art. 18 LGPD)</h2>
            <p className="text-foreground/80 mb-3">
              Você tem os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li><strong className="text-foreground">Acesso:</strong> saber quais dados pessoais tratamos sobre você</li>
              <li><strong className="text-foreground">Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong className="text-foreground">Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade com a LGPD</li>
              <li><strong className="text-foreground">Portabilidade:</strong> receber seus dados em formato estruturado e interoperável</li>
              <li><strong className="text-foreground">Eliminação:</strong> excluir dados tratados com base em consentimento</li>
              <li><strong className="text-foreground">Informação:</strong> sobre com quem compartilhamos seus dados</li>
              <li><strong className="text-foreground">Revogação do consentimento:</strong> a qualquer momento, sem prejuízo da licitude do tratamento anterior</li>
              <li><strong className="text-foreground">Oposição:</strong> ao tratamento realizado com base em interesse legítimo</li>
            </ul>
          </section>

          {/* 8. Como exercer direitos */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Como Exercer Seus Direitos</h2>
            <p className="text-foreground/80 mb-2">
              Para exercer qualquer um dos direitos acima, você pode:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li>
                Enviar e-mail para{" "}
                <a href="mailto:privacidade@sinapse.club" className="text-foreground underline hover:opacity-70">
                  privacidade@sinapse.club
                </a>{" "}
                com o assunto &quot;Direitos LGPD — [seu pedido]&quot;
              </li>
              <li>
                Utilizar o botão <strong className="text-foreground">&quot;Excluir minha conta&quot;</strong> em{" "}
                <Link href="/settings" className="text-foreground underline hover:opacity-70">
                  Configurações
                </Link>{" "}
                para solicitar exclusão imediata
              </li>
            </ul>
            <p className="text-muted-foreground text-sm mt-3">
              Responderemos às solicitações em até <strong className="text-foreground">15 dias úteis</strong>, conforme prazo estabelecido pela ANPD.
            </p>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Cookies e Tecnologias Similares</h2>
            <p className="text-foreground/80 mb-2">
              Utilizamos apenas <strong className="text-foreground">cookies funcionais e estritamente necessários</strong>:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
              <li><strong className="text-foreground">Cookies de sessão:</strong> mantêm você autenticado durante o uso da plataforma</li>
              <li><strong className="text-foreground">Cookies de autenticação:</strong> gerados pelo Supabase para gerenciar a sessão de login</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-3">
              Não utilizamos cookies de rastreamento de terceiros, pixels de anúncios, Google Analytics ou qualquer tecnologia de rastreamento comportamental.
            </p>
          </section>

          {/* 10. Segurança */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Segurança dos Dados</h2>
            <p className="text-foreground/80">
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais, incluindo: criptografia em trânsito (TLS/HTTPS), criptografia em repouso (via Supabase), controle de acesso baseado em políticas RLS (Row Level Security), autenticação multi-fator para contas administrativas e monitoramento contínuo de segurança.
            </p>
          </section>

          {/* 11. Notificação de incidentes */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Notificação de Incidentes de Segurança</h2>
            <p className="text-foreground/80">
              Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a sinapse.club notificará os usuários afetados e a Autoridade Nacional de Proteção de Dados (ANPD) em até <strong className="text-foreground">72 horas</strong> após a confirmação do incidente, conforme Resolução CD/ANPD nº 15/2023.
            </p>
          </section>

          {/* 12. DPO */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Encarregado de Proteção de Dados (DPO)</h2>
            <p className="text-foreground/80">
              Em conformidade com o Art. 41 da LGPD, designamos um Encarregado de Proteção de Dados:
            </p>
            <div className="mt-3 p-4 bg-card rounded-lg border border-border">
              <p className="text-foreground/80"><strong className="text-foreground">Nome:</strong> Caio Imori</p>
              <p className="text-foreground/80 mt-1">
                <strong className="text-foreground">E-mail:</strong>{" "}
                <a href="mailto:privacidade@sinapse.club" className="text-foreground underline hover:opacity-70">
                  privacidade@sinapse.club
                </a>
              </p>
              <p className="text-foreground/80 mt-1"><strong className="text-foreground">Designado em:</strong> 11 de abril de 2026</p>
            </div>
          </section>

          {/* 13. Atualizações */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Atualizações desta Política</h2>
            <p className="text-foreground/80">
              Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos os usuários sobre mudanças relevantes por e-mail e/ou por aviso na plataforma com antecedência mínima de 15 dias antes da entrada em vigor das alterações. A data da última atualização consta no topo deste documento.
            </p>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-border flex flex-wrap gap-4 text-sm">
            <Link href="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <a href="mailto:privacidade@sinapse.club" className="text-muted-foreground hover:text-foreground transition-colors">
              privacidade@sinapse.club
            </a>
            <Link href="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
              Voltar à plataforma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
