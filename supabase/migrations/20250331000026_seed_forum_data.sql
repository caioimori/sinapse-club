-- Migration 026: Seed Forum Data
-- Story: FORUM-1 | ADR: ADR-001 Section 3.1, 6.1, 7.2
-- Categories, Subcategories, Professional Roles, Levels, Badges

-- ══════════════════════════════════════════════════════════════════════════════
-- 14 Forum Categories
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO forum_categories (slug, name, description, icon, color, sort_order, access) VALUES
('ai-para-ads', 'AI para Ads', 'Estrategias de trafego pago potencializadas por inteligencia artificial', '📢', '#EF4444', 1, 'free'),
('ai-para-ecommerce', 'AI para E-commerce', 'Automacao de lojas, precificacao inteligente e dropshipping com AI', '🛒', '#F97316', 2, 'free'),
('ai-para-infoprodutos', 'AI para Infoprodutos', 'Criacao de cursos, lancamentos e PLR potencializados por AI', '📦', '#EAB308', 3, 'free'),
('ai-para-afiliados', 'AI para Afiliados', 'Estrategias de afiliacao automatizadas com inteligencia artificial', '🤝', '#84CC16', 4, 'free'),
('ai-copywriting', 'AI Copywriting', 'Prompts, scripts de vendas, headlines e email marketing com AI', '✍️', '#22C55E', 5, 'free'),
('ai-para-seo', 'AI para SEO & Conteudo', 'SEO tecnico, conteudo automatizado e link building com AI', '🔍', '#14B8A6', 6, 'free'),
('llms-agentes', 'LLMs & Agentes', 'ChatGPT, Claude, Gemini, agentes autonomos e fine-tuning', '🤖', '#06B6D4', 7, 'free'),
('automacao-no-code', 'Automacao & No-Code', 'Make, Zapier, n8n, APIs, chatbots e WhatsApp Business', '⚡', '#3B82F6', 8, 'free'),
('ai-generativa', 'AI Generativa', 'Imagens, video, audio e design com inteligencia artificial', '🎨', '#6366F1', 9, 'free'),
('negocios-estrategia', 'Negocios & Estrategia', 'Modelos de negocio, gestao com AI, produtividade e financas', '💼', '#8B5CF6', 10, 'free'),
('carreira-ai', 'Carreira em AI', 'Vagas, portfolio, transicao de carreira e freelancing em AI', '🚀', '#A855F7', 11, 'free'),
('marketplace', 'Marketplace', 'Contrate profissionais, ofereca servicos e encontre parcerias', '🏪', '#EC4899', 12, 'pro'),
('ferramentas-reviews', 'Ferramentas & Reviews', 'Reviews de tools, comparativos, descontos e lancamentos', '🔧', '#F43F5E', 13, 'free'),
('off-topic', 'Off-topic & Networking', 'Apresente-se, off-topic, feedback da plataforma e eventos', '💬', '#78716C', 14, 'free');

-- ══════════════════════════════════════════════════════════════════════════════
-- ~60 Subcategories (4-8 per category)
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. AI para Ads (7 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'meta-ads-ai', 'Meta Ads + AI', 'Facebook e Instagram Ads com automacao e AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'google-ads-ai', 'Google Ads + AI', 'Google Ads, Performance Max e automacao com AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'tiktok-ads-ai', 'TikTok Ads + AI', 'TikTok Ads, criativos e automacao', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'youtube-ads-ai', 'YouTube Ads + AI', 'YouTube Ads e video marketing com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'outras-plataformas-ads', 'Outras Plataformas', 'Pinterest, Kwai, Bing, Native e outras', 5),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'tutoriais-ads', 'Tutoriais', 'Tutoriais e guias passo-a-passo', 6),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ads'), 'perguntas-ads', 'Perguntas & Respostas', 'Tire suas duvidas sobre ads com AI', 7);

