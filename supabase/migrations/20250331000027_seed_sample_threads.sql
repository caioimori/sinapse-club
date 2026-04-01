-- Migration 027: Seed Sample Threads & Replies
-- Story: FORUM-3 | ADR: ADR-001 Section 8.1
-- 18 realistic threads + 70 replies in PT-BR about AI for business
-- Authors: sinapse-bot (00000000-0000-0000-0000-000000000001) and imoricaio (d5044806-1817-4bc1-86fb-56315e7f6946)

-- ══════════════════════════════════════════════════════════════════════════════
-- AUTHOR ALIASES (for readability)
-- ══════════════════════════════════════════════════════════════════════════════
-- bot  = 00000000-0000-0000-0000-000000000001 (sinapse-bot / sinapse.club)
-- caio = d5044806-1817-4bc1-86fb-56315e7f6946 (imoricaio / Caio Imori)

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 1: AI para Ads / Meta Ads + AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  '57a6aa22-98af-49c3-816b-a942ab6b42ba',
  '0e65a3c5-b441-4ba3-94d2-0347e878bccc',
  'Como usei GPT-4o para gerar 50 variacoes de criativos em 10 minutos',
  '<p>Fala pessoal! Quero compartilhar um workflow que mudou completamente minha operacao de ads.</p><p>Eu gerenciava uma conta de Meta Ads com orcamento de R$15k/mes e o maior gargalo era sempre a <strong>producao de criativos</strong>. Meu designer levava 2-3 dias para entregar 10 variacoes. Com AI, resolvi isso em minutos.</p><p><strong>O workflow:</strong></p><ul><li>Pego os 3 melhores criativos do mes anterior (maior CTR)</li><li>Jogo no GPT-4o com Vision pedindo para analisar os elementos visuais</li><li>Uso o output para gerar prompts de variacao no Midjourney</li><li>Gero 50 variacoes em lote com parametros diferentes</li><li>Filtro as 15 melhores e subo pro Ads Manager</li></ul><p>O resultado: meu <strong>CTR subiu de 1.2% para 2.8%</strong> e o CPM caiu 22% porque o Meta comecou a priorizar os criativos com melhor performance.</p><p>A sacada principal e nao pedir para a AI "criar do zero" — ela funciona muito melhor quando voce da uma referencia visual e pede variacoes. Alguem mais ta usando esse tipo de workflow?</p>',
  'Fala pessoal! Quero compartilhar um workflow que mudou completamente minha operacao de ads. Eu gerenciava uma conta de Meta Ads com orcamento de R$15k/mes e o maior gargalo era sempre a producao de criativos. Meu designer levava 2-3 dias para entregar 10 variacoes. Com AI, resolvi isso em minutos. O workflow: Pego os 3 melhores criativos do mes anterior (maior CTR). Jogo no GPT-4o com Vision pedindo para analisar os elementos visuais. Uso o output para gerar prompts de variacao no Midjourney. Gero 50 variacoes em lote com parametros diferentes. Filtro as 15 melhores e subo pro Ads Manager. O resultado: meu CTR subiu de 1.2% para 2.8% e o CPM caiu 22% porque o Meta comecou a priorizar os criativos com melhor performance. A sacada principal e nao pedir para a AI criar do zero — ela funciona muito melhor quando voce da uma referencia visual e pede variacoes. Alguem mais ta usando esse tipo de workflow?',
  'thread',
  ARRAY['meta-ads', 'criativos', 'gpt-4o', 'midjourney'],
  now() - interval '68 hours',
  now() - interval '68 hours',
  342, 18, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 2: AI para Ads / Google Ads + AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '57a6aa22-98af-49c3-816b-a942ab6b42ba',
  'f438a3a0-682e-41b7-ad4d-2890f5bbf5c3',
  'Meta Advantage+ com AI: meu ROAS subiu 3x — aqui esta o processo completo',
  '<p>Vou detalhar exatamente o que fiz para triplicar o ROAS de um e-commerce de moda feminina usando Advantage+ Shopping combinado com AI.</p><p><strong>Contexto:</strong> loja com faturamento de R$80k/mes, ROAS historico de 3.2, meta de chegar em 8+.</p><p><strong>Passo 1 — Analise de dados com Claude:</strong></p><p>Exportei os ultimos 90 dias de dados do Ads Manager (CSV) e joguei no Claude pedindo para identificar padroes. Ele encontrou que criativos com fundo branco + modelo real performavam 340% melhor que lifestyle shots.</p><p><strong>Passo 2 — Geracao massiva de copy:</strong></p><p>Criei um prompt chain no GPT-4 que gera variacoes de headline + description baseadas nos produtos mais vendidos. Cada produto recebe 8 variacoes de copy testando diferentes angulos: urgencia, prova social, beneficio direto, curiosidade.</p><p><strong>Passo 3 — Configuracao do Advantage+:</strong></p><p>Em vez de segmentar manualmente, deixei o Advantage+ com 150 criativos diferentes (combinacao de visuais + copy) e orcamento de R$500/dia. O algoritmo do Meta fez o resto.</p><p><strong>Resultado apos 30 dias:</strong> ROAS foi de 3.2 para 9.7. O segredo foi dar <strong>volume de criativos de qualidade</strong> pro algoritmo otimizar. AI foi o enabler dessa escala.</p>',
  'Vou detalhar exatamente o que fiz para triplicar o ROAS de um e-commerce de moda feminina usando Advantage+ Shopping combinado com AI. Contexto: loja com faturamento de R$80k/mes, ROAS historico de 3.2, meta de chegar em 8+. Exportei os ultimos 90 dias de dados do Ads Manager e joguei no Claude. Criei prompt chain no GPT-4. Configurei Advantage+ com 150 criativos diferentes. Resultado apos 30 dias: ROAS foi de 3.2 para 9.7.',
  'thread',
  ARRAY['advantage-plus', 'roas', 'ecommerce', 'meta-ads'],
  now() - interval '52 hours',
  now() - interval '52 hours',
  487, 25, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 3: LLMs & Agentes / Claude / Anthropic
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000003',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  'abaa5142-ee03-47c1-80f7-061a98fe98a1',
  'af293365-49f7-457f-a116-33ca1e3902c3',
  'Claude vs GPT-5: qual usar para automacao de atendimento ao cliente?',
  '<p>To montando um sistema de atendimento automatizado para uma rede de clinicas odontologicas (12 unidades) e preciso decidir qual LLM usar como base.</p><p><strong>Requisitos do projeto:</strong></p><ul><li>Responder duvidas sobre procedimentos e precos</li><li>Agendar consultas integrando com o sistema de agenda</li><li>Lidar com reclamacoes de forma empatica</li><li>Funcionar via WhatsApp (API oficial)</li><li>Custo mensal aceitavel ate R$2k em API</li></ul><p><strong>Minha experiencia ate agora:</strong></p><p>Testei ambos por 2 semanas em ambiente de staging. O <strong>Claude</strong> se destacou em respostas longas e empaticas — pacientes com reclamacao recebiam respostas muito mais humanas. O <strong>GPT-5</strong> foi melhor em seguir instrucoes rigidas tipo "nunca confirme um preco sem consultar a tabela".</p><p>Em termos de custo, Claude Haiku sai mais barato para o volume que preciso (~15k mensagens/mes), mas o GPT-4o-mini tambem e bem acessivel.</p><p>Alguem aqui ja implementou atendimento automatizado com LLM em producao? Qual modelo escolheram e por que?</p>',
  'To montando um sistema de atendimento automatizado para uma rede de clinicas odontologicas (12 unidades) e preciso decidir qual LLM usar como base. Testei ambos por 2 semanas. Claude se destacou em empatia, GPT-5 em seguir instrucoes rigidas. Alguem ja implementou em producao?',
  'thread',
  ARRAY['claude', 'gpt-5', 'atendimento', 'whatsapp', 'chatbot'],
  now() - interval '45 hours',
  now() - interval '45 hours',
  276, 14, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 4: LLMs & Agentes / Agentes Autonomos
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'abaa5142-ee03-47c1-80f7-061a98fe98a1',
  'd9675b84-3431-4ed1-9c11-051bf91fb319',
  'Montei um agente com CrewAI que faz pesquisa de mercado automatizada — compartilhando o codigo',
  '<p>Depois de 3 semanas de desenvolvimento, meu agente de pesquisa de mercado com CrewAI esta em producao e quero compartilhar o que aprendi.</p><p><strong>O que o agente faz:</strong></p><ul><li>Recebe um nicho/vertical como input (ex: "suplementos para academia")</li><li>Pesquisa automaticamente os top 20 players do mercado</li><li>Analisa presenca digital de cada um (Instagram, site, ads ativos)</li><li>Gera um relatorio com TAM/SAM/SOM estimado</li><li>Identifica gaps de mercado e oportunidades</li></ul><p><strong>Stack tecnica:</strong></p><p><code>CrewAI</code> para orquestracao, <code>Claude Sonnet</code> como LLM base, <code>Exa</code> para pesquisa web, <code>Apify</code> para scraping de redes sociais, e <code>Supabase</code> para armazenar os relatorios.</p><p><strong>Crew com 4 agentes:</strong></p><ol><li><strong>Researcher</strong> — busca e coleta dados brutos</li><li><strong>Analyst</strong> — processa e estrutura os dados</li><li><strong>Strategist</strong> — identifica padroes e oportunidades</li><li><strong>Reporter</strong> — gera o relatorio final em formato executivo</li></ol><p>Cada pesquisa de mercado que custaria R$5-15k em consultoria tradicional sai por menos de R$2 em API calls. Obvio que nao substitui analise humana profunda, mas para uma primeira visao do mercado e sensacional.</p><p>Se tiver interesse no codigo, posso compartilhar um repo no GitHub.</p>',
  'Depois de 3 semanas de desenvolvimento, meu agente de pesquisa de mercado com CrewAI esta em producao. Usa CrewAI para orquestracao, Claude Sonnet como LLM, Exa para pesquisa web, Apify para scraping. Cada pesquisa custa menos de R$2 em API calls vs R$5-15k em consultoria.',
  'thread',
  ARRAY['crewai', 'agentes', 'pesquisa-mercado', 'automacao'],
  now() - interval '40 hours',
  now() - interval '40 hours',
  512, 23, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 5: AI Copywriting / Prompts para Copy
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000005',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  'eeda4d40-4c4b-4c38-908a-9d94cd781e82',
  '2a4a25ba-f6f7-4846-ac52-720484dcf804',
  'Meu framework de prompts para VSL que converte 8%+ (com exemplos reais)',
  '<p>Nos ultimos 6 meses testei dezenas de abordagens para gerar VSL (Video Sales Letter) com AI e cheguei num framework que consistentemente entrega taxas de conversao acima de 8%.</p><p><strong>O Framework AIDA-P (minha versao adaptada para AI):</strong></p><ul><li><strong>A</strong>ttention — Hook nos primeiros 3 segundos (AI gera 20 variacoes, testo as 5 melhores)</li><li><strong>I</strong>nterest — Historia de transformacao (AI escreve baseada em depoimentos reais)</li><li><strong>D</strong>esire — Stack de beneficios + prova social (AI estrutura a hierarquia)</li><li><strong>A</strong>ction — CTA com urgencia (AI testa diferentes angulos)</li><li><strong>P</strong>roof — Objecoes + garantia (AI mapeia as 10 objecoes mais comuns do nicho)</li></ul><p><strong>O prompt master (simplificado):</strong></p><p>Nao posso compartilhar o prompt completo aqui (ta no meu curso), mas a estrutura e: contexto do produto + avatar do cliente + 3 depoimentos reais + tom de voz desejado + restricoes (ex: nao usar hype, nao prometer resultado especifico).</p><p><strong>Resultados reais:</strong></p><ul><li>VSL para curso de Excel: 8.2% de conversao (vs 3.1% da versao manual)</li><li>VSL para suplemento: 11.4% de conversao</li><li>VSL para SaaS B2B: 6.8% de conversao</li></ul><p>A chave e dar contexto real pro LLM. Quanto mais dados reais do seu publico voce fornece, melhor o output.</p>',
  'Nos ultimos 6 meses testei dezenas de abordagens para gerar VSL com AI e cheguei num framework que consistentemente entrega taxas de conversao acima de 8%. Framework AIDA-P adaptado para AI. Resultados reais: 8.2%, 11.4% e 6.8% de conversao.',
  'thread',
  ARRAY['vsl', 'copywriting', 'conversao', 'prompts', 'framework'],
  now() - interval '36 hours',
  now() - interval '36 hours',
  398, 21, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 6: AI Copywriting / Email Marketing
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'eeda4d40-4c4b-4c38-908a-9d94cd781e82',
  '83661661-2ede-4600-99c4-a0f3e5ad3090',
  'Email marketing com AI: sequencia de 7 emails que gera R$50k/mes para meu cliente',
  '<p>Vou abrir o jogo sobre uma sequencia de email marketing que criei com auxilio de AI para um cliente do nicho de educacao financeira.</p><p><strong>Contexto:</strong> lista de 45k leads, taxa de abertura historica de 18%, faturamento por email de ~R$12k/mes.</p><p><strong>O que mudei com AI:</strong></p><p>Usei Claude para analisar os ultimos 6 meses de metricas de email (aberturas, cliques, respostas) e identificar padroes. A AI descobriu que:</p><ul><li>Emails enviados as 7h21 tinham 34% mais abertura que as 10h</li><li>Subject lines com numeros especificos performavam 2.4x melhor</li><li>Emails curtos (< 200 palavras) geravam mais cliques</li></ul><p><strong>A sequencia de 7 emails:</strong></p><ol><li><strong>Boas-vindas</strong> — Historia pessoal + promessa (open rate: 62%)</li><li><strong>Quick win</strong> — Dica aplicavel em 5 minutos (clique: 12%)</li><li><strong>Case study</strong> — Resultado de aluno real (resposta: 8%)</li><li><strong>Objecao #1</strong> — "Nao tenho dinheiro pra investir" (clique: 9%)</li><li><strong>Autoridade</strong> — Dados + credenciais (open: 41%)</li><li><strong>Urgencia</strong> — Oferta com prazo (clique: 15%)</li><li><strong>Ultimo aviso</strong> — Escassez real (conversao: 4.2%)</li></ol><p>Com essa sequencia, o faturamento por email subiu de R$12k para R$53k/mes. O AI foi crucial para personalizar o tom de cada email baseado no comportamento do lead.</p>',
  'Sequencia de email marketing criada com AI para cliente de educacao financeira. Lista de 45k leads. Faturamento subiu de R$12k para R$53k/mes. 7 emails otimizados com Claude para analise de padroes.',
  'thread',
  ARRAY['email-marketing', 'automacao', 'copy', 'leads', 'conversao'],
  now() - interval '31 hours',
  now() - interval '31 hours',
  267, 16, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 7: Automacao & No-Code / Make / Zapier / n8n
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000007',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  'e57c978c-a1b3-4eb1-b732-d055ecd869a8',
  'bec63606-607d-4c15-9dab-7c7a39213896',
  'Automacao completa de onboarding com Make + GPT: passo a passo com screenshots',
  '<p>Implementei um fluxo de onboarding 100% automatizado para uma startup SaaS (CRM para imobiliarias) e quero documentar tudo aqui.</p><p><strong>Problema:</strong> a cada novo cliente, o time de CS gastava 45 minutos fazendo setup manual — importando contatos, configurando pipelines, enviando emails de boas-vindas personalizados.</p><p><strong>Solucao com Make + GPT:</strong></p><p><strong>Trigger:</strong> Novo pagamento confirmado no Stripe</p><p><strong>Fluxo automatizado:</strong></p><ol><li>Make recebe webhook do Stripe com dados do cliente</li><li>Cria conta no CRM via API com dados pre-preenchidos</li><li>GPT-4o analisa o segmento do cliente (residencial, comercial, luxo) baseado no plano escolhido</li><li>GPT gera email de boas-vindas personalizado para o segmento</li><li>GPT cria 5 templates de pipeline customizados pro segmento</li><li>Make importa os templates no CRM do cliente</li><li>Dispara sequencia de onboarding no ActiveCampaign</li><li>Agenda call de kick-off automaticamente no Calendly</li></ol><p><strong>Resultado:</strong></p><ul><li>Tempo de onboarding: de 45 min para 0 (100% automatico)</li><li>NPS do onboarding: subiu de 7.2 para 9.1</li><li>Churn nos primeiros 30 dias: caiu de 18% para 6%</li></ul><p>O investimento total foi ~R$300/mes (Make Pro + OpenAI API). O ROI se paga no primeiro cliente.</p>',
  'Implementei onboarding 100% automatizado para SaaS com Make + GPT. Tempo de onboarding caiu de 45 min para zero. NPS subiu de 7.2 para 9.1. Churn nos primeiros 30 dias caiu de 18% para 6%.',
  'thread',
  ARRAY['make', 'onboarding', 'automacao', 'gpt', 'saas'],
  now() - interval '28 hours',
  now() - interval '28 hours',
  189, 12, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 8: Automacao & No-Code / Make / Zapier / n8n (comparativo)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000001',
  'e57c978c-a1b3-4eb1-b732-d055ecd869a8',
  'bec63606-607d-4c15-9dab-7c7a39213896',
  'N8N vs Make para integracoes com AI: qual escolher em 2026?',
  '<p>Depois de usar ambas as ferramentas por mais de 1 ano em projetos reais com AI, decidi fazer um comparativo honesto.</p><p><strong>Make (antigo Integromat):</strong></p><ul><li><strong>Pros:</strong> Interface visual excelente, facil de ensinar para clientes, marketplace de templates, execucao confiavel</li><li><strong>Contras:</strong> Precificacao por operacao encarece rapido, limites no plano free, sem self-hosting</li><li><strong>Melhor para:</strong> Agencias que entregam automacoes para clientes, workflows simples-medios</li></ul><p><strong>N8N:</strong></p><ul><li><strong>Pros:</strong> Self-hosted (custo fixo), sem limite de execucoes, nodes customizaveis com JS, AI nodes nativos excelentes</li><li><strong>Contras:</strong> Curva de aprendizado maior, precisa de servidor, interface menos intuitiva</li><li><strong>Melhor para:</strong> Devs/tecnico, projetos com alto volume, quem quer controle total</li></ul><p><strong>Minha recomendacao pratica:</strong></p><ul><li>Ate 1000 execucoes/mes → Make (mais rapido de implementar)</li><li>1000-10000 execucoes/mes → depende do perfil tecnico</li><li>10000+ execucoes/mes → N8N self-hosted (custo fixo ~R$50/mes no Railway)</li></ul><p>Para integracao com AI especificamente, o N8N esta na frente com os AI Agent nodes que permitem criar agentes completos direto na interface, sem codigo.</p>',
  'Comparativo entre N8N e Make para automacoes com AI. Make e melhor para agencias e workflows simples. N8N e melhor para alto volume e controle total. Para AI, N8N esta na frente com AI Agent nodes.',
  'thread',
  ARRAY['n8n', 'make', 'automacao', 'comparativo', 'no-code'],
  now() - interval '24 hours',
  now() - interval '24 hours',
  324, 19, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 9: Negocios & Estrategia / Modelos de Negocio
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000009',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  '3791321f-4348-43c3-892f-e2469ab61757',
  '74dd7737-2808-49fc-99bc-b18ce4b9e9d1',
  'Sai de CLT para montar agencia de AI — faturando R$30k/mes em 6 meses',
  '<p>Ha exatamente 6 meses eu pedi demissao de um cargo de analista de marketing ganhando R$6.500. Hoje faturo R$30k/mes com minha agencia focada em AI para pequenos negocios. Vou contar tudo.</p><p><strong>Mes 1-2: Validacao</strong></p><p>Comecei oferecendo servicos de automacao com AI para conhecidos. Cobrava R$500-1000 por projeto (chatbot no WhatsApp, automacao de email, geracao de conteudo). Peguei 4 clientes nesse periodo.</p><p><strong>Mes 3-4: Posicionamento</strong></p><p>Defini meu nicho: <strong>clinicas e consultorios</strong>. Motivo: alta dor (atendimento manual), ticket medio bom, mercado enorme. Subi o preco para R$2-3k por implementacao + R$500/mes de manutencao.</p><p><strong>Mes 5-6: Escala</strong></p><p>Com 8 clientes recorrentes + novos projetos, cheguei a R$30k/mes. O diferencial foi criar <strong>pacotes padronizados</strong>:</p><ul><li><strong>Starter (R$1.500)</strong>: Chatbot WhatsApp com agendamento</li><li><strong>Growth (R$3.000)</strong>: Starter + automacao de follow-up + relatorios</li><li><strong>Premium (R$5.000)</strong>: Growth + dashboard personalizado + integracao com prontuario</li></ul><p><strong>Stack que uso:</strong> N8N (automacao), Claude API (chatbot), Supabase (banco de dados), Vercel (hosting). Custo operacional total: ~R$200/mes.</p><p>A melhor decisao foi focar num nicho. Generalista em AI e impossivel se posicionar.</p>',
  'Sai de CLT (R$6.500) para montar agencia de AI, faturando R$30k/mes em 6 meses. Nicho: clinicas e consultorios. Pacotes de R$1.500 a R$5.000. Stack: N8N, Claude API, Supabase, Vercel. Custo operacional R$200/mes.',
  'thread',
  ARRAY['agencia', 'empreendedorismo', 'nicho', 'clt', 'faturamento'],
  now() - interval '62 hours',
  now() - interval '62 hours',
  456, 22, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 10: Negocios & Estrategia / Gestao com AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  '3791321f-4348-43c3-892f-e2469ab61757',
  'c486aab8-5093-4493-97bc-34874da80359',
  'Como precificar servicos de AI para pequenas empresas — guia pratico',
  '<p>Uma das maiores dificuldades de quem comeca a vender servicos de AI e saber quanto cobrar. Vou compartilhar o framework que uso na minha consultoria.</p><p><strong>Regra #1: Nunca cobre por hora</strong></p><p>Se voce cobra por hora e usa AI para fazer em 30 minutos o que levaria 8 horas manual, voce se pune por ser eficiente. Cobre por <strong>valor entregue</strong>.</p><p><strong>Framework de precificacao "10x":</strong></p><ol><li>Calcule quanto o cliente gasta/perde SEM a solucao (ex: R$5.000/mes em atendente manual)</li><li>Sua solucao deve custar no maximo 1/10 disso (ex: R$500/mes)</li><li>O cliente economiza 10x — facil de justificar</li></ol><p><strong>Tabela de referencia (mercado brasileiro 2026):</strong></p><ul><li><strong>Chatbot basico WhatsApp:</strong> R$1.500-3.000 setup + R$300-500/mes</li><li><strong>Automacao de processos (Make/N8N):</strong> R$2.000-5.000 por fluxo</li><li><strong>Agente AI customizado:</strong> R$5.000-15.000 setup + R$500-1.500/mes</li><li><strong>Consultoria estrategica de AI:</strong> R$3.000-8.000 por projeto</li><li><strong>Treinamento de equipe:</strong> R$2.000-5.000 por workshop (4-8h)</li></ul><p><strong>Erro comum:</strong> cobrar pouco por inseguranca. Se sua solucao economiza R$5k/mes pro cliente, cobrar R$500 e justo e facil de vender. Nao tenha medo de cobrar o que vale.</p>',
  'Framework de precificacao para servicos de AI. Nunca cobre por hora, cobre por valor. Regra 10x: solucao custa 1/10 do que o cliente gasta sem ela. Tabela de referencia do mercado brasileiro 2026.',
  'thread',
  ARRAY['precificacao', 'consultoria', 'servicos', 'negocios'],
  now() - interval '55 hours',
  now() - interval '55 hours',
  213, 15, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 11: AI Generativa / Imagens (Midjourney/DALL-E)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000011',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  '0bcddc55-d239-4a78-b3b4-f6f0833d64e2',
  '931e87ad-f099-496a-bacb-365d74e67963',
  'Workflow de criacao de thumbnails com Midjourney que geram 2x mais cliques',
  '<p>Gerencio um canal de YouTube com 180k inscritos e descobri que thumbnails geradas com AI performam significativamente melhor que as feitas manualmente. Aqui esta meu processo completo.</p><p><strong>Dados antes de comecar:</strong> CTR media das thumbnails antigas era 4.2%. Depois do workflow com AI, subiu para 8.7%.</p><p><strong>O processo:</strong></p><ol><li><strong>Analise dos tops:</strong> Jogo as 10 thumbnails de melhor CTR no Claude Vision e peco para identificar padroes visuais (cores, expressoes, composicao, texto)</li><li><strong>Prompt engineering:</strong> Transformo esses padroes em prompts estruturados do Midjourney</li><li><strong>Geracao em lote:</strong> Crio 8-12 variacoes por video</li><li><strong>A/B testing:</strong> Uso o TubeBuddy para testar as 3 melhores variacoes por 48h</li><li><strong>Iteracao:</strong> Os dados de performance alimentam o proximo ciclo</li></ol><p><strong>Prompt template que funciona:</strong></p><p><code>cinematic close-up portrait, [expressao], [cor dominante] background, bold white text overlay "[titulo curto]", high contrast, YouTube thumbnail style, 16:9 --ar 16:9 --v 6.1</code></p><p><strong>Dicas importantes:</strong></p><ul><li>Rostos com expressoes exageradas funcionam melhor (surpresa, empolgacao)</li><li>Maximo 3-4 palavras no texto overlay</li><li>Contraste alto entre fundo e texto e essencial</li><li>Cores quentes (vermelho, amarelo) geram mais cliques que frias</li></ul>',
  'Workflow de thumbnails com Midjourney para YouTube (180k inscritos). CTR subiu de 4.2% para 8.7%. Processo: analise com Claude Vision, prompts Midjourney, geracao em lote, A/B testing com TubeBuddy.',
  'thread',
  ARRAY['midjourney', 'thumbnails', 'youtube', 'ctr', 'design'],
  now() - interval '20 hours',
  now() - interval '20 hours',
  178, 11, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 12: Carreira em AI / Transicao de Carreira
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  '46458050-0909-4955-9258-3baf5197920c',
  'cae629c2-22c2-4ad1-bf26-e9908efc350e',
  'De dev junior a AI Engineer: meu roadmap de 12 meses (com recursos gratuitos)',
  '<p>Ha 1 ano eu era dev junior trabalhando com PHP e Laravel. Hoje sou AI Engineer numa startup, ganhando 3x mais. Vou compartilhar exatamente o que estudei e em qual ordem.</p><p><strong>Meses 1-3: Fundamentos de ML</strong></p><ul><li>Fast.ai (gratuito) — melhor introducao pratica que existe</li><li>3Blue1Brown Neural Networks (YouTube) — entender a matematica visualmente</li><li>Kaggle Learn (gratuito) — pratica com datasets reais</li></ul><p><strong>Meses 4-6: LLMs e NLP</strong></p><ul><li>Hugging Face Course (gratuito) — transformers, fine-tuning, inference</li><li>Documentacao oficial do OpenAI e Anthropic — essencial</li><li>Projetos praticos: construi 3 chatbots e 1 sistema RAG</li></ul><p><strong>Meses 7-9: Engenharia de AI</strong></p><ul><li>LangChain/LlamaIndex — orquestracao de LLMs</li><li>Vector databases (Pinecone, Weaviate) — busca semantica</li><li>Deploy em producao: Docker, AWS/GCP, monitoramento</li></ul><p><strong>Meses 10-12: Especializacao + Portfolio</strong></p><ul><li>Escolhi focar em AI Agents (CrewAI, AutoGen)</li><li>Contribui para 2 projetos open source</li><li>Portfolio no GitHub com 5 projetos documentados</li></ul><p><strong>Resultado:</strong> 4 propostas de emprego, aceitei a melhor (AI Engineer, remoto, salario de R$18k). O mercado esta faminto por gente que sabe colocar AI em producao — nao so treinar modelos.</p>',
  'De dev junior PHP/Laravel para AI Engineer em 12 meses. Roadmap com recursos gratuitos: Fast.ai, Hugging Face, LangChain. Resultado: 4 propostas, salario de R$18k remoto.',
  'thread',
  ARRAY['carreira', 'roadmap', 'ai-engineer', 'transicao', 'estudo'],
  now() - interval '58 hours',
  now() - interval '58 hours',
  389, 20, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 13: AI para SEO & Conteudo / SEO Tecnico com AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000013',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  'd63f10d9-5c60-4346-a4f2-1379b55e7bf0',
  'f64a4c9d-f9b0-4e4d-a3d1-3a731a1dc879',
  '[Resolvido] Como automatizei auditoria SEO de 200 paginas com Claude + Screaming Frog',
  '<p>Recebi um projeto de auditoria SEO para um portal de noticias com mais de 200 paginas ativas. Fazer manualmente levaria semanas. Com AI, fiz em 2 dias.</p><p><strong>Ferramentas usadas:</strong></p><ul><li>Screaming Frog (crawl completo)</li><li>Google Search Console (dados de performance)</li><li>Claude Sonnet (analise e recomendacoes)</li><li>Python (script de integracao)</li></ul><p><strong>Processo:</strong></p><ol><li>Exportei o crawl do Screaming Frog (CSV com todas as paginas, titles, metas, H1s, status codes)</li><li>Exportei dados de performance do GSC (cliques, impressoes, CTR, posicao por pagina)</li><li>Criei um script Python que alimenta o Claude com dados de 10 paginas por vez</li><li>Claude analisa: title tag, meta description, H1, internal linking, conteudo vs keyword</li><li>Gera recomendacoes especificas por pagina em formato CSV</li></ol><p><strong>O que o Claude encontrou que eu nao teria visto manualmente:</strong></p><ul><li>43 paginas com title tag duplicado (mesmo template mal configurado)</li><li>17 paginas com keyword cannibalization (competindo entre si)</li><li>89 paginas sem internal links apontando para elas (orphan pages)</li></ul><p>Depois das correcoes, o trafego organico subiu 47% em 60 dias. O cliente ficou impressionado com a velocidade e profundidade da auditoria.</p>',
  'Automatizei auditoria SEO de 200+ paginas com Claude + Screaming Frog + Python. Claude encontrou 43 titles duplicados, 17 keyword cannibalization, 89 orphan pages. Trafego organico subiu 47% em 60 dias.',
  'thread',
  ARRAY['seo', 'auditoria', 'claude', 'screaming-frog', 'tecnico'],
  now() - interval '16 hours',
  now() - interval '16 hours',
  156, 9, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 14: AI para E-commerce / Automacao de Loja
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000001',
  '9399b6b1-b100-4ced-bc90-bb1cb83634cc',
  'c43383ed-2182-4d20-9b89-009d34af8a89',
  'Descricoes de produto com AI que aumentaram minha conversao em 34%',
  '<p>Tenho um e-commerce de cosmeticos naturais com ~800 SKUs. Reescrever todas as descricoes manualmente levaria meses. Fiz com AI em 1 semana e os resultados foram surpreendentes.</p><p><strong>Abordagem errada (que tentei primeiro):</strong></p><p>Jogar nome do produto no GPT e pedir "escreva uma descricao". Resultado: textos genericos, sem personalidade, parecendo gerado por maquina.</p><p><strong>Abordagem que funcionou:</strong></p><ol><li>Analisei as 20 descricoes com maior conversao da loja</li><li>Pedi pro Claude extrair o "tom de voz" e a "estrutura" dessas descricoes</li><li>Criei um prompt template com: tom de voz, estrutura, beneficios-chave por categoria, e restricoes (ex: nao usar superlativos falsos, citar ingredientes reais)</li><li>Processei em lotes de 50 produtos via API</li><li>Revisei manualmente ~20% (os produtos hero)</li></ol><p><strong>Estrutura da descricao que converte:</strong></p><ul><li>Headline emocional (1 linha)</li><li>Beneficio principal (2-3 linhas)</li><li>Ingredientes-chave com explicacao simples</li><li>Como usar (passo a passo)</li><li>Para quem e indicado</li><li>Selo/certificacao relevante</li></ul><p><strong>Numeros:</strong> Taxa de conversao media subiu de 2.1% para 2.82%. Em 800 SKUs, isso representa um aumento significativo no faturamento mensal.</p>',
  'Reescrevi 800 descricoes de produto com AI em 1 semana. Conversao subiu de 2.1% para 2.82%. Chave: extrair tom de voz dos melhores textos existentes e usar como referencia.',
  'thread',
  ARRAY['ecommerce', 'descricoes', 'conversao', 'copywriting', 'cosmeticos'],
  now() - interval '48 hours',
  now() - interval '48 hours',
  198, 13, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 15: AI para Infoprodutos / Criacao de Curso com AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000015',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  '7cb0b2ca-f2f8-43cc-86b6-badae68c0b04',
  '20998c5f-83da-4167-81a6-5a879782fca3',
  'Criei um curso online do zero ate o lancamento em 15 dias usando AI — R$47k no primeiro lancamento',
  '<p>Vou documentar todo o processo de como criei e lancei um curso de "Automacao com AI para Dentistas" em apenas 15 dias, usando AI em cada etapa.</p><p><strong>Dia 1-3: Pesquisa e validacao</strong></p><ul><li>Usei Claude para analisar 50 posts de grupos de Facebook de dentistas sobre dores com tecnologia</li><li>Validei a ideia com 3 entrevistas rapidas (30 min cada) com dentistas da minha rede</li><li>Claude estruturou a grade curricular baseada nas dores mapeadas</li></ul><p><strong>Dia 4-8: Producao de conteudo</strong></p><ul><li>Claude gerou o roteiro de cada aula (15 aulas, ~20 min cada)</li><li>Gravei as aulas usando os roteiros como guia (nao teleprompter — usei como base)</li><li>AI transcreveu e gerou resumos para material de apoio</li></ul><p><strong>Dia 9-12: Pagina de vendas e copy</strong></p><ul><li>Claude escreveu a VSL (revisada e ajustada por mim)</li><li>Midjourney para mockups e visuais da pagina</li><li>Copy de email marketing e anuncios gerados com AI</li></ul><p><strong>Dia 13-15: Lancamento</strong></p><ul><li>3 lives de aquecimento (roteiro assistido por AI)</li><li>Sequencia de 7 emails de lancamento</li><li>Ads rodando em Meta e Google</li></ul><p><strong>Resultado do primeiro lancamento:</strong> 94 vendas a R$497 = R$46.718. CPL medio de R$8,50 e taxa de conversao da pagina de 4.7%.</p>',
  'Criei e lancei curso de Automacao com AI para Dentistas em 15 dias. AI usada em todas as etapas: pesquisa, roteiros, producao, copy, lancamento. Resultado: 94 vendas a R$497 = R$46.718.',
  'thread',
  ARRAY['infoproduto', 'lancamento', 'curso', 'dentistas', 'automacao'],
  now() - interval '42 hours',
  now() - interval '42 hours',
  301, 17, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 16: Ferramentas & Reviews / Reviews de Tools
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000016',
  '00000000-0000-0000-0000-000000000001',
  '3d0b82fb-c4bc-457a-be6f-99725b2e093a',
  'e7263d6a-e6de-4aa2-9c9b-37bc8d0b1281',
  'Review honesto: Cursor AI vs Windsurf vs Claude Code — qual o melhor IDE com AI em 2026?',
  '<p>Usei os 3 por pelo menos 1 mes cada em projetos reais. Aqui vai minha review sem patrocinio.</p><p><strong>Cursor AI:</strong></p><ul><li>Melhor para: devs que ja usam VS Code e querem adicionar AI sem mudar workflow</li><li>Destaque: Tab completion e muito bom, composer para refatoracao</li><li>Fraqueza: pode ficar lento em projetos grandes, pricing confuso</li><li>Nota: 8/10</li></ul><p><strong>Windsurf (Codeium):</strong></p><ul><li>Melhor para: quem quer alternativa mais barata ao Cursor</li><li>Destaque: Cascade mode e impressionante para mudancas multi-arquivo</li><li>Fraqueza: menos polido que o Cursor, comunidade menor</li><li>Nota: 7/10</li></ul><p><strong>Claude Code (CLI):</strong></p><ul><li>Melhor para: devs avancados que preferem terminal, projetos complexos</li><li>Destaque: entendimento de contexto do projeto inteiro e insuperavel, agente autonomo real</li><li>Fraqueza: sem interface grafica, curva de aprendizado maior</li><li>Nota: 9/10 (para o publico certo)</li></ul><p><strong>Meu veredito:</strong> Para 80% dos devs, Cursor e a melhor escolha. Para os 20% que vivem no terminal e trabalham com projetos complexos, Claude Code e transformador. Windsurf e uma boa opcao custo-beneficio.</p>',
  'Review comparativo: Cursor AI (8/10), Windsurf (7/10), Claude Code (9/10 para publico certo). Cursor para maioria, Claude Code para devs avancados que preferem terminal.',
  'thread',
  ARRAY['cursor', 'windsurf', 'claude-code', 'ide', 'review', 'ferramentas'],
  now() - interval '14 hours',
  now() - interval '14 hours',
  423, 24, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 17: Off-topic & Networking / Apresente-se
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000017',
  'd5044806-1817-4bc1-86fb-56315e7f6946',
  'ba770108-cb53-4385-a0e3-bd89f01ff473',
  '1c8c60f5-b0c5-4862-b8b7-b62bcb83414e',
  'Apresentacao: CEO de agencia de marketing digital, explorando AI para escalar operacao',
  '<p>Opa, prazer! Me chamo Rodrigo, tenho 34 anos e sou CEO de uma agencia de marketing digital aqui em Belo Horizonte.</p><p><strong>Sobre mim:</strong></p><ul><li>12 anos de experiencia em marketing digital</li><li>Agencia com 15 funcionarios e ~40 clientes ativos</li><li>Faturamento atual: R$250k/mes</li><li>Especialidade: e-commerce e lead gen para servicos</li></ul><p><strong>Por que estou aqui:</strong></p><p>Percebi que AI nao e mais opcional — e sobrevivencia. Dois concorrentes nossos ja estao entregando mais rapido e mais barato usando AI. Preciso implementar AI na operacao da agencia antes que fique pra tras.</p><p><strong>O que quero aprender:</strong></p><ul><li>Como automatizar a producao de relatorios para clientes (gastamos 20h/semana nisso)</li><li>Melhores ferramentas de AI para criacao de conteudo em escala</li><li>Como treinar minha equipe para usar AI sem perder qualidade</li><li>Cases reais de agencias que ja fizeram essa transicao</li></ul><p><strong>O que posso contribuir:</strong></p><ul><li>Experiencia pratica com Meta Ads, Google Ads e SEO</li><li>Gestao de equipe e processos de agencia</li><li>Network no mercado de marketing digital</li></ul><p>Bora trocar ideia!</p>',
  'Apresentacao: Rodrigo, CEO de agencia de marketing digital em BH. 12 anos de experiencia, 15 funcionarios, 40 clientes. Quer implementar AI na operacao. Pode contribuir com experiencia pratica em ads e SEO.',
  'thread',
  ARRAY['apresentacao', 'agencia', 'marketing-digital', 'networking'],
  now() - interval '70 hours',
  now() - interval '70 hours',
  134, 8, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- THREAD 18: AI para Afiliados / Estrategias com AI
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, author_id, category_id, subcategory_id, title, content, content_plain, type, tags, created_at, updated_at, views_count, likes_count, comments_count)
VALUES (
  'a0000001-0000-0000-0000-000000000018',
  '00000000-0000-0000-0000-000000000001',
  'aab087b9-171e-4636-9411-4655b797789a',
  '16b94540-f105-42dd-8889-32b9613a3678',
  'Minha estrategia de afiliado com AI: R$8k/mes no piloto automatico com blogs gerados',
  '<p>Muita gente acha que afiliacao morreu, mas com AI ela ganhou uma nova vida. Vou compartilhar minha estrategia que gera R$8k/mes consistentemente.</p><p><strong>O modelo:</strong></p><p>Crio blogs de nicho monetizados com links de afiliado. A AI faz 90% do trabalho. Eu faco a estrategia e supervisao.</p><p><strong>Stack:</strong></p><ul><li><strong>Pesquisa de nicho:</strong> Claude analisa volume de busca + competicao + comissoes de programas de afiliados</li><li><strong>Geracao de conteudo:</strong> Claude escreve artigos de 2000-3000 palavras otimizados para SEO</li><li><strong>Publicacao:</strong> WordPress + pipeline automatizado com N8N</li><li><strong>Link building:</strong> AI gera outreach emails para guest posts</li></ul><p><strong>Meus 5 blogs ativos:</strong></p><ol><li>Blog de suplementos (R$3.200/mes — Monetizze)</li><li>Blog de ferramentas SaaS (R$2.100/mes — programas diretos)</li><li>Blog de cursos online (R$1.400/mes — Hotmart)</li><li>Blog de equipamentos home office (R$800/mes — Amazon)</li><li>Blog de apps de produtividade (R$500/mes — programas diretos)</li></ol><p><strong>Investimento mensal:</strong> ~R$400 (hosting + dominio + Claude API + ferramentas SEO). Margem de lucro absurda.</p><p><strong>Dica crucial:</strong> AI gera o conteudo, mas voce PRECISA revisar e adicionar experiencia real. Google detecta conteudo 100% AI e penaliza. Minha taxa de edicao e ~30% por artigo.</p>',
  'Estrategia de afiliacao com AI: 5 blogs de nicho gerando R$8k/mes. Claude para pesquisa e conteudo, N8N para automacao, WordPress. Investimento de R$400/mes. Chave: revisar 30% do conteudo AI.',
  'thread',
  ARRAY['afiliados', 'blog', 'seo', 'monetizacao', 'renda-passiva'],
  now() - interval '35 hours',
  now() - interval '35 hours',
  245, 14, 0
);

