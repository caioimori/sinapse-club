# Security Audit — 2026-04-11

**Auditor:** @cyber-orqx (Fortress)
**Scope:** sinapse.club forum platform — pre-public-launch audit
**Methodology:** Read-only static analysis against SINAPSE Constitution Article X (25 deployment blockers), OWASP Top 10, LGPD.
**Branch:** caio/feat/lp-landing-page
**Stack:** Next.js 16.2.1, React 19.2.4, Supabase (udwpovojufbpzrexvkcc), Vercel, AbacatePay

---

## Verdict

**CONDITIONAL — NO-GO until C1, C2, C3 fixed.**

Core security hygiene is strong (RLS on all tables, service_role server-only, good CSP/HSTS, webhook HMAC verification, DOMPurify on all rendered HTML). However, there are **3 critical blockers** (one constitutional — LGPD), an **open redirect** in the OAuth callback, and **zero rate limiting** on public endpoints. Landing publicly without fixing C1-C3 violates Article X Tier 2 blockers (#11, #13, #17) and exposes the AbacatePay webhook path if the env var is forgotten.

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High     | 5 |
| Medium   | 6 |
| Low      | 4 |

---

## Critical Findings (BLOCKERS)

### [C1] LGPD NON-COMPLIANT — No privacy policy, no account deletion, no consent mechanism

**Files:** (absent)
- No page at `src/app/(marketing)/privacy*`, `src/app/(marketing)/termos*`
- No route for user-initiated account deletion (grep `delete.*account` -> 0 files)
- No consent checkbox in `src/app/(auth)/register/page.tsx:12-45`
- No DPO/Encarregado designation anywhere in `docs/`

**Issue:** LGPD Art. 7, 9, 18, 37, 41 all require: (1) legal basis + consent, (2) public privacy policy, (3) user right to delete data, (4) DPO designated. None exist.

**Impact:** Launching to Brazilian users without these is illegal under LGPD. ANPD can fine up to 2% of revenue (cap R$50M per infraction). Blocks Constitutional Article X Tier 2 blockers #11, #13, #14, #17.

**Fix:**
1. Create `src/app/(marketing)/privacidade/page.tsx` with full LGPD-compliant policy (legal basis, data categories, retention, DPO contact, user rights, subprocessors list including Supabase/Vercel/AbacatePay/Google OAuth/GitHub).
2. Create `src/app/(marketing)/termos/page.tsx`.
3. Add required consent checkbox to `register/page.tsx` linked to both docs; block submit if unchecked.
4. Implement `DELETE /api/account` server action that: soft-deletes profile, revokes sessions, deletes personal posts or anonymizes author, calls `supabase.auth.admin.deleteUser(user.id)` via service role.
5. Designate DPO in `docs/legal/dpo.md` and reference email on privacy page.
6. Document breach notification runbook at `docs/runbooks/incident-response.md` (ANPD requires <3 days).

---

### [C2] Hardcoded AbacatePay webhook public key as fallback

**File:** `src/app/api/webhooks/abacatepay/route.ts:9-10,100-104`

**Issue:** `DEFAULT_ABACATEPAY_WEBHOOK_PUBLIC_KEY` is a 768-char string hardcoded in source. `getWebhookConfig()` falls back to it when `ABACATEPAY_WEBHOOK_PUBLIC_KEY` env var is missing. This means:
1. A leaked key cannot be rotated without a code push.
2. The key is committed to the repo permanently (public GitHub `caioimori/sinapse-club`).
3. If AbacatePay ever rotates their key, signature verification silently still passes against the stale hardcoded one.
4. Violates Article X "No hardcoded keys in source code" and CIS Control 3.

**Impact:** Secret in source = treated as compromised. Any attacker with the source can forge webhook signatures if env var is unset and activate arbitrary subscriptions / course enrollments.

**Fix:**
```ts
// Remove DEFAULT_ABACATEPAY_WEBHOOK_PUBLIC_KEY constant entirely.
function getWebhookConfig() {
  const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET?.trim();
  const publicKey = process.env.ABACATEPAY_WEBHOOK_PUBLIC_KEY?.trim();
  if (!webhookSecret || !publicKey) {
    throw new Error("Webhook not configured");
  }
  return { webhookSecret, publicKey };
}
```
Then: rotate the AbacatePay key (assume leaked), set `ABACATEPAY_WEBHOOK_PUBLIC_KEY` in Vercel env, purge from git history via `git filter-repo` (optional but recommended), re-deploy.

---

### [C3] Open redirect in OAuth callback

**File:** `src/app/auth/callback/route.ts:7,13`

**Issue:**
```ts
const next = searchParams.get("next") ?? "/forum";
// ...
return NextResponse.redirect(`${origin}${next}`);
```
`next` is attacker-controlled and never validated. Attacker crafts:
`https://forum.sinapse.club/auth/callback?code=X&next=//evil.com/phish`
Since `${origin}//evil.com` browsers parse as scheme-relative → redirects to `https://evil.com/phish` AFTER the user authenticated. Classic OAuth phishing amplifier (CWE-601).

**Impact:** Phishing + OAuth token replay. Combined with Google Sign-In flow, an attacker can harvest post-auth traffic.

**Fix:**
```ts
const rawNext = searchParams.get("next") ?? "/forum";
// Only allow same-origin relative paths starting with a single "/"
const next = /^\/(?!\/)[A-Za-z0-9/_\-?=&%.]*$/.test(rawNext) ? rawNext : "/forum";
return NextResponse.redirect(`${origin}${next}`);
```
Same fix applies to any other `redirect=` / `next=` parameter (search for `searchParams.get("redirect")` — found in `src/lib/supabase/middleware.ts:103` but that one is set by server, not attacker-controlled).

---

## High Findings

### [H1] Zero rate limiting on all API routes and auth

**Files:**
- `src/app/api/github/sync/route.ts` — unauthenticated-per-user API that calls api.github.com on demand (DoS via authenticated user spamming)
- `src/app/api/curation/trigger/route.ts` — admin check only, no limit (admin token theft = mass invocation of edge functions)
- `src/app/api/webhooks/abacatepay/route.ts` — rate limit absence lets attacker burn CPU on HMAC computation
- Login/register: `src/app/(auth)/login/page.tsx` + `register/page.tsx` — Supabase has basic limits but no app-level throttle on signInWithPassword

Grep `rate.?limit` → 0 files. Violates Article X Tier 3 blocker #16 and CIS Control 12.

**Fix:** Add Upstash Redis + `@upstash/ratelimit` wrapper around all POST endpoints and auth forms. Stricter limits on `/api/github/sync` (1 req / 60s / user) and login (5 / 15min / IP).

### [H2] CSP allows `unsafe-eval` and `unsafe-inline` in script-src

**File:** `next.config.ts:37`
```ts
"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
```
**Issue:** Nullifies most XSS defense-in-depth. Next.js App Router + React 19 can run with a strict nonce-based CSP since Next 13+. `unsafe-eval` is only needed during `next dev`.

**Fix:** Use Next.js official nonce strategy — https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy. Branch CSP by `process.env.NODE_ENV`: dev keeps `unsafe-eval`, prod uses `'strict-dynamic' 'nonce-${nonce}'`.

### [H3] `@hono/node-server` and `hono` moderate CVEs present

**File:** `package-lock.json` (transitive via `sinapse-ai@7.7.7`)

`npm audit` reports:
- GHSA-92pp-h63x-v22m (middleware bypass via repeated slashes in serveStatic) — moderate
- GHSA-xf4j-xp2r-rqqx (hono path traversal in toSSG) — moderate
- GHSA-r5rp-j6wh-rvv4, GHSA-26pp-8wgv-hjvm, GHSA-wmmm-f939-6g9c, GHSA-xpcf-pg52-r92g

These come from `sinapse-ai@7.7.7` dep tree. They don't run in production traffic (dev-only tooling), but they ship via `npm install` and trigger CI alarms. Fix: `npm audit fix` or remove the runtime `"sinapse-ai": "7.7.7"` entry from `package.json:37` — it has no runtime import in `src/`.

### [H4] `supabase/.temp/*.mjs` committed to git

**Files:**
- `supabase/.temp/apply-migrations.mjs`
- `supabase/.temp/apply-via-rpc.mjs`
- `supabase/.temp/test-db.mjs`
- `supabase/.temp/cli-latest`

These are throwaway dev scripts that connect with `SUPABASE_SERVICE_ROLE_KEY` and execute arbitrary SQL. They shouldn't be in the repo. Not secrets themselves, but demonstrate a path where service-role is wielded loosely. Add `supabase/.temp/` to `.gitignore` and `git rm -r --cached supabase/.temp`.

### [H5] Webhook logs customer emails in plain text (LGPD PII leak to logs)

**File:** `src/app/api/webhooks/abacatepay/route.ts:292,368-371,438-442`

`log("warn", "User not found for email: ${details.customerEmail}")` writes raw email to Vercel logs. Vercel logs are retained and accessible beyond the LGPD "need-to-know" principle. Art. 46 requires technical measures proportional to risk.

**Fix:** Mask emails in logs: `c***@example.com`. Create `src/lib/log-mask.ts` helper. Do the same for `user.id` (prefer first 8 chars).

---

## Medium Findings

### [M1] `src/app/api/curation/trigger/route.ts:18` uses `as any` to bypass typed profile query

`.select("role").eq("id", user.id).single() as any;` — defeats type safety of the role check. Not exploitable directly but invites regression. Replace with proper typed Database types.

### [M2] No Zod validation on any request body

Grep `from "zod"` → 0 files, even though `zod ^4.3.6` is installed. API routes parse JSON then trust shape. Example: `src/app/api/github/sync/route.ts:13` — only a regex check on `github_username`, no schema. Adopt `zod` for all POST bodies and server actions.

### [M3] Webhook uses pagination cap of 10 × 200 = 2000 users for `findUserByEmail`

**File:** `src/app/api/webhooks/abacatepay/route.ts:129-151`

Once the platform exceeds 2000 auth users, legitimate webhooks will silently return `null` and payments won't activate plans. Use `supabase.auth.admin.listUsers({ email })` filter (Supabase SDK v2.100+ supports it) or store `abacatepay_customer_id → user_id` mapping table.

### [M4] `register/page.tsx` no client-side password strength check

No minimum length, no entropy check before calling `supabase.auth.signUp`. Supabase default is 6 chars — too weak for a paid community. Enforce min 10 + Zod schema.

### [M5] CSP `img-src` allows wildcard subdomains but `connect-src` does not include AbacatePay checkout redirect domains

**File:** `next.config.ts:40-41`

Not a vuln per se, but may break checkout flow if AbacatePay iframes assets from subdomains.

### [M6] `/api/curation/trigger` admin check is route-local only

**File:** `src/app/api/curation/trigger/route.ts:14-22`

Middleware doesn't protect `/api/*` (line 53 treats `/api` as public). Good that the handler checks role, but one missed route = exposed. Add a `withAdmin()` wrapper used by every admin API route or add `/api/admin/*` to middleware's protected zone.

---

## Low Findings

### [L1] `console.error` logs include full error objects with stack traces

Examples: `src/app/(dashboard)/pricing/actions.ts:73,87,153,167`; `src/app/api/github/sync/route.ts:72`.
In production these go to Vercel logs (OK) but responses already omit details — that's fine. Add a `serializeError()` wrapper that strips PII before logging.

### [L2] Anonymous key and Supabase URL exposed via `next.config.ts:5-7`

This is by design (NEXT_PUBLIC_) and RLS protects them — but worth documenting explicitly in `docs/security/threat-model.md` that this is acceptable only while RLS remains non-negotiable.

### [L3] No `helmet`-style middleware; Next.js headers config is used instead

Acceptable (`next.config.ts:16-48` has X-Content-Type-Options, X-Frame-Options=SAMEORIGIN, HSTS 2y, Referrer-Policy, Permissions-Policy, CSP, `frame-ancestors 'none'`). Consider adding `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`.

### [L4] `scripts/seed-forum-threads.mjs` uses service role

Not imported at runtime, but flagging. Move to `supabase/scripts/` and document clearly that seed scripts require `SUPABASE_SERVICE_ROLE_KEY` from a local-only `.env.local`.

---

## Positive Findings (good hygiene)

- [x] RLS enabled on 100% of user-data tables (all 7 migration files with `CREATE TABLE` also contain matching `ENABLE ROW LEVEL SECURITY`).
- [x] `service_role` used only in server files (`admin-config.ts`, `webhooks/abacatepay/route.ts`, `curation/trigger/route.ts`) — never in `(auth)`, `(dashboard)`, `components/`, `public/`.
- [x] AbacatePay webhook uses HMAC-SHA256 via `crypto.timingSafeEqual` (`route.ts:83-98`) — side-channel-safe.
- [x] All user-generated HTML rendered through `sanitizeHtml()` (DOMPurify with strict ALLOWED_TAGS allowlist) — 4 `dangerouslySetInnerHTML` sites all sanitized (`forum/thread-detail.tsx:159`, `forum/thread-reply.tsx:185`, `feed/post-card.tsx:346,371`, `demo/page.tsx:273`).
- [x] `.env*` covered by `.gitignore:33-34,45-46`. No committed `.env` files.
- [x] HSTS 2 years + preload, X-Frame-Options SAMEORIGIN, `frame-ancestors 'none'`, Permissions-Policy blocks camera/mic/geo.
- [x] Middleware enforces auth + admin role + pro-tier gating (`src/lib/supabase/middleware.ts:100-138`).
- [x] No SQL string interpolation found; all DB access via Supabase parameterized query builder or typed RPCs.
- [x] Webhook has idempotency checks (`route.ts:213-223, 261-267`).
- [x] Double webhook auth: URL secret (`webhookSecret` query param) + HMAC signature header. Defense in depth.

---

## LGPD Compliance Status

- [ ] Consent mechanism (opt-in checkbox on register) — **MISSING**
- [ ] Privacy policy page public — **MISSING**
- [ ] Data deletion mechanism (user self-service) — **MISSING**
- [ ] DPO/Encarregado designated and contact published — **MISSING**
- [ ] Breach notification procedure documented — **MISSING**
- [x] Data minimization in DB schema (profiles store only needed fields)
- [x] TLS enforced (HSTS)
- [x] RLS isolates users from each other's data

**LGPD Verdict:** NON-COMPLIANT. Public launch to Brazilian users is a regulatory violation.

---

## Remediation Plan — Path to GO

| Priority | Fix | Est. Effort |
|----------|-----|-------------|
| P0 | C2: remove hardcoded webhook key, rotate, set env var | 30 min |
| P0 | C3: validate `next` param in OAuth callback | 15 min |
| P0 | C1: privacy + terms + consent + deletion endpoint + DPO doc | 1.5 days |
| P1 | H1: Upstash rate limiter on all POST routes + login | 3h |
| P1 | H2: nonce-based CSP, drop unsafe-eval in prod | 2h |
| P1 | H4: remove `supabase/.temp/` from git | 10 min |
| P1 | H5: PII masking in webhook logs | 30 min |
| P2 | H3: remove `sinapse-ai@7.7.7` dep or `npm audit fix` | 20 min |
| P2 | M1-M6, L1-L4 | 1 day |

**Total estimated effort to reach GO: ~3 days of focused work.**

Recommend NO public launch until P0 items are closed and LGPD compliance artifacts (privacy, terms, deletion, DPO) are shipped. P1 items should ship within 7 days of launch.

---

*Audit conducted read-only. No code, database, or environment modifications were made.*