-- 2. AI para E-commerce (5 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ecommerce'), 'dropshipping-ai', 'Dropshipping com AI', 'Automacao de dropshipping e sourcing com AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ecommerce'), 'automacao-loja', 'Automacao de Loja', 'Automacao de processos de e-commerce', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ecommerce'), 'precificacao-inteligente', 'Precificacao Inteligente', 'Pricing dinamico e analise de concorrencia com AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ecommerce'), 'tutoriais-ecommerce', 'Tutoriais', 'Tutoriais e guias de e-commerce com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-ecommerce'), 'perguntas-ecommerce', 'Perguntas & Respostas', 'Tire suas duvidas sobre e-commerce com AI', 5);

-- 3. AI para Infoprodutos (5 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-para-infoprodutos'), 'criacao-curso-ai', 'Criacao de Curso com AI', 'Como criar cursos e infoprodutos usando AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-infoprodutos'), 'lancamentos', 'Lancamentos', 'Estrategias de lancamento potencializadas por AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-infoprodutos'), 'plr-ai', 'PLR + AI', 'Criacao e otimizacao de PLR com inteligencia artificial', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-infoprodutos'), 'tutoriais-infoprodutos', 'Tutoriais', 'Tutoriais e guias de infoprodutos com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-infoprodutos'), 'perguntas-infoprodutos', 'Perguntas & Respostas', 'Tire suas duvidas sobre infoprodutos com AI', 5);

-- 4. AI para Afiliados (5 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-para-afiliados'), 'estrategias-afiliados-ai', 'Estrategias com AI', 'Estrategias de afiliacao usando inteligencia artificial', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-afiliados'), 'automacao-trafego', 'Automacao de Trafego', 'Automacao de campanhas de trafego para afiliados', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-afiliados'), 'funis-inteligentes', 'Funis Inteligentes', 'Funis de vendas automatizados com AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-afiliados'), 'tutoriais-afiliados', 'Tutoriais', 'Tutoriais e guias de afiliacao com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-afiliados'), 'perguntas-afiliados', 'Perguntas & Respostas', 'Tire suas duvidas sobre afiliacao com AI', 5);

-- 5. AI Copywriting (6 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'prompts-copy', 'Prompts para Copy', 'Melhores prompts para gerar copy de alta conversao', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'scripts-vendas', 'Scripts de Vendas', 'Scripts de vendas e VSL gerados com AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'headlines-hooks', 'Headlines & Hooks', 'Headlines, hooks e aberturas que convertem', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'email-marketing', 'Email Marketing', 'Sequencias de email e automacao com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'tutoriais-copy', 'Tutoriais', 'Tutoriais e guias de copywriting com AI', 5),
((SELECT id FROM forum_categories WHERE slug = 'ai-copywriting'), 'perguntas-copy', 'Perguntas & Respostas', 'Tire suas duvidas sobre copywriting com AI', 6);

-- 6. AI para SEO & Conteudo (6 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'seo-tecnico-ai', 'SEO Tecnico com AI', 'SEO tecnico, auditorias e otimizacao com AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'conteudo-automatizado', 'Conteudo Automatizado', 'Geracao de conteudo em escala com AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'link-building', 'Link Building', 'Estrategias de link building com auxilio de AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'youtube-seo', 'YouTube SEO', 'Otimizacao de videos e canais com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'tutoriais-seo', 'Tutoriais', 'Tutoriais e guias de SEO com AI', 5),
((SELECT id FROM forum_categories WHERE slug = 'ai-para-seo'), 'perguntas-seo', 'Perguntas & Respostas', 'Tire suas duvidas sobre SEO com AI', 6);

-- 7. LLMs & Agentes (8 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'chatgpt-openai', 'ChatGPT / OpenAI', 'ChatGPT, GPT-4, APIs da OpenAI e dicas', 1),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'claude-anthropic', 'Claude / Anthropic', 'Claude, Claude Code, MCP e ecossistema Anthropic', 2),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'gemini-google', 'Gemini / Google', 'Gemini, Vertex AI e ecossistema Google AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'agentes-autonomos', 'Agentes Autonomos', 'Crew AI, AutoGPT, agentes customizados e workflows', 4),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'fine-tuning', 'Fine-tuning', 'Fine-tuning de modelos, RAG e embeddings', 5),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'open-source', 'Open Source', 'Llama, Mistral, modelos open source e self-hosting', 6),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'tutoriais-llms', 'Tutoriais', 'Tutoriais e guias de LLMs e agentes', 7),
((SELECT id FROM forum_categories WHERE slug = 'llms-agentes'), 'perguntas-llms', 'Perguntas & Respostas', 'Tire suas duvidas sobre LLMs e agentes', 8);