-- ══════════════════════════════════════════════════════════════════════════════
-- REPLIES (COMMENTS) — 70 realistic replies distributed across threads
-- ══════════════════════════════════════════════════════════════════════════════

-- === THREAD 1 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
 'Excelente workflow! Uma duvida: voce usa o Midjourney direto ou passa pelo ChatGPT com DALL-E 3 para gerar as variacoes? Tenho percebido que o DALL-E 3 aceita prompts mais descritivos enquanto o Midjourney precisa de prompts mais curtos e tecnicos.',
 now() - interval '66 hours', now() - interval '66 hours', 3),

('c0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Uso Midjourney V6.1 direto. Concordo que ele precisa de prompts mais tecnicos, mas a qualidade visual e superior pro tipo de criativo que preciso (produto + lifestyle). DALL-E 3 e melhor quando preciso de texto no criativo, porque o Midjourney ainda erra muito com texto.',
 now() - interval '65 hours', now() - interval '65 hours', 5),

('c0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
 'Sobre o CPM cair 22% — isso e porque o Meta premia criativos com bom engagement rate. Quanto mais variacoes boas voce sobe, mais rapido o algoritmo encontra a combinacao criativo-audiencia ideal. E basicamente dar mais munição pro machine learning do Meta.',
 now() - interval '63 hours', now() - interval '63 hours', 4),

