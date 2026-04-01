#!/usr/bin/env node
/**
 * FORUM-3: Seed sample threads and replies via Supabase REST API
 * Uses service_role key to bypass RLS
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env
const envLocal = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function insert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`INSERT ${table} failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  console.log(`  Inserted ${data.length} rows into ${table}`);
  return data;
}

async function update(table, match, data) {
  const params = new URLSearchParams(match);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`UPDATE ${table} failed: ${res.status} ${err}`);
  }
  return res.json();
}

// Profile IDs
const CAIO = 'd5044806-1817-4bc1-86fb-56315e7f6946';
const BOT = '00000000-0000-0000-0000-000000000001';

// Category IDs (from DB)
const CAT = {
  'ai-para-ads': '57a6aa22-98af-49c3-816b-a942ab6b42ba',
  'ai-para-ecommerce': '9399b6b1-b100-4ced-bc90-bb1cb83634cc',
  'ai-para-infoprodutos': '7cb0b2ca-f2f8-43cc-86b6-badae68c0b04',
  'ai-para-afiliados': 'aab087b9-171e-4636-9411-4655b797789a',
  'ai-copywriting': 'eeda4d40-4c4b-4c38-908a-9d94cd781e82',
  'ai-para-seo': 'd63f10d9-5c60-4346-a4f2-1379b55e7bf0',
  'llms-agentes': 'abaa5142-ee03-47c1-80f7-061a98fe98a1',
  'automacao-no-code': 'e57c978c-a1b3-4eb1-b732-d055ecd869a8',
  'ai-generativa': '0bcddc55-d239-4a78-b3b4-f6f0833d64e2',
  'negocios-estrategia': '3791321f-4348-43c3-892f-e2469ab61757',
  'carreira-ai': '46458050-0909-4955-9258-3baf5197920c',
  'marketplace': '0863c1da-c86d-4306-ae61-e11f14ce162f',
  'ferramentas-reviews': '3d0b82fb-c4bc-457a-be6f-99725b2e093a',
  'off-topic': 'ba770108-cb53-4385-a0e3-bd89f01ff473',
};

// Subcategory IDs (from DB)
const SUB = {
  'meta-ads-ai': '0e65a3c5-b441-4ba3-94d2-0347e878bccc',
  'google-ads-ai': 'f438a3a0-682e-41b7-ad4d-2890f5bbf5c3',
  'claude-anthropic': 'af293365-49f7-457f-a116-33ca1e3902c3',
  'agentes-autonomos': 'd9675b84-3431-4ed1-9c11-051bf91fb319',
  'prompts-copy': '2a4a25ba-f6f7-4846-ac52-720484dcf804',
  'email-marketing-ai': '83661661-2ede-4600-99c4-a0f3e5ad3090',
  'make-zapier-n8n': 'bec63606-607d-4c15-9dab-7c7a39213896',
  'modelos-negocio': '74dd7737-2808-49fc-99bc-b18ce4b9e9d1',
  'gestao-ai': 'c486aab8-5093-4493-97bc-34874da80359',
  'imagens-ai': '931e87ad-f099-496a-bacb-365d74e67963',
  'transicao-carreira': 'cae629c2-22c2-4ad1-bf26-e9908efc350e',
  'seo-tecnico-ai': 'f64a4c9d-f9b0-4e4d-a3d1-3a731a1dc879',
  'automacao-loja': 'c43383ed-2182-4d20-9b89-009d34af8a89',
  'criacao-curso-ai': '20998c5f-83da-4167-81a6-5a879782fca3',
  'reviews-tools': 'e7263d6a-e6de-4aa2-9c9b-37bc8d0b1281',
  'apresente-se': '1c8c60f5-b0c5-4862-b8b7-b62bcb83414e',
  'estrategias-afiliados-ai': '16b94540-f105-42dd-8889-32b9613a3678',
};

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

// ============================================================================
// THREADS
// ============================================================================

const threads = [
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    author_id: CAIO,
    category_id: CAT['ai-para-ads'],
    subcategory_id: SUB['meta-ads-ai'],
    title: 'Como usei GPT-4o para gerar 50 variacoes de criativos em 10 minutos',
    content: '<p>Fala pessoal! Quero compartilhar um workflow que mudou completamente minha operacao de ads.</p><p>Eu gerenciava uma conta de Meta Ads com orcamento de R$15k/mes e o maior gargalo era sempre a <strong>producao de criativos</strong>. Meu designer levava 2-3 dias para entregar 10 variacoes. Com AI, resolvi isso em minutos.</p><p><strong>O workflow:</strong></p><ul><li>Pego os 3 melhores criativos do mes anterior (maior CTR)</li><li>Jogo no GPT-4o com Vision pedindo para analisar os elementos visuais</li><li>Uso o output para gerar prompts de variacao no Midjourney</li><li>Gero 50 variacoes em lote com parametros diferentes</li><li>Filtro as 15 melhores e subo pro Ads Manager</li></ul><p>O resultado: meu <strong>CTR subiu de 1.2% para 2.8%</strong> e o CPM caiu 22% porque o Meta comecou a priorizar os criativos com melhor performance.</p><p>A sacada principal e nao pedir para a AI &quot;criar do zero&quot; &mdash; ela funciona muito melhor quando voce da uma referencia visual e pede variacoes. Alguem mais ta usando esse tipo de workflow?</p>',
    content_plain: 'Fala pessoal! Quero compartilhar um workflow que mudou completamente minha operacao de ads. CTR subiu de 1.2% para 2.8% e o CPM caiu 22%.',
    type: 'thread',
    tags: ['meta-ads', 'criativos', 'gpt-4o', 'midjourney'],
    created_at: hoursAgo(68),
    views_count: 342,
    likes_count: 18,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000002',
    author_id: BOT,
    category_id: CAT['ai-para-ads'],
    subcategory_id: SUB['google-ads-ai'],
    title: 'Meta Advantage+ com AI: meu ROAS subiu 3x — aqui esta o processo completo',
    content: '<p>Vou detalhar exatamente o que fiz para triplicar o ROAS de um e-commerce de moda feminina usando Advantage+ Shopping combinado com AI.</p><p><strong>Contexto:</strong> loja com faturamento de R$80k/mes, ROAS historico de 3.2, meta de chegar em 8+.</p><p><strong>Passo 1 &mdash; Analise de dados com Claude:</strong></p><p>Exportei os ultimos 90 dias de dados do Ads Manager (CSV) e joguei no Claude pedindo para identificar padroes. Ele encontrou que criativos com fundo branco + modelo real performavam 340% melhor que lifestyle shots.</p><p><strong>Passo 2 &mdash; Geracao massiva de copy:</strong></p><p>Criei um prompt chain no GPT-4 que gera variacoes de headline + description baseadas nos produtos mais vendidos. Cada produto recebe 8 variacoes de copy testando diferentes angulos: urgencia, prova social, beneficio direto, curiosidade.</p><p><strong>Passo 3 &mdash; Configuracao do Advantage+:</strong></p><p>Em vez de segmentar manualmente, deixei o Advantage+ com 150 criativos diferentes e orcamento de R$500/dia. O algoritmo do Meta fez o resto.</p><p><strong>Resultado apos 30 dias:</strong> ROAS foi de 3.2 para 9.7. O segredo foi dar <strong>volume de criativos de qualidade</strong> pro algoritmo otimizar. AI foi o enabler dessa escala.</p>',
    content_plain: 'ROAS de 3.2 para 9.7 usando Advantage+ Shopping com AI. 150 criativos gerados com Claude e GPT-4.',
    type: 'thread',
    tags: ['advantage-plus', 'roas', 'ecommerce', 'meta-ads'],
    created_at: hoursAgo(52),
    views_count: 487,
    likes_count: 25,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000003',
    author_id: CAIO,
    category_id: CAT['llms-agentes'],
    subcategory_id: SUB['claude-anthropic'],
    title: 'Claude vs GPT-5: qual usar para automacao de atendimento ao cliente?',
    content: '<p>To montando um sistema de atendimento automatizado para uma rede de clinicas odontologicas (12 unidades) e preciso decidir qual LLM usar como base.</p><p><strong>Requisitos do projeto:</strong></p><ul><li>Responder duvidas sobre procedimentos e precos</li><li>Agendar consultas integrando com o sistema de agenda</li><li>Lidar com reclamacoes de forma empatica</li><li>Funcionar via WhatsApp (API oficial)</li><li>Custo mensal aceitavel ate R$2k em API</li></ul><p><strong>Minha experiencia ate agora:</strong></p><p>Testei ambos por 2 semanas em ambiente de staging. O <strong>Claude</strong> se destacou em respostas longas e empaticas. O <strong>GPT-5</strong> foi melhor em seguir instrucoes rigidas tipo &quot;nunca confirme um preco sem consultar a tabela&quot;.</p><p>Em termos de custo, Claude Haiku sai mais barato para o volume que preciso (~15k mensagens/mes).</p><p>Alguem aqui ja implementou atendimento automatizado com LLM em producao? Qual modelo escolheram e por que?</p>',
    content_plain: 'Montando sistema de atendimento para clinicas. Claude melhor em empatia, GPT-5 em instrucoes rigidas. Qual escolher?',
    type: 'thread',
    tags: ['claude', 'gpt-5', 'atendimento', 'whatsapp', 'chatbot'],
    created_at: hoursAgo(45),
    views_count: 276,
    likes_count: 14,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000004',
    author_id: BOT,
    category_id: CAT['llms-agentes'],
    subcategory_id: SUB['agentes-autonomos'],
    title: 'Montei um agente com CrewAI que faz pesquisa de mercado automatizada',
    content: '<p>Depois de 3 semanas de desenvolvimento, meu agente de pesquisa de mercado com CrewAI esta em producao e quero compartilhar o que aprendi.</p><p><strong>O que o agente faz:</strong></p><ul><li>Recebe um nicho/vertical como input</li><li>Pesquisa automaticamente os top 20 players do mercado</li><li>Analisa presenca digital de cada um</li><li>Gera um relatorio com TAM/SAM/SOM estimado</li><li>Identifica gaps de mercado e oportunidades</li></ul><p><strong>Stack tecnica:</strong> <code>CrewAI</code> para orquestracao, <code>Claude Sonnet</code> como LLM base, <code>Exa</code> para pesquisa web, <code>Apify</code> para scraping, e <code>Supabase</code> para armazenar relatorios.</p><p><strong>Crew com 4 agentes:</strong></p><ol><li><strong>Researcher</strong> &mdash; busca e coleta dados brutos</li><li><strong>Analyst</strong> &mdash; processa e estrutura os dados</li><li><strong>Strategist</strong> &mdash; identifica padroes e oportunidades</li><li><strong>Reporter</strong> &mdash; gera o relatorio final em formato executivo</li></ol><p>Cada pesquisa que custaria R$5-15k em consultoria sai por menos de R$2 em API calls.</p><p>Se tiver interesse no codigo, posso compartilhar um repo no GitHub.</p>',
    content_plain: 'Agente CrewAI para pesquisa de mercado automatizada. Stack: CrewAI, Claude Sonnet, Exa, Apify, Supabase. Custo de R$2 vs R$5-15k em consultoria.',
    type: 'thread',
    tags: ['crewai', 'agentes', 'pesquisa-mercado', 'automacao'],
    created_at: hoursAgo(40),
    views_count: 512,
    likes_count: 23,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000005',
    author_id: CAIO,
    category_id: CAT['ai-copywriting'],
    subcategory_id: SUB['prompts-copy'],
    title: 'Meu framework de prompts para VSL que converte 8%+ (com exemplos reais)',
    content: '<p>Nos ultimos 6 meses testei dezenas de abordagens para gerar VSL com AI e cheguei num framework que consistentemente entrega taxas de conversao acima de 8%.</p><p><strong>O Framework AIDA-P (minha versao adaptada para AI):</strong></p><ul><li><strong>A</strong>ttention &mdash; Hook nos primeiros 3 segundos</li><li><strong>I</strong>nterest &mdash; Historia de transformacao</li><li><strong>D</strong>esire &mdash; Stack de beneficios + prova social</li><li><strong>A</strong>ction &mdash; CTA com urgencia</li><li><strong>P</strong>roof &mdash; Objecoes + garantia</li></ul><p><strong>Resultados reais:</strong></p><ul><li>VSL para curso de Excel: 8.2% de conversao</li><li>VSL para suplemento: 11.4% de conversao</li><li>VSL para SaaS B2B: 6.8% de conversao</li></ul><p>A chave e dar contexto real pro LLM. Quanto mais dados reais do seu publico voce fornece, melhor o output.</p>',
    content_plain: 'Framework AIDA-P para VSL com AI. Conversoes de 8.2%, 11.4% e 6.8%. Chave: contexto real no prompt.',
    type: 'thread',
    tags: ['vsl', 'copywriting', 'conversao', 'prompts', 'framework'],
    created_at: hoursAgo(36),
    views_count: 398,
    likes_count: 21,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000006',
    author_id: BOT,
    category_id: CAT['ai-copywriting'],
    subcategory_id: SUB['email-marketing-ai'],
    title: 'Email marketing com AI: sequencia de 7 emails que gera R$50k/mes para meu cliente',
    content: '<p>Vou abrir o jogo sobre uma sequencia de email marketing que criei com AI para um cliente do nicho de educacao financeira.</p><p><strong>Contexto:</strong> lista de 45k leads, taxa de abertura historica de 18%, faturamento por email de ~R$12k/mes.</p><p><strong>O que mudei com AI:</strong> Usei Claude para analisar 6 meses de metricas. A AI descobriu padroes criticos de horario, subject lines com numeros e tamanho ideal de email.</p><p><strong>A sequencia de 7 emails:</strong></p><ol><li><strong>Boas-vindas</strong> &mdash; Historia pessoal + promessa (open rate: 62%)</li><li><strong>Quick win</strong> &mdash; Dica aplicavel em 5 minutos (clique: 12%)</li><li><strong>Case study</strong> &mdash; Resultado de aluno real (resposta: 8%)</li><li><strong>Objecao #1</strong> &mdash; &quot;Nao tenho dinheiro pra investir&quot; (clique: 9%)</li><li><strong>Autoridade</strong> &mdash; Dados + credenciais (open: 41%)</li><li><strong>Urgencia</strong> &mdash; Oferta com prazo (clique: 15%)</li><li><strong>Ultimo aviso</strong> &mdash; Escassez real (conversao: 4.2%)</li></ol><p>Faturamento subiu de R$12k para R$53k/mes.</p>',
    content_plain: 'Sequencia de email marketing com AI. Lista de 45k leads. Faturamento subiu de R$12k para R$53k/mes.',
    type: 'thread',
    tags: ['email-marketing', 'automacao', 'copy', 'leads', 'conversao'],
    created_at: hoursAgo(31),
    views_count: 267,
    likes_count: 16,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000007',
    author_id: CAIO,
    category_id: CAT['automacao-no-code'],
    subcategory_id: SUB['make-zapier-n8n'],
    title: 'Automacao completa de onboarding com Make + GPT: passo a passo com screenshots',
    content: '<p>Implementei um fluxo de onboarding 100% automatizado para uma startup SaaS (CRM para imobiliarias).</p><p><strong>Problema:</strong> a cada novo cliente, o time de CS gastava 45 minutos fazendo setup manual.</p><p><strong>Fluxo automatizado:</strong></p><ol><li>Make recebe webhook do Stripe com dados do cliente</li><li>Cria conta no CRM via API com dados pre-preenchidos</li><li>GPT-4o analisa o segmento do cliente baseado no plano escolhido</li><li>GPT gera email de boas-vindas personalizado para o segmento</li><li>GPT cria 5 templates de pipeline customizados pro segmento</li><li>Make importa os templates no CRM do cliente</li><li>Dispara sequencia de onboarding no ActiveCampaign</li><li>Agenda call de kick-off automaticamente no Calendly</li></ol><p><strong>Resultado:</strong></p><ul><li>Tempo de onboarding: de 45 min para 0</li><li>NPS do onboarding: subiu de 7.2 para 9.1</li><li>Churn nos primeiros 30 dias: caiu de 18% para 6%</li></ul>',
    content_plain: 'Onboarding 100% automatizado com Make + GPT. Tempo de 45min para zero. NPS de 7.2 para 9.1. Churn de 18% para 6%.',
    type: 'thread',
    tags: ['make', 'onboarding', 'automacao', 'gpt', 'saas'],
    created_at: hoursAgo(28),
    views_count: 189,
    likes_count: 12,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000008',
    author_id: BOT,
    category_id: CAT['automacao-no-code'],
    subcategory_id: SUB['make-zapier-n8n'],
    title: 'N8N vs Make para integracoes com AI: qual escolher em 2026?',
    content: '<p>Depois de usar ambas por mais de 1 ano em projetos reais com AI, decidi fazer um comparativo honesto.</p><p><strong>Make:</strong></p><ul><li><strong>Pros:</strong> Interface visual excelente, facil de ensinar, marketplace de templates, execucao confiavel</li><li><strong>Contras:</strong> Precificacao por operacao encarece rapido, limites no free, sem self-hosting</li><li><strong>Melhor para:</strong> Agencias que entregam automacoes para clientes</li></ul><p><strong>N8N:</strong></p><ul><li><strong>Pros:</strong> Self-hosted (custo fixo), sem limite de execucoes, nodes customizaveis com JS, AI nodes nativos excelentes</li><li><strong>Contras:</strong> Curva de aprendizado maior, precisa de servidor</li><li><strong>Melhor para:</strong> Devs/tecnico, projetos com alto volume, controle total</li></ul><p><strong>Recomendacao:</strong></p><ul><li>Ate 1000 execucoes/mes &rarr; Make</li><li>10000+ execucoes/mes &rarr; N8N self-hosted (~R$50/mes no Railway)</li></ul><p>Para AI, N8N esta na frente com AI Agent nodes.</p>',
    content_plain: 'Comparativo N8N vs Make para AI. Make para agencias, N8N para alto volume. N8N na frente com AI Agent nodes.',
    type: 'thread',
    tags: ['n8n', 'make', 'automacao', 'comparativo', 'no-code'],
    created_at: hoursAgo(24),
    views_count: 324,
    likes_count: 19,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000009',
    author_id: CAIO,
    category_id: CAT['negocios-estrategia'],
    subcategory_id: SUB['modelos-negocio'],
    title: 'Sai de CLT para montar agencia de AI — faturando R$30k/mes em 6 meses',
    content: '<p>Ha exatamente 6 meses pedi demissao de um cargo de analista de marketing ganhando R$6.500. Hoje faturo R$30k/mes com minha agencia focada em AI para pequenos negocios.</p><p><strong>Mes 1-2: Validacao</strong></p><p>Comecei oferecendo servicos para conhecidos. Cobrava R$500-1000 por projeto. Peguei 4 clientes.</p><p><strong>Mes 3-4: Posicionamento</strong></p><p>Defini meu nicho: <strong>clinicas e consultorios</strong>. Subi o preco para R$2-3k + R$500/mes de manutencao.</p><p><strong>Mes 5-6: Escala</strong></p><p>8 clientes recorrentes. Pacotes padronizados:</p><ul><li><strong>Starter (R$1.500):</strong> Chatbot WhatsApp com agendamento</li><li><strong>Growth (R$3.000):</strong> Starter + automacao de follow-up + relatorios</li><li><strong>Premium (R$5.000):</strong> Growth + dashboard + integracao prontuario</li></ul><p><strong>Stack:</strong> N8N, Claude API, Supabase, Vercel. Custo operacional: ~R$200/mes.</p><p>A melhor decisao foi focar num nicho.</p>',
    content_plain: 'De CLT (R$6.500) para agencia de AI faturando R$30k/mes em 6 meses. Nicho: clinicas. Stack: N8N, Claude, Supabase, Vercel.',
    type: 'thread',
    tags: ['agencia', 'empreendedorismo', 'nicho', 'clt', 'faturamento'],
    created_at: hoursAgo(62),
    views_count: 456,
    likes_count: 22,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000010',
    author_id: BOT,
    category_id: CAT['negocios-estrategia'],
    subcategory_id: SUB['gestao-ai'],
    title: 'Como precificar servicos de AI para pequenas empresas — guia pratico',
    content: '<p>Uma das maiores dificuldades de quem comeca a vender servicos de AI e saber quanto cobrar.</p><p><strong>Regra #1: Nunca cobre por hora</strong></p><p>Se voce cobra por hora e usa AI para fazer em 30 minutos o que levaria 8 horas, voce se pune por ser eficiente. Cobre por <strong>valor entregue</strong>.</p><p><strong>Framework de precificacao &quot;10x&quot;:</strong></p><ol><li>Calcule quanto o cliente gasta/perde SEM a solucao</li><li>Sua solucao deve custar no maximo 1/10 disso</li><li>O cliente economiza 10x &mdash; facil de justificar</li></ol><p><strong>Tabela de referencia (mercado brasileiro 2026):</strong></p><ul><li><strong>Chatbot basico WhatsApp:</strong> R$1.500-3.000 setup + R$300-500/mes</li><li><strong>Automacao de processos:</strong> R$2.000-5.000 por fluxo</li><li><strong>Agente AI customizado:</strong> R$5.000-15.000 setup + R$500-1.500/mes</li><li><strong>Consultoria estrategica:</strong> R$3.000-8.000 por projeto</li><li><strong>Treinamento de equipe:</strong> R$2.000-5.000 por workshop</li></ul>',
    content_plain: 'Framework de precificacao para servicos de AI. Regra 10x: solucao custa 1/10 do que o cliente gasta sem ela.',
    type: 'thread',
    tags: ['precificacao', 'consultoria', 'servicos', 'negocios'],
    created_at: hoursAgo(55),
    views_count: 213,
    likes_count: 15,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000011',
    author_id: CAIO,
    category_id: CAT['ai-generativa'],
    subcategory_id: SUB['imagens-ai'],
    title: 'Workflow de criacao de thumbnails com Midjourney que geram 2x mais cliques',
    content: '<p>Gerencio um canal de YouTube com 180k inscritos e descobri que thumbnails geradas com AI performam significativamente melhor.</p><p><strong>Dados:</strong> CTR media das thumbnails antigas era 4.2%. Depois do workflow com AI, subiu para 8.7%.</p><p><strong>O processo:</strong></p><ol><li>Jogo as 10 thumbnails de melhor CTR no Claude Vision e peco para identificar padroes visuais</li><li>Transformo esses padroes em prompts Midjourney</li><li>Crio 8-12 variacoes por video</li><li>A/B testing com TubeBuddy por 48h</li><li>Dados de performance alimentam o proximo ciclo</li></ol><p><strong>Prompt template:</strong></p><p><code>cinematic close-up portrait, [expressao], [cor] background, bold white text overlay &quot;[titulo]&quot;, high contrast, YouTube thumbnail style, 16:9 --ar 16:9 --v 6.1</code></p><p><strong>Dicas:</strong></p><ul><li>Rostos com expressoes exageradas funcionam melhor</li><li>Maximo 3-4 palavras no texto overlay</li><li>Contraste alto entre fundo e texto e essencial</li><li>Cores quentes geram mais cliques que frias</li></ul>',
    content_plain: 'Workflow de thumbnails com Midjourney para YouTube. CTR de 4.2% para 8.7%. Processo com Claude Vision + Midjourney + TubeBuddy.',
    type: 'thread',
    tags: ['midjourney', 'thumbnails', 'youtube', 'ctr', 'design'],
    created_at: hoursAgo(20),
    views_count: 178,
    likes_count: 11,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000012',
    author_id: BOT,
    category_id: CAT['carreira-ai'],
    subcategory_id: SUB['transicao-carreira'],
    title: 'De dev junior a AI Engineer: meu roadmap de 12 meses (com recursos gratuitos)',
    content: '<p>Ha 1 ano eu era dev junior trabalhando com PHP e Laravel. Hoje sou AI Engineer ganhando 3x mais.</p><p><strong>Meses 1-3: Fundamentos de ML</strong></p><ul><li>Fast.ai (gratuito)</li><li>3Blue1Brown Neural Networks (YouTube)</li><li>Kaggle Learn (gratuito)</li></ul><p><strong>Meses 4-6: LLMs e NLP</strong></p><ul><li>Hugging Face Course (gratuito)</li><li>Documentacao OpenAI e Anthropic</li><li>3 chatbots e 1 sistema RAG</li></ul><p><strong>Meses 7-9: Engenharia de AI</strong></p><ul><li>LangChain/LlamaIndex</li><li>Vector databases (Pinecone, Weaviate)</li><li>Deploy: Docker, AWS/GCP</li></ul><p><strong>Meses 10-12: Especializacao</strong></p><ul><li>AI Agents (CrewAI, AutoGen)</li><li>2 projetos open source</li><li>Portfolio no GitHub</li></ul><p><strong>Resultado:</strong> 4 propostas de emprego, aceitei AI Engineer remoto, R$18k.</p>',
    content_plain: 'Roadmap de dev junior para AI Engineer em 12 meses. Recursos gratuitos. 4 propostas, salario de R$18k remoto.',
    type: 'thread',
    tags: ['carreira', 'roadmap', 'ai-engineer', 'transicao', 'estudo'],
    created_at: hoursAgo(58),
    views_count: 389,
    likes_count: 20,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000013',
    author_id: CAIO,
    category_id: CAT['ai-para-seo'],
    subcategory_id: SUB['seo-tecnico-ai'],
    title: '[Resolvido] Como automatizei auditoria SEO de 200 paginas com Claude + Screaming Frog',
    content: '<p>Recebi projeto de auditoria SEO para portal de noticias com 200+ paginas ativas. Com AI, fiz em 2 dias.</p><p><strong>Ferramentas:</strong> Screaming Frog, Google Search Console, Claude Sonnet, Python.</p><p><strong>Processo:</strong></p><ol><li>Exportei crawl do Screaming Frog (CSV)</li><li>Exportei dados de performance do GSC</li><li>Script Python alimenta Claude com 10 paginas por vez</li><li>Claude analisa: title, meta, H1, internal linking, conteudo</li><li>Gera recomendacoes especificas por pagina</li></ol><p><strong>Claude encontrou:</strong></p><ul><li>43 paginas com title tag duplicado</li><li>17 paginas com keyword cannibalization</li><li>89 orphan pages sem internal links</li></ul><p>Trafego organico subiu 47% em 60 dias.</p>',
    content_plain: 'Auditoria SEO de 200+ paginas com Claude + Screaming Frog + Python. Trafego organico subiu 47% em 60 dias.',
    type: 'thread',
    tags: ['seo', 'auditoria', 'claude', 'screaming-frog', 'tecnico'],
    created_at: hoursAgo(16),
    views_count: 156,
    likes_count: 9,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000014',
    author_id: BOT,
    category_id: CAT['ai-para-ecommerce'],
    subcategory_id: SUB['automacao-loja'],
    title: 'Descricoes de produto com AI que aumentaram minha conversao em 34%',
    content: '<p>E-commerce de cosmeticos naturais com ~800 SKUs. Reescrevi todas as descricoes com AI em 1 semana.</p><p><strong>Abordagem que funcionou:</strong></p><ol><li>Analisei as 20 descricoes com maior conversao</li><li>Claude extraiu tom de voz e estrutura</li><li>Criei prompt template com tom, estrutura, beneficios por categoria</li><li>Processei em lotes de 50 via API</li><li>Revisao manual de ~20% (produtos hero)</li></ol><p><strong>Estrutura da descricao:</strong></p><ul><li>Headline emocional</li><li>Beneficio principal</li><li>Ingredientes-chave com explicacao</li><li>Como usar (passo a passo)</li><li>Para quem e indicado</li><li>Selo/certificacao</li></ul><p><strong>Numeros:</strong> Conversao subiu de 2.1% para 2.82%. Com 120k visitas/mes, sao ~860 vendas adicionais/mes.</p>',
    content_plain: 'Descricoes de 800 SKUs com AI em 1 semana. Conversao de 2.1% para 2.82%. Chave: extrair tom de voz dos melhores textos.',
    type: 'thread',
    tags: ['ecommerce', 'descricoes', 'conversao', 'copywriting', 'cosmeticos'],
    created_at: hoursAgo(48),
    views_count: 198,
    likes_count: 13,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000015',
    author_id: CAIO,
    category_id: CAT['ai-para-infoprodutos'],
    subcategory_id: SUB['criacao-curso-ai'],
    title: 'Criei um curso online do zero ate o lancamento em 15 dias usando AI — R$47k no primeiro lancamento',
    content: '<p>Documentando o processo de criar e lancar um curso de &quot;Automacao com AI para Dentistas&quot; em 15 dias.</p><p><strong>Dia 1-3: Pesquisa e validacao</strong></p><ul><li>Claude analisou 50 posts de grupos de Facebook de dentistas</li><li>3 entrevistas rapidas com dentistas</li><li>Claude estruturou a grade curricular</li></ul><p><strong>Dia 4-8: Producao de conteudo</strong></p><ul><li>Claude gerou roteiro de cada aula (15 aulas, ~20 min cada)</li><li>Gravei usando roteiros como guia</li><li>AI transcreveu e gerou resumos</li></ul><p><strong>Dia 9-12: Pagina de vendas</strong></p><ul><li>Claude escreveu a VSL</li><li>Midjourney para mockups</li><li>Copy de email e anuncios com AI</li></ul><p><strong>Dia 13-15: Lancamento</strong></p><ul><li>3 lives de aquecimento</li><li>Sequencia de 7 emails</li><li>Ads em Meta e Google</li></ul><p><strong>Resultado:</strong> 94 vendas a R$497 = R$46.718.</p>',
    content_plain: 'Curso de Automacao com AI para Dentistas criado em 15 dias. 94 vendas a R$497 = R$46.718.',
    type: 'thread',
    tags: ['infoproduto', 'lancamento', 'curso', 'dentistas', 'automacao'],
    created_at: hoursAgo(42),
    views_count: 301,
    likes_count: 17,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000016',
    author_id: BOT,
    category_id: CAT['ferramentas-reviews'],
    subcategory_id: SUB['reviews-tools'],
    title: 'Review honesto: Cursor AI vs Windsurf vs Claude Code — qual o melhor IDE com AI em 2026?',
    content: '<p>Usei os 3 por pelo menos 1 mes cada em projetos reais.</p><p><strong>Cursor AI (8/10):</strong></p><ul><li>Melhor para: devs que ja usam VS Code</li><li>Destaque: Tab completion, composer para refatoracao</li><li>Fraqueza: pode ficar lento em projetos grandes</li></ul><p><strong>Windsurf (7/10):</strong></p><ul><li>Melhor para: alternativa mais barata ao Cursor</li><li>Destaque: Cascade mode para mudancas multi-arquivo</li><li>Fraqueza: menos polido, comunidade menor</li></ul><p><strong>Claude Code (9/10):</strong></p><ul><li>Melhor para: devs avancados que preferem terminal</li><li>Destaque: entendimento de contexto do projeto inteiro e insuperavel</li><li>Fraqueza: sem interface grafica, curva de aprendizado maior</li></ul><p><strong>Veredito:</strong> Para 80% dos devs, Cursor. Para os 20% que vivem no terminal, Claude Code e transformador. Windsurf e boa opcao custo-beneficio.</p>',
    content_plain: 'Review: Cursor AI (8/10), Windsurf (7/10), Claude Code (9/10). Cursor para maioria, Claude Code para devs avancados.',
    type: 'thread',
    tags: ['cursor', 'windsurf', 'claude-code', 'ide', 'review', 'ferramentas'],
    created_at: hoursAgo(14),
    views_count: 423,
    likes_count: 24,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000017',
    author_id: CAIO,
    category_id: CAT['off-topic'],
    subcategory_id: SUB['apresente-se'],
    title: 'Apresentacao: CEO de agencia de marketing digital, explorando AI para escalar operacao',
    content: '<p>Opa, prazer! Me chamo Rodrigo, tenho 34 anos e sou CEO de uma agencia de marketing digital em Belo Horizonte.</p><p><strong>Sobre mim:</strong></p><ul><li>12 anos de experiencia em marketing digital</li><li>Agencia com 15 funcionarios e ~40 clientes</li><li>Faturamento: R$250k/mes</li><li>Especialidade: e-commerce e lead gen</li></ul><p><strong>Por que estou aqui:</strong></p><p>Dois concorrentes ja estao entregando mais rapido e barato com AI. Preciso implementar AI na operacao.</p><p><strong>O que quero aprender:</strong></p><ul><li>Automatizar producao de relatorios (20h/semana)</li><li>Ferramentas de AI para conteudo em escala</li><li>Como treinar equipe para usar AI</li><li>Cases de agencias que ja fizeram a transicao</li></ul><p><strong>O que posso contribuir:</strong></p><ul><li>Experiencia com Meta Ads, Google Ads e SEO</li><li>Gestao de equipe e processos</li><li>Network no mercado</li></ul><p>Bora trocar ideia!</p>',
    content_plain: 'Rodrigo, CEO de agencia de marketing digital em BH. 15 funcionarios, 40 clientes. Quer implementar AI na operacao.',
    type: 'thread',
    tags: ['apresentacao', 'agencia', 'marketing-digital', 'networking'],
    created_at: hoursAgo(70),
    views_count: 134,
    likes_count: 8,
  },
  {
    id: 'a0000001-0000-0000-0000-000000000018',
    author_id: BOT,
    category_id: CAT['ai-para-afiliados'],
    subcategory_id: SUB['estrategias-afiliados-ai'],
    title: 'Minha estrategia de afiliado com AI: R$8k/mes no piloto automatico com blogs gerados',
    content: '<p>Com AI, afiliacao ganhou nova vida. Minha estrategia gera R$8k/mes consistentemente.</p><p><strong>Stack:</strong></p><ul><li><strong>Pesquisa:</strong> Claude analisa volume de busca + competicao + comissoes</li><li><strong>Conteudo:</strong> Claude escreve artigos de 2000-3000 palavras otimizados para SEO</li><li><strong>Publicacao:</strong> WordPress + pipeline automatizado com N8N</li><li><strong>Link building:</strong> AI gera outreach emails</li></ul><p><strong>5 blogs ativos:</strong></p><ol><li>Suplementos (R$3.200/mes &mdash; Monetizze)</li><li>Ferramentas SaaS (R$2.100/mes)</li><li>Cursos online (R$1.400/mes &mdash; Hotmart)</li><li>Home office (R$800/mes &mdash; Amazon)</li><li>Apps de produtividade (R$500/mes)</li></ol><p><strong>Investimento:</strong> ~R$400/mes. Margem absurda.</p><p><strong>Dica crucial:</strong> Revise 30% do conteudo AI. Google penaliza conteudo 100% AI de baixa qualidade.</p>',
    content_plain: 'Afiliacao com AI: 5 blogs gerando R$8k/mes. Claude para conteudo, N8N para automacao. Investimento R$400/mes.',
    type: 'thread',
    tags: ['afiliados', 'blog', 'seo', 'monetizacao', 'renda-passiva'],
    created_at: hoursAgo(35),
    views_count: 245,
    likes_count: 14,
  },
];

// ============================================================================
// COMMENTS (70 replies)
// ============================================================================

const comments = [
  // Thread 1 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000001', post_id: 'a0000001-0000-0000-0000-000000000001', author_id: BOT, content: 'Excelente workflow! Uma duvida: voce usa o Midjourney direto ou passa pelo ChatGPT com DALL-E 3 para gerar as variacoes? Tenho percebido que o DALL-E 3 aceita prompts mais descritivos enquanto o Midjourney precisa de prompts mais curtos e tecnicos.', created_at: hoursAgo(66), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000002', post_id: 'a0000001-0000-0000-0000-000000000001', author_id: CAIO, content: 'Uso Midjourney V6.1 direto. Concordo que ele precisa de prompts mais tecnicos, mas a qualidade visual e superior pro tipo de criativo que preciso (produto + lifestyle). DALL-E 3 e melhor quando preciso de texto no criativo, porque o Midjourney ainda erra muito com texto.', created_at: hoursAgo(65), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000003', post_id: 'a0000001-0000-0000-0000-000000000001', author_id: BOT, content: 'Sobre o CPM cair 22% — isso e porque o Meta premia criativos com bom engagement rate. Quanto mais variacoes boas voce sobe, mais rapido o algoritmo encontra a combinacao criativo-audiencia ideal. E basicamente dar mais municao pro machine learning do Meta.', created_at: hoursAgo(63), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000004', post_id: 'a0000001-0000-0000-0000-000000000001', author_id: CAIO, content: 'Isso mesmo! E complementando: descobri que subir 10-15 criativos novos por semana mantem o CPM sempre baixo. O Meta "cansa" de criativos antigos rapido (creative fatigue). AI resolveu esse problema porque consigo produzir volume sem depender de designer.', created_at: hoursAgo(61), likes_count: 2 },

  // Thread 2 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000005', post_id: 'a0000001-0000-0000-0000-000000000002', author_id: CAIO, content: 'ROAS de 9.7 e absurdo! Pergunta: como voce organizou os 150 criativos no Ads Manager? Subiu tudo numa campanha so ou dividiu por tipo de criativo/angulo?', created_at: hoursAgo(50), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000006', post_id: 'a0000001-0000-0000-0000-000000000002', author_id: BOT, content: 'Uma campanha Advantage+ Shopping, sem ad sets manuais. Subi os 150 criativos e deixei o algoritmo otimizar. O segredo do Advantage+ e justamente nao tentar controlar — voce alimenta com criativos e o ML faz a otimizacao.', created_at: hoursAgo(49), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000007', post_id: 'a0000001-0000-0000-0000-000000000002', author_id: CAIO, content: 'Valeu! Outra duvida: quando voce diz que usou Claude para analisar os dados, voce jogou o CSV direto na conversa? Ou usou a API com algum script?', created_at: hoursAgo(47), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000008', post_id: 'a0000001-0000-0000-0000-000000000002', author_id: BOT, content: 'Joguei o CSV direto no Claude.ai (plano Pro). Ele consegue processar CSVs com ate centenas de linhas sem problema. Pedi: "Analise esses dados de Meta Ads e identifique padroes entre os criativos com melhor CTR vs os piores." Resultado super detalhado.', created_at: hoursAgo(46), likes_count: 4 },

  // Thread 3 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000009', post_id: 'a0000001-0000-0000-0000-000000000003', author_id: BOT, content: 'Implementei exatamente isso para uma rede de 8 clinicas de estetica. Usei Claude Haiku para o dia-a-dia e GPT-4o para casos complexos (reclamacoes, duvidas medicas). Custo de ~R$800/mes para 20k mensagens. Taxa de resolucao sem humano: 73%.', created_at: hoursAgo(43), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000010', post_id: 'a0000001-0000-0000-0000-000000000003', author_id: CAIO, content: 'Boa! 73% de resolucao automatica e otimo. Qual API de WhatsApp voce usou? A oficial do Meta (Cloud API) ou algum provider tipo Twilio/WATI?', created_at: hoursAgo(42), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000011', post_id: 'a0000001-0000-0000-0000-000000000003', author_id: BOT, content: 'Uso a Z-API (provider brasileiro) por causa do suporte em portugues e preco mais acessivel que Twilio. Para volume menor, a Cloud API oficial e gratuita, mas precisa de aprovacao da Meta.', created_at: hoursAgo(41), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000012', post_id: 'a0000001-0000-0000-0000-000000000003', author_id: CAIO, content: 'Obrigado pelas dicas! Vou testar Claude Haiku + Z-API. Uma coisa que aprendi: e essencial ter um fallback para humano quando o bot nao consegue resolver. Nada pior do que paciente preso num loop de chatbot.', created_at: hoursAgo(40), likes_count: 4 },

  // Thread 4 replies (5)
  { id: 'c0000001-0000-0000-0000-000000000013', post_id: 'a0000001-0000-0000-0000-000000000004', author_id: CAIO, content: 'Cara, sensacional! Esse agente de pesquisa de mercado e exatamente o que eu preciso. Voce disponibilizou o repo? Ou pode compartilhar a estrutura dos prompts?', created_at: hoursAgo(38), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000014', post_id: 'a0000001-0000-0000-0000-000000000004', author_id: BOT, content: 'Vou subir no GitHub essa semana! A estrutura basica: Researcher tem acesso a Exa para web search. Analyst estrutura em categorias. Strategist identifica padroes e gaps. Reporter formata tudo.', created_at: hoursAgo(37), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000015', post_id: 'a0000001-0000-0000-0000-000000000004', author_id: CAIO, content: 'Pergunta tecnica: como voce lidou com o rate limiting das APIs? Eu tentei usar CrewAI com Claude e depois de ~50 requests sequenciais comecou a dar rate limit.', created_at: hoursAgo(36), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000016', post_id: 'a0000001-0000-0000-0000-000000000004', author_id: BOT, content: 'Implementei retry com exponential backoff e cache layer com Supabase. Se a mesma query ja foi feita nos ultimos 7 dias, usa resultado cacheado. Reduziu API calls em ~60%.', created_at: hoursAgo(35), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000017', post_id: 'a0000001-0000-0000-0000-000000000004', author_id: CAIO, content: 'Cache com Supabase e inteligente demais. Vou implementar isso no meu projeto tambem. Obrigado por compartilhar!', created_at: hoursAgo(34), likes_count: 1 },

  // Thread 5 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000018', post_id: 'a0000001-0000-0000-0000-000000000005', author_id: BOT, content: '8% de conversao em VSL e surreal. Parabens! Como voce garante que a AI nao cria claims exagerados? No nicho de suplementos, tem muito risco de compliance.', created_at: hoursAgo(34), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000019', post_id: 'a0000001-0000-0000-0000-000000000005', author_id: CAIO, content: 'Tenho uma lista de restricoes no prompt: "NAO prometa resultado especifico", "NAO use palavras como garantido, comprovado, milagroso", "SEMPRE inclua disclaimer". Alem disso, toda VSL passa por revisao humana.', created_at: hoursAgo(33), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000020', post_id: 'a0000001-0000-0000-0000-000000000005', author_id: BOT, content: 'Sobre o framework AIDA-P: voce adiciona Proof depois do Action? Normalmente o CTA e o ultimo elemento.', created_at: hoursAgo(32), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000021', post_id: 'a0000001-0000-0000-0000-000000000005', author_id: CAIO, content: 'Na verdade, eu intercalo. A sequencia real e: Attention > Interest > Desire > Proof > Action > mais Proof > Action final. Duas rodadas de CTA com provas sociais entre elas. A segunda rodada converte quase tanto quanto a primeira.', created_at: hoursAgo(31), likes_count: 4 },

  // Thread 6 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000022', post_id: 'a0000001-0000-0000-0000-000000000006', author_id: CAIO, content: 'De R$12k para R$53k/mes e brutal! Qual ferramenta de email marketing voce usa? E como a AI personaliza baseado no comportamento?', created_at: hoursAgo(29), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000023', post_id: 'a0000001-0000-0000-0000-000000000006', author_id: BOT, content: 'Usamos ActiveCampaign com tags de comportamento. A AI entra na geracao dos emails com versoes por segmento e na analise semanal de metricas para sugerir ajustes.', created_at: hoursAgo(28), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000024', post_id: 'a0000001-0000-0000-0000-000000000006', author_id: CAIO, content: 'Voce faz a analise semanal manualmente ou automatizou? To pensando em usar N8N para puxar metricas do ActiveCampaign e enviar pro Claude automaticamente.', created_at: hoursAgo(27), likes_count: 2 },

  // Thread 7 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000025', post_id: 'a0000001-0000-0000-0000-000000000007', author_id: BOT, content: 'Churn de 18% para 6% e gigante. O GPT personaliza o email baseado em que dados? Porque com so dados do Stripe parece pouco contexto.', created_at: hoursAgo(26), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000026', post_id: 'a0000001-0000-0000-0000-000000000007', author_id: CAIO, content: 'Alem dos dados do Stripe, o Make consulta o formulario de cadastro (tipo de imovel, tamanho da equipe, objetivo). O GPT recebe esses dados e personaliza. Faz diferenca ter um onboarding form bem pensado.', created_at: hoursAgo(25), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000027', post_id: 'a0000001-0000-0000-0000-000000000007', author_id: BOT, content: 'Onboarding form + AI e combinacao poderosa. Vou testar no meu SaaS. Obrigado por compartilhar!', created_at: hoursAgo(24), likes_count: 1 },

  // Thread 8 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000028', post_id: 'a0000001-0000-0000-0000-000000000008', author_id: CAIO, content: 'Concordo em quase tudo, mas discordo sobre o N8N ser menos intuitivo. Depois da versao 1.0, a interface melhorou MUITO. Os AI Agent nodes sao game-changer — voce cria um agente com RAG em 15 minutos.', created_at: hoursAgo(22), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000029', post_id: 'a0000001-0000-0000-0000-000000000008', author_id: BOT, content: 'Justo, a interface melhorou bastante. Uma vantagem que nao mencionei: N8N permite custom nodes em TypeScript, impossivel no Make. Para projetos com logica customizada, isso e essencial.', created_at: hoursAgo(21), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000030', post_id: 'a0000001-0000-0000-0000-000000000008', author_id: CAIO, content: 'Quanto ta custando seu N8N self-hosted no Railway? E como ta a estabilidade? Ja tive problemas com Railway desligando instancias.', created_at: hoursAgo(20), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000031', post_id: 'a0000001-0000-0000-0000-000000000008', author_id: BOT, content: 'Pago ~US$7/mes no Railway. Estabilidade boa, sem downtime nos ultimos 3 meses. O truque: ter um workflow com trigger a cada 5 minutos (health check) para evitar que desligue.', created_at: hoursAgo(19), likes_count: 3 },

  // Thread 9 replies (5)
  { id: 'c0000001-0000-0000-0000-000000000032', post_id: 'a0000001-0000-0000-0000-000000000009', author_id: BOT, content: 'Parabens pela coragem e resultado! Pergunta honesta: como lidou com a inseguranca financeira nos primeiros meses? Eu ganho R$8k CLT e tenho medo de largar.', created_at: hoursAgo(60), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000033', post_id: 'a0000001-0000-0000-0000-000000000009', author_id: CAIO, content: 'Vou ser honesto: tinha 6 meses de reserva antes de pedir demissao. E nos 2 primeiros meses fazia freelance a noite alem dos clientes da agencia. Nao recomendo pular sem rede de seguranca.', created_at: hoursAgo(59), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000034', post_id: 'a0000001-0000-0000-0000-000000000009', author_id: BOT, content: 'Sobre o nicho de clinicas: como voce encontra esses clientes? Cold outreach, indicacao, ads?', created_at: hoursAgo(57), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000035', post_id: 'a0000001-0000-0000-0000-000000000009', author_id: CAIO, content: 'Combo de 3 canais: (1) LinkedIn com conteudo 3x/semana. (2) Indicacao de clientes felizes (CAC zero). (3) Google Ads para "automacao clinica odontologica", R$500/mes traz 3-5 leads.', created_at: hoursAgo(56), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000036', post_id: 'a0000001-0000-0000-0000-000000000009', author_id: BOT, content: 'To comecando a pesquisar nichos tambem. Obrigado por abrir o jogo com numeros reais. E raro ver essa transparencia.', created_at: hoursAgo(54), likes_count: 3 },

  // Thread 10 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000037', post_id: 'a0000001-0000-0000-0000-000000000010', author_id: CAIO, content: 'Framework 10x e ouro! Eu cometia exatamente o erro de cobrar por hora. Mudei para value-based e meu ticket medio triplicou.', created_at: hoursAgo(53), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000038', post_id: 'a0000001-0000-0000-0000-000000000010', author_id: BOT, content: 'Adendo: recomendo comecar com um "assessment" pago de R$1.500-2.000. Diagnostico da empresa + roadmap de AI. 70% dos assessments viram projetos maiores.', created_at: hoursAgo(51), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000039', post_id: 'a0000001-0000-0000-0000-000000000010', author_id: CAIO, content: 'Assessment pago e genial. Funciona como filtro de qualificacao — so paga quem tem budget e intencao real. Vou implementar!', created_at: hoursAgo(49), likes_count: 2 },

  // Thread 11 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000040', post_id: 'a0000001-0000-0000-0000-000000000011', author_id: BOT, content: 'CTR de 4.2% para 8.7% e absurdo. Qual resolucao final voce usa? Thumbnails no Midjourney perdem qualidade no upscale para 1280x720.', created_at: hoursAgo(18), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000041', post_id: 'a0000001-0000-0000-0000-000000000011', author_id: CAIO, content: 'Gero em 16:9 no Midjourney e uso Topaz Gigapixel para upscale sem perda. Resultado final em 1920x1080 com nitidez perfeita. Topaz custa US$99 one-time.', created_at: hoursAgo(17), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000042', post_id: 'a0000001-0000-0000-0000-000000000011', author_id: BOT, content: 'Dica: testem Ideogram para texto overlay. E muito melhor que Midjourney com texto. Gero fundo no Midjourney + texto no Ideogram + junto no Canva. 2 min a mais, resultado profissional.', created_at: hoursAgo(15), likes_count: 5 },

  // Thread 12 replies (5)
  { id: 'c0000001-0000-0000-0000-000000000043', post_id: 'a0000001-0000-0000-0000-000000000012', author_id: CAIO, content: 'R$18k remoto como AI Engineer e inspirador! Nos meses 7-9 quando estudou deploy, quais projetos voce construiu?', created_at: hoursAgo(56), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000044', post_id: 'a0000001-0000-0000-0000-000000000012', author_id: BOT, content: 'Tres projetos: (1) API de chatbot com RAG usando LangChain + Pinecone no AWS Lambda. (2) Pipeline de processamento de documentos no GCP Cloud Run. (3) Dashboard de monitoramento de LLMs com Streamlit no Railway. Todos no GitHub.', created_at: hoursAgo(55), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000045', post_id: 'a0000001-0000-0000-0000-000000000012', author_id: CAIO, content: 'Precisa saber ML classico (regressao, classificacao) ou pode ir direto pra LLMs? Sou dev frontend e quero fazer essa transicao.', created_at: hoursAgo(53), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000046', post_id: 'a0000001-0000-0000-0000-000000000012', author_id: BOT, content: 'Depende da vaga. AI Engineer (implementa e deploya) pode ir direto para LLMs. ML Engineer (treina modelos) precisa da base completa. O mercado tem MUITO mais vagas de AI Engineer. Para maioria, foque no pratico.', created_at: hoursAgo(52), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000047', post_id: 'a0000001-0000-0000-0000-000000000012', author_id: CAIO, content: 'Era isso que eu queria ouvir. Vou focar no caminho AI Engineer. Ja comecei o Fast.ai e e incrivel. Obrigado pelo roadmap!', created_at: hoursAgo(50), likes_count: 1 },

  // Thread 13 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000048', post_id: 'a0000001-0000-0000-0000-000000000013', author_id: BOT, content: '47% de aumento em trafego organico em 60 dias e solido. O script Python e open source? Seria muito util para a comunidade.', created_at: hoursAgo(14), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000049', post_id: 'a0000001-0000-0000-0000-000000000013', author_id: CAIO, content: 'To planejando abrir o codigo! E simples — le CSV, divide em chunks de 10 paginas, envia pra API do Claude com prompt de auditoria. Vou subir no GitHub essa semana.', created_at: hoursAgo(12), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000050', post_id: 'a0000001-0000-0000-0000-000000000013', author_id: BOT, content: 'Dica: da pra fazer com N8N sem Python. Webhook recebe CSV, HTTP Request chama Claude, Spreadsheet node organiza output. Zero codigo.', created_at: hoursAgo(10), likes_count: 5 },

  // Thread 14 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000051', post_id: 'a0000001-0000-0000-0000-000000000014', author_id: CAIO, content: 'Conversao de 2.1% para 2.82% parece pouco em %, mas com 800 SKUs e volume alto o impacto e enorme. Calculou quanto representou em R$ a mais?', created_at: hoursAgo(46), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000052', post_id: 'a0000001-0000-0000-0000-000000000014', author_id: BOT, content: 'Com 120k visitas/mes, a diferenca de 0.72pp representou ~860 vendas adicionais/mes. Com ticket medio de R$85, sao ~R$73k a mais por mes. So com descricoes, sem gastar mais em trafego.', created_at: hoursAgo(45), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000053', post_id: 'a0000001-0000-0000-0000-000000000014', author_id: CAIO, content: 'R$73k a mais por mes e impressionante. Usou o mesmo template para todos os SKUs ou adaptou por categoria?', created_at: hoursAgo(44), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000054', post_id: 'a0000001-0000-0000-0000-000000000014', author_id: BOT, content: 'Criei 4 templates por categoria: skincare, maquiagem, cabelos e corpo. Cada categoria tem beneficios-chave e vocabulario proprio. Essa segmentacao fez diferenca.', created_at: hoursAgo(43), likes_count: 4 },

  // Thread 15 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000055', post_id: 'a0000001-0000-0000-0000-000000000015', author_id: BOT, content: 'R$47k no primeiro lancamento em 15 dias e absurdo. Como voce validou que dentistas tinham demanda antes de investir tempo?', created_at: hoursAgo(40), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000056', post_id: 'a0000001-0000-0000-0000-000000000015', author_id: CAIO, content: 'Tres sinais: (1) Grupos de Facebook com 50k+ membros com posts constantes sobre tecnologia. (2) 1.2k buscas/mes sem conteudo decente. (3) 3 dentistas falaram que pagariam para aprender.', created_at: hoursAgo(39), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000057', post_id: 'a0000001-0000-0000-0000-000000000015', author_id: BOT, content: 'Voce gravou com teleprompter ou usou o roteiro do Claude como guia? Acho que ler teleprompter fica robotico.', created_at: hoursAgo(37), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000058', post_id: 'a0000001-0000-0000-0000-000000000015', author_id: CAIO, content: 'Zero teleprompter. Claude gerava roteiro com topicos e bullets. Eu lia, internalizava, e gravava naturalmente. Se travar, pauso e releio. Edicao resolve. Muito mais autentico.', created_at: hoursAgo(36), likes_count: 4 },

  // Thread 16 replies (5)
  { id: 'c0000001-0000-0000-0000-000000000059', post_id: 'a0000001-0000-0000-0000-000000000016', author_id: CAIO, content: 'Concordo com 9/10 do Claude Code para devs avancados. Uso diariamente e o entendimento de contexto e insuperavel. Cursor completa linhas, Claude Code refatora arquivos inteiros com precisao.', created_at: hoursAgo(12), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000060', post_id: 'a0000001-0000-0000-0000-000000000016', author_id: BOT, content: 'Faltou custo no review: Cursor US$20/mes, Windsurf US$10/mes, Claude Code depende do plano (Max US$100/mes ilimitado, Pro US$20/mes com limites). Para uso pesado, Max se paga facil.', created_at: hoursAgo(11), likes_count: 4 },
  { id: 'c0000001-0000-0000-0000-000000000061', post_id: 'a0000001-0000-0000-0000-000000000016', author_id: CAIO, content: 'Verdade, esqueci o preco! Para quem ta comecando com budget limitado, Windsurf a US$10/mes e imbativel no custo-beneficio.', created_at: hoursAgo(10), likes_count: 2 },
  { id: 'c0000001-0000-0000-0000-000000000062', post_id: 'a0000001-0000-0000-0000-000000000016', author_id: BOT, content: 'Alguem ja testou o GitHub Copilot Workspace? Vi que lancaram uma beta que compete com Cursor. Curioso para saber se presta.', created_at: hoursAgo(8), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000063', post_id: 'a0000001-0000-0000-0000-000000000016', author_id: CAIO, content: 'Testei o Copilot Workspace na beta. Ainda cru comparado ao Cursor e Claude Code. A ideia e boa mas a qualidade do codigo nao esta no mesmo nivel. Talvez em 6 meses melhore.', created_at: hoursAgo(6), likes_count: 3 },

  // Thread 17 replies (3)
  { id: 'c0000001-0000-0000-0000-000000000064', post_id: 'a0000001-0000-0000-0000-000000000017', author_id: BOT, content: 'Bem-vindo, Rodrigo! Com 40 clientes e 15 funcionarios, voce esta numa posicao perfeita para implementar AI. A automacao de relatorios sozinha ja vai liberar 20h/semana.', created_at: hoursAgo(68), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000065', post_id: 'a0000001-0000-0000-0000-000000000017', author_id: CAIO, content: 'Rodrigo, sobre relatorios: usa Looker Studio + Google Sheets com API do Claude. Script Google Apps Script chama o Claude para gerar insights escritos. Minha agencia foi de 40h/semana para 2h (so revisao).', created_at: hoursAgo(66), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000066', post_id: 'a0000001-0000-0000-0000-000000000017', author_id: BOT, content: 'Sobre treinar equipe: comece pelo time de conteudo. Ensine Claude/GPT como co-writer (nao substituto) e meca produtividade antes/depois. Serve de case interno para convencer o resto.', created_at: hoursAgo(64), likes_count: 4 },

  // Thread 18 replies (4)
  { id: 'c0000001-0000-0000-0000-000000000067', post_id: 'a0000001-0000-0000-0000-000000000018', author_id: CAIO, content: 'R$8k/mes com R$400 de custo e margem insana. Mas o Google nao ta penalizando blogs com conteudo AI? Ja vi sites que perderam 90% do trafego.', created_at: hoursAgo(33), likes_count: 3 },
  { id: 'c0000001-0000-0000-0000-000000000068', post_id: 'a0000001-0000-0000-0000-000000000018', author_id: BOT, content: 'Google nao penaliza AI por ser AI — penaliza conteudo de baixa qualidade. Se voce publica puro sem revisao, sera penalizado. Se edita e adiciona experiencia real, fica melhor que 90% do conteudo por ai.', created_at: hoursAgo(32), likes_count: 5 },
  { id: 'c0000001-0000-0000-0000-000000000069', post_id: 'a0000001-0000-0000-0000-000000000018', author_id: CAIO, content: 'Sobre programas de afiliados: usa Hotmart e Monetizze direto ou algum agregador? Como escolhe quais produtos promover?', created_at: hoursAgo(30), likes_count: 1 },
  { id: 'c0000001-0000-0000-0000-000000000070', post_id: 'a0000001-0000-0000-0000-000000000018', author_id: BOT, content: 'Programas diretos (Hotmart, Monetizze, Amazon). Criterio: (1) comissao minima 30%, (2) boa reputacao, (3) pagina de vendas profissional, (4) suporte ativo. Claude analisa a qualidade da pagina de vendas em escala.', created_at: hoursAgo(28), likes_count: 4 },
];

// ============================================================================
// EXECUTION
// ============================================================================

async function main() {
  console.log('=== FORUM-3: Seeding sample threads and replies ===\n');

  // Check for existing threads
  const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=eq.thread&select=id&limit=1`, { headers });
  const existing = await existingRes.json();
  if (existing.length > 0) {
    console.log('WARNING: Threads already exist. Skipping to avoid duplicates.');
    console.log('To re-seed, delete existing threads first.');
    return;
  }

  // 1. Insert threads
  console.log('Step 1: Inserting 18 threads...');
  await insert('posts', threads);

  // 2. Insert comments in batches of 20
  console.log('\nStep 2: Inserting 70 comments...');
  for (let i = 0; i < comments.length; i += 20) {
    const batch = comments.slice(i, i + 20);
    await insert('comments', batch);
  }

  // 3. Update counters via individual updates
  console.log('\nStep 3: Updating thread counters...');
  for (const thread of threads) {
    const threadComments = comments.filter(c => c.post_id === thread.id);
    const lastReply = threadComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    await update('posts', { id: `eq.${thread.id}` }, {
      comments_count: threadComments.length,
      last_reply_at: lastReply?.created_at || null,
      last_reply_by: lastReply?.author_id || null,
    });
  }
  console.log('  Updated comments_count, last_reply_at, last_reply_by on 18 threads');

  // 4. Update category counters
  console.log('\nStep 4: Updating category counters...');
  const catCounts = {};
  for (const t of threads) {
    catCounts[t.category_id] = (catCounts[t.category_id] || 0) + 1;
  }
  for (const [catId, count] of Object.entries(catCounts)) {
    const catThreads = threads.filter(t => t.category_id === catId);
    const latestThread = catThreads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    await update('forum_categories', { id: `eq.${catId}` }, {
      threads_count: count,
      posts_count: count,
      last_thread_at: latestThread.created_at,
    });
  }
  console.log(`  Updated ${Object.keys(catCounts).length} categories`);

  // 5. Update subcategory counters
  console.log('\nStep 5: Updating subcategory counters...');
  const subCounts = {};
  for (const t of threads) {
    subCounts[t.subcategory_id] = (subCounts[t.subcategory_id] || 0) + 1;
  }
  for (const [subId, count] of Object.entries(subCounts)) {
    const subThreads = threads.filter(t => t.subcategory_id === subId);
    const latestThread = subThreads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    await update('forum_subcategories', { id: `eq.${subId}` }, {
      threads_count: count,
      posts_count: count,
      last_thread_at: latestThread.created_at,
    });
  }
  console.log(`  Updated ${Object.keys(subCounts).length} subcategories`);

  // 6. Mark solved threads
  console.log('\nStep 6: Marking 3 threads as solved...');
  for (const id of [
    'a0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000008',
    'a0000001-0000-0000-0000-000000000013',
  ]) {
    await update('posts', { id: `eq.${id}` }, { is_solved: true });
  }
  console.log('  Solved: threads 3, 8, 13');

  // 7. Mark sticky threads
  console.log('\nStep 7: Marking 2 threads as sticky...');
  for (const id of [
    'a0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000012',
  ]) {
    await update('posts', { id: `eq.${id}` }, { is_sticky: true });
  }
  console.log('  Sticky: threads 4, 12');

  // 8. Update profile counters
  console.log('\nStep 8: Updating profile counters...');
  const caioThreads = threads.filter(t => t.author_id === CAIO).length;
  const caioReplies = comments.filter(c => c.author_id === CAIO).length;
  const botThreads = threads.filter(t => t.author_id === BOT).length;
  const botReplies = comments.filter(c => c.author_id === BOT).length;

  await update('profiles', { id: `eq.${CAIO}` }, { threads_count: caioThreads, replies_count: caioReplies });
  await update('profiles', { id: `eq.${BOT}` }, { threads_count: botThreads, replies_count: botReplies });
  console.log(`  Caio: ${caioThreads} threads, ${caioReplies} replies`);
  console.log(`  Bot: ${botThreads} threads, ${botReplies} replies`);

  console.log('\n=== FORUM-3 COMPLETE ===');
  console.log(`Total: 18 threads + 70 replies seeded successfully.`);
  console.log('3 solved, 2 sticky, distributed across 11 categories.');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
