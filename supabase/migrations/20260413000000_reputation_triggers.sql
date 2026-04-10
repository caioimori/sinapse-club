-- Migration: Gamification MVP — reputation triggers + 6-tier level system
-- Story: GAMIF-MVP | Source: docs/research/gamification-benchmark-2026-04-11.md

-- ─────────────────────────────────────────────────────────────────
-- 1. Replace 10-tier level system with 6-tier benchmark system
--    Source: benchmark — "staff engineer que paga R$97/mês"
-- ─────────────────────────────────────────────────────────────────

DELETE FROM levels WHERE level > 6;

UPDATE levels SET
  name         = 'Iniciante',
  xp_required  = 0,
  color        = '#71717a',
  perks        = ARRAY['Acesso ao fórum', 'Leitura de conteúdo']
WHERE level = 1;

UPDATE levels SET
  name         = 'Operador',
  xp_required  = 100,
  color        = '#3b82f6',
  perks        = ARRAY['Comentar em posts', 'Perfil público']
WHERE level = 2;

UPDATE levels SET
  name         = 'Sênior',
  xp_required  = 500,
  color        = '#8b5cf6',
  perks        = ARRAY['Criar threads', 'Votar em posts']
WHERE level = 3;

UPDATE levels SET
  name         = 'Referência',
  xp_required  = 2000,
  color        = '#06b6d4',
  perks        = ARRAY['Adicionar tags', 'Editar wiki']
WHERE level = 4;

UPDATE levels SET
  name         = 'Mestre',
  xp_required  = 5000,
  color        = '#f59e0b',
  perks        = ARRAY['Flair personalizado', 'Moderação leve']
WHERE level = 5;

UPDATE levels SET
  name         = 'Legenda',
  xp_required  = 10000,
  color        = '#ef4444',
  perks        = ARRAY['Moderação completa', 'Badge exclusivo']
WHERE level = 6;

-- ─────────────────────────────────────────────────────────────────
-- 2. get_user_rank(reputation) → (level, name, xp_required, color)
-- ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_user_rank(p_reputation INT)
RETURNS TABLE(level INT, name TEXT, xp_required INT, color TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT level, name, xp_required, color
  FROM   levels
  WHERE  xp_required <= COALESCE(p_reputation, 0)
  ORDER  BY xp_required DESC
  LIMIT  1;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 3. award_reputation_for_reply() — posts INSERT → +5 for replies
-- ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION award_reputation_for_reply()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type = 'reply' AND NEW.author_id IS NOT NULL THEN
    UPDATE profiles
    SET    reputation = GREATEST(0, reputation + 5)
    WHERE  id = NEW.author_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reputation_reply ON posts;
CREATE TRIGGER trg_reputation_reply
  AFTER INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION award_reputation_for_reply();

-- ─────────────────────────────────────────────────────────────────
-- 4. award_reputation_for_upvote() — reactions INSERT → +10 to post author
-- ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION award_reputation_for_upvote()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_author UUID;
BEGIN
  SELECT author_id INTO v_post_author FROM posts WHERE id = NEW.post_id;

  -- No self-upvote; post must exist
  IF v_post_author IS NOT NULL AND v_post_author <> NEW.user_id THEN
    UPDATE profiles
    SET    reputation = GREATEST(0, reputation + 10)
    WHERE  id = v_post_author;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reputation_upvote ON reactions;
CREATE TRIGGER trg_reputation_upvote
  AFTER INSERT ON reactions
  FOR EACH ROW EXECUTE FUNCTION award_reputation_for_upvote();

-- ─────────────────────────────────────────────────────────────────
-- 5. revoke_reputation_for_upvote() — reactions DELETE → -10 from post author
-- ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION revoke_reputation_for_upvote()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_author UUID;
BEGIN
  SELECT author_id INTO v_post_author FROM posts WHERE id = OLD.post_id;

  IF v_post_author IS NOT NULL AND v_post_author <> OLD.user_id THEN
    UPDATE profiles
    SET    reputation = GREATEST(0, reputation - 10)
    WHERE  id = v_post_author;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_reputation_upvote_remove ON reactions;
CREATE TRIGGER trg_reputation_upvote_remove
  AFTER DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION revoke_reputation_for_upvote();