('c0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Isso mesmo! E complementando: descobri que subir 10-15 criativos novos por semana mantem o CPM sempre baixo. O Meta "cansa" de criativos antigos rapido (creative fatigue). AI resolveu esse problema porque consigo produzir volume sem depender de designer.',
 now() - interval '61 hours', now() - interval '61 hours', 2);

-- === THREAD 2 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'ROAS de 9.7 e absurdo! Pergunta: como voce organizou os 150 criativos no Ads Manager? Subiu tudo numa campanha so ou dividiu por tipo de criativo/angulo? Estou com 50 criativos e ja esta dificil de gerenciar.',
 now() - interval '50 hours', now() - interval '50 hours', 3),

('c0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
 'Uma campanha Advantage+ Shopping, sem ad sets manuais. Subi os 150 criativos e deixei o algoritmo otimizar. O segredo do Advantage+ e justamente nao tentar controlar — voce alimenta com criativos e o ML faz a otimizacao. Quanto mais variacoes, melhor funciona.',
 now() - interval '49 hours', now() - interval '49 hours', 5),

('c0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000002', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Valeu! Outra duvida: quando voce diz que usou Claude para analisar os dados, voce jogou o CSV direto na conversa? Ou usou a API com algum script?',
 now() - interval '47 hours', now() - interval '47 hours', 1),

