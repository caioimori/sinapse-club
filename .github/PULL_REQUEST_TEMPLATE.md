# Pull Request

## O que mudou?
<!-- 1-3 parágrafos descrevendo a mudança em linguagem de humano -->

## Por que?
<!-- Link para a story em docs/stories/ ou explique o motivo -->

## Escopo
<!-- IN/OUT: o que esta PR resolve e o que deixa para depois -->

## Screenshots / antes-e-depois
<!-- Se há mudança visual, cole screenshot ou video curto -->

## Test plan
- [ ] Testei manualmente o fluxo principal
- [ ] `pnpm exec tsc --noEmit` passa
- [ ] `pnpm lint` passa (ou warnings justificados)
- [ ] `pnpm build` passa
- [ ] Sem regressões conhecidas em fluxos adjacentes

## Checklist de segurança
- [ ] Sem `.env*` commitado
- [ ] Sem API keys / tokens hardcoded
- [ ] Sem `service_role` key em código client-side
- [ ] Server actions críticas validam input (Zod)
- [ ] SQL via parametrização (nunca string interpolation)

## LGPD / dados pessoais
- [ ] Não introduzo coleta nova de dado pessoal **ou** atualizei consent/política
- [ ] RLS policies aplicadas a qualquer tabela nova com dado de usuário
- [ ] Deletion cascade configurada se aplicável

## Impacto em produção
- [ ] Migration reversível **ou** backup antes de aplicar
- [ ] Sem quebra de compat com usuários já onboardados
- [ ] Feature flag / rollout gradual se mudança for arriscada

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
