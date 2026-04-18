-- ─────────────────────────────────────────────────────────────────
-- Fix: delete de post quebrava com type mismatch bigint/integer
--
-- Causa: sum(xp) retorna bigint; revert_xp(..., p_xp integer, ...) não
-- aceita bigint sem cast explicito. Postgres lança:
--   ERROR 42883: function revert_xp(uuid, bigint, unknown, uuid, unknown)
--   does not exist
--
-- Decisão: fazer cast pra integer DENTRO de revoke_reputation_on_post_delete
-- em vez de alterar a assinatura de revert_xp (que é chamada em outros
-- triggers com valores integer — alterar a assinatura exigiria cascade ou
-- criar overload, adicionando superficie de bug). Cast local é cirurgico.
-- ─────────────────────────────────────────────────────────────────

create or replace function revoke_reputation_on_post_delete()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select user_id, sum(xp)::int as total_xp
      from reputation_events
      where source_id = old.id
      group by user_id
      having sum(xp) > 0
  loop
    if r.total_xp > 0 then
      perform revert_xp(
        r.user_id, (-r.total_xp)::int, 'revert_post_deleted', old.id, null
      );
    end if;
  end loop;
  return old;
end;
$$;