('c0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
 'Joguei o CSV direto no Claude.ai (plano Pro). Ele consegue processar CSVs com ate centenas de linhas sem problema. Pedi: "Analise esses dados de Meta Ads e identifique padroes entre os criativos com melhor CTR vs os piores. Considere: tipo de imagem, copy, CTA, horario de publicacao." Resultado super detalhado.',
 now() - interval '46 hours', now() - interval '46 hours', 4);

-- === THREAD 3 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
 'Implementei exatamente isso para uma rede de 8 clinicas de estetica. Usei Claude Haiku para o atendimento do dia-a-dia e GPT-4o para casos complexos (reclamacoes, duvidas medicas). O custo ficou em ~R$800/mes para 20k mensagens. A taxa de resolucao sem humano e de 73%.',
 now() - interval '43 hours', now() - interval '43 hours', 5),

('c0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000003', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Boa! 73% de resolucao automatica e otimo. Qual API de WhatsApp voce usou? A oficial do Meta (Cloud API) ou algum provider tipo Twilio/WATI?',
 now() - interval '42 hours', now() - interval '42 hours', 2),

('c0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
 'Uso a Z-API (provider brasileiro) por causa do suporte em portugues e preco mais acessivel que Twilio. Para volume menor, a Cloud API oficial e gratuita, mas precisa de aprovacao da Meta que pode demorar semanas.',
 now() - interval '41 hours', now() - interval '41 hours', 3),

