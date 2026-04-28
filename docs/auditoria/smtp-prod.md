# TODO — SMTP custom em producao (escala)

> **Contexto:** PAYWALL-5 (signup-after-payment) usa Supabase Auth nativo
> pra mandar magic links. Funciona perfeito em volume baixo, mas precisa
> de SMTP custom quando o trafego escalar.

## Status atual

- Magic link disparado por `supabase.auth.admin.generateLink({ type: 'magiclink' })` no webhook AbacatePay
- Tambem usado por `supabase.auth.signInWithOtp` no botao "reenviar link" da `/welcome`
- Tudo passa pelo SMTP **default do Supabase** (gratuito, compartilhado entre todos os projetos free/paid)

## Limites do SMTP default

| Tier Supabase | Rate limit oficial | Suficiente para |
|---|---|---|
| Free | ~30 emails/hora, ~3 emails/min | < 700 signups/mes |
| Pro | ~100 emails/hora | < 2.500 signups/mes |
| Team / Enterprise | Negociavel | > 2.500/mes |

A partir de ~50 conversoes/dia consistentes vale plugar Resend ou Amazon SES.

## Como migrar (quando chegar a hora)

1. Criar conta em [Resend](https://resend.com) (gratis ate 3.000 emails/mes, depois ~$20/mes ate 50k)
2. Verificar dominio `sinapse.club` (DNS — DKIM + SPF)
3. Gerar API key
4. No Supabase Dashboard -> Project Settings -> Auth -> SMTP Settings:
   - Enable Custom SMTP
   - Host: `smtp.resend.com`
   - Port: `465`
   - User: `resend`
   - Password: a API key gerada
   - Sender email: `noreply@sinapse.club` (ou similar)
   - Sender name: `sinapse.club`
5. Customizar templates (opcional mas recomendado): Auth -> Email Templates
   - Magic Link, Confirm Signup, Invite User
6. Testar com `signInWithOtp` em ambiente staging
7. Promover pra producao

## Sinal de que precisa migrar AGORA

- Usuarios reclamando que nao recebem magic link
- Sentry mostrando erros tipo "rate_limit_exceeded" no fluxo `/welcome`
- > 30 signups/dia sustentados

## Quem decide

Caio. Esse TODO e pra **quando** virar prioridade — nao bloqueia o lancamento atual da PAYWALL-5.

---

*Criado em 2026-04-27 como parte do merge da PAYWALL-5.*