-- 8. Automacao & No-Code (6 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'make-zapier-n8n', 'Make / Zapier / n8n', 'Automacoes com Make, Zapier, n8n e similares', 1),
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'apis-integracoes', 'APIs & Integracoes', 'APIs, webhooks e integracoes entre ferramentas', 2),
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'chatbots', 'Chatbots', 'Chatbots com AI para atendimento e vendas', 3),
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'whatsapp-business', 'WhatsApp Business', 'Automacao de WhatsApp com AI e chatbots', 4),
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'tutoriais-automacao', 'Tutoriais', 'Tutoriais e guias de automacao', 5),
((SELECT id FROM forum_categories WHERE slug = 'automacao-no-code'), 'perguntas-automacao', 'Perguntas & Respostas', 'Tire suas duvidas sobre automacao', 6);

-- 9. AI Generativa (6 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'imagens-ai', 'Imagens (Midjourney/DALL-E)', 'Geracao de imagens com Midjourney, DALL-E e similares', 1),
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'video-ai', 'Video (Sora/Runway)', 'Geracao e edicao de video com AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'audio-voz', 'Audio & Voz', 'Sintese de voz, musica e audio com AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'design-ai', 'Design', 'Design grafico e UI/UX com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'tutoriais-generativa', 'Tutoriais', 'Tutoriais e guias de AI generativa', 5),
((SELECT id FROM forum_categories WHERE slug = 'ai-generativa'), 'perguntas-generativa', 'Perguntas & Respostas', 'Tire suas duvidas sobre AI generativa', 6);

-- 10. Negocios & Estrategia (6 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'modelos-negocio', 'Modelos de Negocio', 'Modelos de negocio e monetizacao com AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'gestao-ai', 'Gestao com AI', 'Gestao empresarial potencializada por AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'produtividade', 'Produtividade', 'Produtividade pessoal e profissional com AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'financas', 'Financas', 'Financas, investimentos e analise com AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'tutoriais-negocios', 'Tutoriais', 'Tutoriais e guias de negocios com AI', 5),
((SELECT id FROM forum_categories WHERE slug = 'negocios-estrategia'), 'perguntas-negocios', 'Perguntas & Respostas', 'Tire suas duvidas sobre negocios com AI', 6);

-- 11. Carreira em AI (5 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'carreira-ai'), 'vagas-oportunidades', 'Vagas & Oportunidades', 'Vagas de emprego e oportunidades em AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'carreira-ai'), 'portfolio', 'Portfolio', 'Como montar portfolio e se posicionar em AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'carreira-ai'), 'transicao-carreira', 'Transicao de Carreira', 'Guias e experiencias de transicao para AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'carreira-ai'), 'freelancing-ai', 'Freelancing AI', 'Freelancing e consultoria em AI', 4),
((SELECT id FROM forum_categories WHERE slug = 'carreira-ai'), 'perguntas-carreira', 'Perguntas & Respostas', 'Tire suas duvidas sobre carreira em AI', 5);

-- 12. Marketplace (4 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order, access) VALUES
((SELECT id FROM forum_categories WHERE slug = 'marketplace'), 'contrate-profissional', 'Contrate um Profissional', 'Encontre profissionais de AI para seu projeto', 1, 'pro'),
((SELECT id FROM forum_categories WHERE slug = 'marketplace'), 'ofereca-servicos', 'Ofereca seus Servicos', 'Divulgue seus servicos e habilidades em AI', 2, 'pro'),
((SELECT id FROM forum_categories WHERE slug = 'marketplace'), 'parcerias-collabs', 'Parcerias & Collabs', 'Encontre parceiros para projetos e colaboracoes', 3, 'pro'),
((SELECT id FROM forum_categories WHERE slug = 'marketplace'), 'projetos', 'Projetos', 'Projetos abertos buscando colaboradores', 4, 'pro');