('c0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000003', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Obrigado pelas dicas! Vou testar Claude Haiku + Z-API. Uma coisa que aprendi: e essencial ter um fallback para humano quando o bot nao consegue resolver. Nada pior do que paciente preso num loop de chatbot sem conseguir falar com uma pessoa real.',
 now() - interval '40 hours', now() - interval '40 hours', 4);

-- === THREAD 4 REPLIES (5 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000004', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Cara, sensacional! Esse agente de pesquisa de mercado e exatamente o que eu preciso. Voce disponibilizou o repo? Ou pelo menos pode compartilhar a estrutura dos prompts que cada agente da crew usa?',
 now() - interval '38 hours', now() - interval '38 hours', 5),

('c0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
 'Vou subir no GitHub essa semana! Enquanto isso, a estrutura basica e: Researcher tem acesso a Exa (web search) e recebe o prompt "pesquise os top 20 players no nicho X, foque em presenca digital e modelo de negocio". Analyst recebe o output e estrutura em categorias. Strategist identifica padroes e gaps. Reporter formata tudo.',
 now() - interval '37 hours', now() - interval '37 hours', 3),

('c0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000004', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Pergunta tecnica: como voce lidou com o rate limiting das APIs? Eu tentei usar CrewAI com Claude e depois de uns 50 requests sequenciais comecou a dar rate limit.',
 now() - interval '36 hours', now() - interval '36 hours', 2),