-- 13. Ferramentas & Reviews (5 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'ferramentas-reviews'), 'reviews-tools', 'Reviews de Tools', 'Reviews e analises de ferramentas de AI', 1),
((SELECT id FROM forum_categories WHERE slug = 'ferramentas-reviews'), 'comparativos', 'Comparativos', 'Comparativos entre ferramentas de AI', 2),
((SELECT id FROM forum_categories WHERE slug = 'ferramentas-reviews'), 'descontos-cupons', 'Descontos & Cupons', 'Descontos e cupons para ferramentas de AI', 3),
((SELECT id FROM forum_categories WHERE slug = 'ferramentas-reviews'), 'lancamentos-tools', 'Lancamentos', 'Novos lancamentos e atualizacoes de ferramentas', 4),
((SELECT id FROM forum_categories WHERE slug = 'ferramentas-reviews'), 'perguntas-ferramentas', 'Perguntas & Respostas', 'Tire suas duvidas sobre ferramentas de AI', 5);

-- 14. Off-topic & Networking (4 subcategories)
INSERT INTO forum_subcategories (category_id, slug, name, description, sort_order) VALUES
((SELECT id FROM forum_categories WHERE slug = 'off-topic'), 'apresente-se', 'Apresente-se', 'Se apresente para a comunidade', 1),
((SELECT id FROM forum_categories WHERE slug = 'off-topic'), 'off-topic-geral', 'Off-topic', 'Conversas que nao se encaixam em nenhuma categoria', 2),
((SELECT id FROM forum_categories WHERE slug = 'off-topic'), 'feedback-plataforma', 'Feedback da Plataforma', 'Sugestoes, bugs e feedback sobre o sinapse.club', 3),
((SELECT id FROM forum_categories WHERE slug = 'off-topic'), 'eventos-meetups', 'Eventos & Meetups', 'Eventos, meetups e encontros da comunidade', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- 24 Professional Roles across 7 clusters
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO professional_roles (slug, name, cluster, icon, sort_order) VALUES
-- C-Level
('ceo', 'CEO', 'c-level', '👑', 1),
('cto', 'CTO', 'c-level', '💻', 2),
('cmo', 'CMO', 'c-level', '📊', 3),
('coo', 'COO', 'c-level', '⚙️', 4),
('cfo', 'CFO', 'c-level', '💰', 5),
-- Management
('diretor', 'Diretor(a)', 'management', '📋', 6),
('head', 'Head', 'management', '🎯', 7),
('gerente', 'Gerente', 'management', '📌', 8),
('coordenador', 'Coordenador(a)', 'management', '🔗', 9),
-- Specialist
('especialista', 'Especialista', 'specialist', '⭐', 10),
('analista-senior', 'Analista Senior', 'specialist', '📈', 11),
('tech-lead', 'Tech Lead', 'specialist', '🛠️', 12),
('consultor', 'Consultor(a)', 'specialist', '💡', 13),
-- Operational
('analista', 'Analista', 'operational', '📝', 14),
('assistente', 'Assistente', 'operational', '📎', 15),
('estagiario', 'Estagiario(a)', 'operational', '🎓', 16),
-- Freelancer
('freelancer', 'Freelancer', 'freelancer', '🏠', 17),
('autonomo', 'Autonomo(a)', 'freelancer', '🔥', 18),
('consultor-independente', 'Consultor Independente', 'freelancer', '🧭', 19),
-- Entrepreneur
('founder', 'Founder', 'entrepreneur', '🚀', 20),
('co-founder', 'Co-Founder', 'entrepreneur', '🤝', 21),
('solo-founder', 'Solo Founder', 'entrepreneur', '🦄', 22),
-- Student
('estudante', 'Estudante', 'student', '📚', 23),
('em-transicao', 'Em Transicao', 'student', '🔄', 24);

-- ══════════════════════════════════════════════════════════════════════════════
-- 10 Levels (Gamification)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO levels (level, name, xp_required, perks, color) VALUES
(1, 'Novato', 0, ARRAY['Basic access'], '#94A3B8'),
(2, 'Aprendiz', 100, ARRAY['Can create polls'], '#64748B'),
(3, 'Membro', 300, ARRAY['Custom avatar frame'], '#475569'),
(4, 'Contribuidor', 700, ARRAY['Access to Marketplace'], '#334155'),
(5, 'Especialista', 1500, ARRAY['Can pin own thread (1/week)'], '#1E293B'),
(6, 'Veterano', 3000, ARRAY['Access to beta features'], '#0F172A'),
(7, 'Expert', 6000, ARRAY['Custom badge'], '#7C3AED'),
(8, 'Mestre', 12000, ARRAY['Mentor badge', 'Private area'], '#6D28D9'),
(9, 'Lenda', 25000, ARRAY['Exclusive area'], '#5B21B6'),
(10, 'Oraculo', 50000, ARRAY['Everything', 'Moderator tools'], '#4C1D95');

-- ══════════════════════════════════════════════════════════════════════════════
-- Initial Badges (Level + Milestone + Cargo)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO badges (slug, name, description, icon, type, requirement_type, requirement_value, rarity) VALUES
-- Level badges
('level-1', 'Novato', 'Bem-vindo ao forum', '🌱', 'level', 'xp', 0, 'common'),
('level-2', 'Aprendiz', 'Alcancou Level 2', '📗', 'level', 'xp', 100, 'common'),
('level-3', 'Membro', 'Alcancou Level 3', '📘', 'level', 'xp', 300, 'common'),
('level-4', 'Contribuidor', 'Alcancou Level 4', '📙', 'level', 'xp', 700, 'uncommon'),
('level-5', 'Especialista', 'Alcancou Level 5', '⭐', 'level', 'xp', 1500, 'uncommon'),
('level-6', 'Veterano', 'Alcancou Level 6', '🏅', 'level', 'xp', 3000, 'rare'),
('level-7', 'Expert', 'Alcancou Level 7', '🎖️', 'level', 'xp', 6000, 'rare'),
('level-8', 'Mestre', 'Alcancou Level 8', '👑', 'level', 'xp', 12000, 'epic'),
('level-9', 'Lenda', 'Alcancou Level 9', '🔮', 'level', 'xp', 25000, 'epic'),
('level-10', 'Oraculo', 'Alcancou Level 10', '💎', 'level', 'xp', 50000, 'legendary'),
-- Milestone badges
('first-thread', 'Primeiro Thread', 'Criou seu primeiro thread', '✏️', 'milestone', 'posts', 1, 'common'),
('ten-threads', '10 Threads', 'Criou 10 threads', '📝', 'milestone', 'posts', 10, 'uncommon'),
('hundred-threads', '100 Threads', 'Criou 100 threads', '📚', 'milestone', 'posts', 100, 'rare'),
('first-reply', 'Primeira Resposta', 'Respondeu seu primeiro thread', '💬', 'milestone', 'replies', 1, 'common'),
('helpful', 'Util', 'Recebeu 10 likes em respostas', '👍', 'milestone', 'likes_received', 10, 'common'),
('streak-7', 'Semana Perfeita', '7 dias consecutivos no forum', '🔥', 'milestone', 'streak', 7, 'uncommon'),
('streak-30', 'Mes Dedicado', '30 dias consecutivos no forum', '🌟', 'milestone', 'streak', 30, 'rare'),
-- Cargo badges
('cargo-c-level', 'C-Level', 'Executivo C-Level verificado', '👔', 'cargo', NULL, NULL, 'epic'),
('cargo-founder', 'Founder', 'Fundador(a) verificado', '🚀', 'cargo', NULL, NULL, 'rare'),
('cargo-specialist', 'Especialista', 'Profissional especialista', '⚡', 'cargo', NULL, NULL, 'uncommon');

-- Link level badges to levels table
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-1') WHERE level = 1;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-2') WHERE level = 2;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-3') WHERE level = 3;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-4') WHERE level = 4;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-5') WHERE level = 5;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-6') WHERE level = 6;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-7') WHERE level = 7;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-8') WHERE level = 8;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-9') WHERE level = 9;
UPDATE levels SET badge_id = (SELECT id FROM badges WHERE slug = 'level-10') WHERE level = 10;