('c0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001',
 'Implementei retry com exponential backoff e tambem um cache layer com Supabase. Se a mesma query ja foi feita nos ultimos 7 dias, ele usa o resultado cacheado em vez de fazer nova chamada. Isso reduziu o numero de API calls em ~60%.',
 now() - interval '35 hours', now() - interval '35 hours', 4),

('c0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000004', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Cache com Supabase e inteligente demais. Vou implementar isso no meu projeto tambem. Obrigado por compartilhar!',
 now() - interval '34 hours', now() - interval '34 hours', 1);

-- === THREAD 5 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
 '8% de conversao em VSL e surreal. Parabens! Pergunta: como voce garante que a AI nao cria claims exagerados? No nicho de suplementos especialmente, tem muito risco de compliance.',
 now() - interval '34 hours', now() - interval '34 hours', 3),

('c0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000005', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Otima pergunta! Tenho uma lista de restricoes no prompt: "NAO prometa resultado especifico de saude/financeiro", "NAO use palavras como garantido, comprovado, milagroso", "SEMPRE inclua disclaimer quando falar de resultados". Alem disso, toda VSL passa por revisao humana antes de ir ao ar.',
 now() - interval '33 hours', now() - interval '33 hours', 5),

('c0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
 'Sobre o framework AIDA-P: voce adiciona a etapa de "Proof" depois do "Action"? Normalmente o CTA e o ultimo elemento. Ou voce intercala objecoes ao longo da VSL?',
 now() - interval '32 hours', now() - interval '32 hours', 2),

('c0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000005', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Na verdade, eu intercalo. A sequencia real e: Attention > Interest > Desire > Proof > Action > mais Proof > Action final. Duas rodadas de CTA com provas sociais entre elas. Testei e a segunda rodada de CTA converte quase tanto quanto a primeira.',
 now() - interval '31 hours', now() - interval '31 hours', 4);

-- === THREAD 6 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000006', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'De R$12k para R$53k/mes e uma mudanca brutal! Qual ferramenta de email marketing voce usa? E como a AI personaliza os emails baseado no comportamento do lead?',
 now() - interval '29 hours', now() - interval '29 hours', 3),

('c0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
 'Usamos ActiveCampaign com tags de comportamento. A AI entra em dois momentos: (1) geracao dos emails iniciais com diferentes versoes para cada segmento, e (2) analise semanal das metricas para sugerir ajustes. Por exemplo, se um segmento tem open rate abaixo de 15%, Claude sugere novas subject lines baseadas nas que performaram melhor em outros segmentos.',
 now() - interval '28 hours', now() - interval '28 hours', 4),

('c0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000006', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Entendi o modelo. Voce faz essa analise semanal manualmente ou automatizou com alguma integracao? To pensando em usar N8N para puxar metricas do ActiveCampaign e enviar pro Claude automaticamente.',
 now() - interval '27 hours', now() - interval '27 hours', 2);

-- === THREAD 7 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001',
 'Churn de 18% para 6% e gigante. Uma duvida: o GPT personaliza o email de boas-vindas baseado em que dados? Porque com so os dados do Stripe (nome, email, plano) parece pouco contexto para personalizar de verdade.',
 now() - interval '26 hours', now() - interval '26 hours', 2),

('c0000001-0000-0000-0000-000000000026', 'a0000001-0000-0000-0000-000000000007', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Boa observacao! Alem dos dados do Stripe, o Make consulta o formulario de cadastro que o cliente preenche ao assinar (tipo de imovel, tamanho da equipe, objetivo principal). O GPT recebe esses dados e personaliza o tom e as recomendacoes. Faz diferenca ter um onboarding form bem pensado antes.',
 now() - interval '25 hours', now() - interval '25 hours', 4),

('c0000001-0000-0000-0000-000000000027', 'a0000001-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001',
 'Faz total sentido. Onboarding form + AI e uma combinacao poderosa. Vou testar isso no meu SaaS tambem. Obrigado por compartilhar o workflow detalhado!',
 now() - interval '24 hours', now() - interval '24 hours', 1);

-- === THREAD 8 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000028', 'a0000001-0000-0000-0000-000000000008', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Concordo em quase tudo, mas discordo sobre o N8N ser menos intuitivo. Depois da versao 1.0, a interface melhorou MUITO. Os AI Agent nodes sao realmente game-changer — voce cria um agente com RAG em 15 minutos, sem codigo.',
 now() - interval '22 hours', now() - interval '22 hours', 3),

('c0000001-0000-0000-0000-000000000029', 'a0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001',
 'Justo, a interface melhorou bastante. Atualizei o post. Uma vantagem que nao mencionei: N8N permite custom nodes em TypeScript, o que e impossivel no Make. Para projetos que precisam de logica de negocio customizada, isso e essencial.',
 now() - interval '21 hours', now() - interval '21 hours', 4),

('c0000001-0000-0000-0000-000000000030', 'a0000001-0000-0000-0000-000000000008', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Pergunta pratica: quanto ta custando seu N8N self-hosted no Railway? E como ta a estabilidade? Ja tive problemas com Railway desligando instancias por inatividade.',
 now() - interval '20 hours', now() - interval '20 hours', 1),

('c0000001-0000-0000-0000-000000000031', 'a0000001-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001',
 'Pago ~US$7/mes no Railway (Starter plan). Estabilidade e boa, nao tive downtime nos ultimos 3 meses. O truque para evitar que desligue e ter pelo menos 1 workflow com trigger a cada 5 minutos (tipo um health check). Mas honestamente, para quem nao quer essa dor de cabeca, o N8N Cloud e uma boa opcao tambem.',
 now() - interval '19 hours', now() - interval '19 hours', 3);

-- === THREAD 9 REPLIES (5 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000032', 'a0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001',
 'Parabens pela coragem e pelo resultado! Pergunta honesta: como voce lidou com a inseguranca financeira nos primeiros meses? Eu ganho R$8k CLT e tenho medo de largar sem ter uma reserva grande.',
 now() - interval '60 hours', now() - interval '60 hours', 4),

('c0000001-0000-0000-0000-000000000033', 'a0000001-0000-0000-0000-000000000009', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Vou ser honesto: eu tinha 6 meses de reserva de emergencia antes de pedir demissao. E nos 2 primeiros meses eu fazia freelance a noite alem dos clientes da agencia, so para garantir renda. Nao recomendo pular sem rede de seguranca.',
 now() - interval '59 hours', now() - interval '59 hours', 5),

('c0000001-0000-0000-0000-000000000034', 'a0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001',
 'Sobre o nicho de clinicas: como voce encontra esses clientes? Cold outreach, indicacao, ads?',
 now() - interval '57 hours', now() - interval '57 hours', 2),

('c0000001-0000-0000-0000-000000000035', 'a0000001-0000-0000-0000-000000000009', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Combo de 3 canais: (1) LinkedIn — posto conteudo sobre AI para saude 3x por semana, gera leads organicamente. (2) Indicacao — cada cliente feliz indica 1-2 colegas, meu CAC por indicacao e zero. (3) Google Ads — campanha simples para "automacao clinica odontologica", gasta R$500/mes e traz 3-5 leads qualificados.',
 now() - interval '56 hours', now() - interval '56 hours', 5),

('c0000001-0000-0000-0000-000000000036', 'a0000001-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001',
 'Show! To comecando a pesquisar nichos para seguir esse caminho tambem. Obrigado por abrir o jogo com os numeros reais. E raro ver gente sendo transparente assim.',
 now() - interval '54 hours', now() - interval '54 hours', 3);

-- === THREAD 10 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000037', 'a0000001-0000-0000-0000-000000000010', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Esse framework 10x e ouro! Eu cometia exatamente esse erro de cobrar por hora. Mudei para value-based pricing e meu ticket medio triplicou. O cliente nem questiona o preco quando voce mostra o ROI claramente.',
 now() - interval '53 hours', now() - interval '53 hours', 4),

('c0000001-0000-0000-0000-000000000038', 'a0000001-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001',
 'Uma adendo sobre a tabela de precos: para consultoria estrategica, eu recomendo comecar com um "assessment" pago de R$1.500-2.000. Voce faz um diagnostico da empresa e entrega um roadmap de implementacao de AI. 70% dos assessments se convertem em projetos maiores.',
 now() - interval '51 hours', now() - interval '51 hours', 5),

('c0000001-0000-0000-0000-000000000039', 'a0000001-0000-0000-0000-000000000010', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'O assessment pago e genial. Funciona como um filtro de qualificacao — so paga quem tem budget e intencao real. Vou implementar isso. Valeu pela dica!',
 now() - interval '49 hours', now() - interval '49 hours', 2);

-- === THREAD 11 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000040', 'a0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001',
 'De 4.2% para 8.7% de CTR e uma melhoria ABSURDA. Qual e a resolucao final que voce usa? Porque percebi que thumbnails no Midjourney as vezes perdem qualidade quando voce faz upscale para 1280x720.',
 now() - interval '18 hours', now() - interval '18 hours', 2),

('c0000001-0000-0000-0000-000000000041', 'a0000001-0000-0000-0000-000000000011', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Eu gero em 16:9 no Midjourney (--ar 16:9) e depois uso o Topaz Gigapixel para upscale sem perda de qualidade. O resultado final fica em 1920x1080 com nitidez perfeita. O Topaz custa US$99 one-time e se paga no primeiro video.',
 now() - interval '17 hours', now() - interval '17 hours', 3),

('c0000001-0000-0000-0000-000000000042', 'a0000001-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001',
 'Dica extra: testem usar o Ideogram para o texto overlay em vez de tentar no Midjourney. O Ideogram e muito melhor com texto em imagens. Gero o fundo no Midjourney e o texto overlay no Ideogram, depois junto no Canva. Leva 2 minutos a mais mas o resultado e profissional.',
 now() - interval '15 hours', now() - interval '15 hours', 5);

-- === THREAD 12 REPLIES (5 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000043', 'a0000001-0000-0000-0000-000000000012', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Salario de R$18k remoto como AI Engineer e inspirador! Pergunta: nos meses 7-9 quando voce estudou deploy em producao, quais projetos voce construiu para praticar?',
 now() - interval '56 hours', now() - interval '56 hours', 3),

('c0000001-0000-0000-0000-000000000044', 'a0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001',
 'Tres projetos principais: (1) API de chatbot com RAG usando LangChain + Pinecone, deployada no AWS Lambda. (2) Pipeline de processamento de documentos com embeddings, rodando no GCP Cloud Run. (3) Dashboard de monitoramento de LLMs (latencia, custo, qualidade) com Streamlit no Railway. Todos estao no meu GitHub com README detalhado.',
 now() - interval '55 hours', now() - interval '55 hours', 5),

('c0000001-0000-0000-0000-000000000045', 'a0000001-0000-0000-0000-000000000012', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Voce acha que precisa saber ML classico (regressao, classificacao, etc.) ou pode ir direto pra LLMs? Eu sou dev frontend e quero fazer essa transicao mas nao quero gastar 6 meses estudando teoria de ML.',
 now() - interval '53 hours', now() - interval '53 hours', 2),

('c0000001-0000-0000-0000-000000000046', 'a0000001-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001',
 'Depende do tipo de vaga. Para AI Engineer (que implementa e deploya), voce pode ir direto para LLMs com uma base minima de ML. Para ML Engineer (que treina e otimiza modelos), precisa da base completa. O mercado tem MUITO mais vagas de AI Engineer do que ML Engineer, entao para maioria das pessoas faz mais sentido focar no pratico.',
 now() - interval '52 hours', now() - interval '52 hours', 4),

('c0000001-0000-0000-0000-000000000047', 'a0000001-0000-0000-0000-000000000012', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Perfeito, era isso que eu queria ouvir. Vou focar no caminho AI Engineer. Ja comecei o Fast.ai e realmente e incrivel. Obrigado pelo roadmap!',
 now() - interval '50 hours', now() - interval '50 hours', 1);

-- === THREAD 13 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000048', 'a0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001',
 '47% de aumento em trafego organico em 60 dias e um resultado solido. Pergunta: o script Python que integra Screaming Frog + Claude e open source? Seria muito util para a comunidade.',
 now() - interval '14 hours', now() - interval '14 hours', 3),

('c0000001-0000-0000-0000-000000000049', 'a0000001-0000-0000-0000-000000000013', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'To planejando abrir o codigo sim! E um script simples — basicamente le o CSV do Screaming Frog, divide em chunks de 10 paginas, e envia cada chunk para a API do Claude com um prompt de auditoria. Vou limpar o codigo e subir no GitHub essa semana.',
 now() - interval '12 hours', now() - interval '12 hours', 4),

('c0000001-0000-0000-0000-000000000050', 'a0000001-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001',
 'Dica para quem quiser fazer algo similar sem Python: da pra fazer com N8N. Webhook recebe o CSV, HTTP Request node chama a API do Claude, Spreadsheet node organiza o output. Zero codigo necessario.',
 now() - interval '10 hours', now() - interval '10 hours', 5);

-- === THREAD 14 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000051', 'a0000001-0000-0000-0000-000000000014', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Conversao de 2.1% para 2.82% parece pouco em percentual, mas com 800 SKUs e alto volume de trafego, o impacto no faturamento e enorme. Voce calculou quanto isso representou em R$ a mais por mes?',
 now() - interval '46 hours', now() - interval '46 hours', 2),

('c0000001-0000-0000-0000-000000000052', 'a0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001',
 'Com o trafego medio de 120k visitas/mes, a diferenca de 0.72 pontos percentuais representou ~860 vendas adicionais por mes. Com ticket medio de R$85, sao ~R$73k a mais por mes. So com descricoes melhores, sem gastar 1 real a mais em trafego.',
 now() - interval '45 hours', now() - interval '45 hours', 5),

('c0000001-0000-0000-0000-000000000053', 'a0000001-0000-0000-0000-000000000014', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'R$73k a mais por mes e impressionante. Uma curiosidade: voce usou o mesmo prompt template para todos os 800 SKUs ou adaptou por categoria de produto?',
 now() - interval '44 hours', now() - interval '44 hours', 1),

('c0000001-0000-0000-0000-000000000054', 'a0000001-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001',
 'Criei 4 templates por categoria: skincare, maquiagem, cabelos e corpo. Cada categoria tem beneficios-chave diferentes e vocabulario proprio. Por exemplo, skincare foca em ingredientes ativos e resultados clinicos, enquanto maquiagem foca em efeito visual e durabilidade. Essa segmentacao fez diferenca na qualidade.',
 now() - interval '43 hours', now() - interval '43 hours', 4);

-- === THREAD 15 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000055', 'a0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001',
 'R$47k no primeiro lancamento em 15 dias e absurdo. Pergunta crucial: como voce validou que o nicho (dentistas) tinha demanda antes de investir tempo na criacao?',
 now() - interval '40 hours', now() - interval '40 hours', 3),

('c0000001-0000-0000-0000-000000000056', 'a0000001-0000-0000-0000-000000000015', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Tres sinais que validaram: (1) Grupos de Facebook de dentistas com 50k+ membros tinham posts constantes sobre "como usar tecnologia na clinica". (2) Busca no Google "automacao consultorio odontologico" tinha 1.2k buscas/mes sem conteudo decente. (3) Conversei com 3 dentistas e todos falaram que pagariam para aprender. Quando o mercado te grita que quer algo, nao precisa de mais validacao.',
 now() - interval '39 hours', now() - interval '39 hours', 5),

('c0000001-0000-0000-0000-000000000057', 'a0000001-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001',
 'E sobre as aulas: voce gravou com teleprompter ou so usou o roteiro do Claude como guia? Porque acho que ler teleprompter fica robotico demais.',
 now() - interval '37 hours', now() - interval '37 hours', 1),

('c0000001-0000-0000-0000-000000000058', 'a0000001-0000-0000-0000-000000000015', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Zero teleprompter. O Claude gerava um roteiro com topicos e bullets. Eu lia antes, internalizava os pontos, e gravava naturalmente. Se travar, pauso, releio o topico, e continuo. Edicao depois resolve. O resultado final parece muito mais autentico do que ler.',
 now() - interval '36 hours', now() - interval '36 hours', 4);

-- === THREAD 16 REPLIES (5 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000059', 'a0000001-0000-0000-0000-000000000016', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Concordo muito com a nota 9/10 do Claude Code para devs avancados. Uso diariamente e a capacidade de entender o contexto inteiro do projeto e realmente insuperavel. Cursor e bom para completar linhas, mas Claude Code refatora arquivos inteiros com precisao.',
 now() - interval '12 hours', now() - interval '12 hours', 5),

('c0000001-0000-0000-0000-000000000060', 'a0000001-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001',
 'Uma coisa que faltou no review: custo. Cursor Pro e US$20/mes, Windsurf Pro e US$10/mes, e Claude Code depende do plano (Max a US$100/mes e ilimitado, Pro a US$20/mes com limites). Para quem usa muito, o Claude Max se paga facil.',
 now() - interval '11 hours', now() - interval '11 hours', 4),

('c0000001-0000-0000-0000-000000000061', 'a0000001-0000-0000-0000-000000000016', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Verdade, esqueci de mencionar preco! Atualizo o post. Para quem ta comecando e tem budget limitado, Windsurf a US$10/mes e imbativel no custo-beneficio.',
 now() - interval '10 hours', now() - interval '10 hours', 2),

('c0000001-0000-0000-0000-000000000062', 'a0000001-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001',
 'Pergunta: alguem ja testou o GitHub Copilot Workspace? Vi que eles lancaram uma versao beta que compete diretamente com o Cursor. Curioso para saber se ja presta.',
 now() - interval '8 hours', now() - interval '8 hours', 1),

('c0000001-0000-0000-0000-000000000063', 'a0000001-0000-0000-0000-000000000016', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Testei o Copilot Workspace na beta. Ainda esta cru comparado ao Cursor e Claude Code. A ideia e boa (planejar e executar tasks direto no GitHub), mas a qualidade do codigo gerado nao esta no mesmo nivel. Talvez em 6 meses melhore, mas hoje nao recomendo trocar.',
 now() - interval '6 hours', now() - interval '6 hours', 3);

-- === THREAD 17 REPLIES (3 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000064', 'a0000001-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001',
 'Bem-vindo, Rodrigo! Com 40 clientes e 15 funcionarios, voce esta numa posicao perfeita para implementar AI. A automacao de relatorios sozinha ja vai liberar umas 20h/semana da sua equipe. Se precisar de ajuda, e so postar aqui.',
 now() - interval '68 hours', now() - interval '68 hours', 3),

('c0000001-0000-0000-0000-000000000065', 'a0000001-0000-0000-0000-000000000017', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Rodrigo, sobre automacao de relatorios: usa Looker Studio (gratuito) + Google Sheets com API do Claude. O Looker puxa os dados automaticamente, e um script Google Apps Script chama o Claude para gerar os insights escritos. Minha agencia fazia 40h/semana de relatorio, agora faz 2h (so revisao).',
 now() - interval '66 hours', now() - interval '66 hours', 5),

('c0000001-0000-0000-0000-000000000066', 'a0000001-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001',
 'Sobre treinar a equipe: recomendo comecar pelo time de criacao de conteudo. Ensina a usar Claude/GPT como co-writer (nao substituto) e mede a produtividade antes/depois. Normalmente a equipe de conteudo e a que mais se beneficia rapidamente e serve de case interno para convencer o resto do time.',
 now() - interval '64 hours', now() - interval '64 hours', 4);

-- === THREAD 18 REPLIES (4 replies) ===

INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at, likes_count)
VALUES
('c0000001-0000-0000-0000-000000000067', 'a0000001-0000-0000-0000-000000000018', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'R$8k/mes com R$400 de custo e uma margem insana. Mas tenho uma preocupacao: o Google nao ta penalizando blogs com conteudo gerado por AI? Ja vi casos de sites que perderam 90% do trafego da noite pro dia.',
 now() - interval '33 hours', now() - interval '33 hours', 3),

('c0000001-0000-0000-0000-000000000068', 'a0000001-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001',
 'Essa e a preocupacao numero 1 e por isso enfatizo a edicao de 30%. O Google nao penaliza AI por ser AI — ele penaliza conteudo de baixa qualidade, independente de quem escreveu. Se voce publica AI puro sem revisao, vai ser penalizado. Se voce edita, adiciona experiencia real, dados proprios e opiniao genuina, o conteudo fica melhor que 90% do que tem por ai.',
 now() - interval '32 hours', now() - interval '32 hours', 5),

('c0000001-0000-0000-0000-000000000069', 'a0000001-0000-0000-0000-000000000018', 'd5044806-1817-4bc1-86fb-56315e7f6946',
 'Sobre os programas de afiliados: voce usa Hotmart e Monetizze direto ou tem algum agregador? E como voce escolhe quais produtos promover?',
 now() - interval '30 hours', now() - interval '30 hours', 1),

('c0000001-0000-0000-0000-000000000070', 'a0000001-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001',
 'Uso os programas diretos (Hotmart, Monetizze, Amazon). Para escolher produtos, meu criterio e: (1) comissao minima de 30%, (2) produto com boa reputacao (nota minima 4/5), (3) pagina de vendas profissional, (4) suporte ativo do produtor. AI me ajuda a analisar esses criterios em escala — jogo a pagina de vendas no Claude e ele avalia a qualidade da copy e da oferta.',
 now() - interval '28 hours', now() - interval '28 hours', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- UPDATE COUNTERS
-- ══════════════════════════════════════════════════════════════════════════════

-- Update comments_count on posts
UPDATE posts SET comments_count = (
  SELECT count(*) FROM comments WHERE comments.post_id = posts.id
) WHERE type = 'thread';

-- Update last_reply_at on posts
UPDATE posts SET last_reply_at = (
  SELECT max(created_at) FROM comments WHERE comments.post_id = posts.id
) WHERE type = 'thread';

-- Update last_reply_by on posts
UPDATE posts SET last_reply_by = (
  SELECT author_id FROM comments WHERE comments.post_id = posts.id ORDER BY created_at DESC LIMIT 1
) WHERE type = 'thread';

-- Update threads_count on categories
UPDATE forum_categories SET threads_count = (
  SELECT count(*) FROM posts WHERE posts.category_id = forum_categories.id AND posts.type = 'thread'
);

-- Update posts_count on categories (threads + replies are both "posts" in the broader sense)
UPDATE forum_categories SET posts_count = threads_count;

-- Update threads_count on subcategories
UPDATE forum_subcategories SET threads_count = (
  SELECT count(*) FROM posts WHERE posts.subcategory_id = forum_subcategories.id AND posts.type = 'thread'
);

-- Update posts_count on subcategories
UPDATE forum_subcategories SET posts_count = threads_count;

-- Update last_thread_at on categories
UPDATE forum_categories SET last_thread_at = (
  SELECT max(created_at) FROM posts WHERE posts.category_id = forum_categories.id AND posts.type = 'thread'
);

-- Update last_thread_at on subcategories
UPDATE forum_subcategories SET last_thread_at = (
  SELECT max(created_at) FROM posts WHERE posts.subcategory_id = forum_subcategories.id AND posts.type = 'thread'
);

-- ══════════════════════════════════════════════════════════════════════════════
-- MARK SOLVED THREADS (3 threads)
-- ══════════════════════════════════════════════════════════════════════════════

-- Thread 13: SEO audit (already marked [Resolvido] in title)
UPDATE posts SET is_solved = true WHERE id = 'a0000001-0000-0000-0000-000000000013';

-- Thread 3: Claude vs GPT for customer service (resolved through discussion)
UPDATE posts SET is_solved = true WHERE id = 'a0000001-0000-0000-0000-000000000003';

-- Thread 8: N8N vs Make (comprehensive comparison resolved)
UPDATE posts SET is_solved = true WHERE id = 'a0000001-0000-0000-0000-000000000008';

-- ══════════════════════════════════════════════════════════════════════════════
-- MARK STICKY THREADS (2 threads)
-- ══════════════════════════════════════════════════════════════════════════════

-- Thread 4: CrewAI research agent (high-value technical content)
UPDATE posts SET is_sticky = true WHERE id = 'a0000001-0000-0000-0000-000000000004';

-- Thread 12: AI Engineer roadmap (high-value career guide)
UPDATE posts SET is_sticky = true WHERE id = 'a0000001-0000-0000-0000-000000000012';

-- ══════════════════════════════════════════════════════════════════════════════
-- UPDATE PROFILE COUNTERS
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE profiles SET
  threads_count = (SELECT count(*) FROM posts WHERE author_id = profiles.id AND type = 'thread'),
  replies_count = (SELECT count(*) FROM comments WHERE author_id = profiles.id)
WHERE id IN ('00000000-0000-0000-0000-000000000001', 'd5044806-1817-4bc1-86fb-56315e7f6946');
