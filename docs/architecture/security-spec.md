# Security Specification — sinapse.club

> Owner: @cybersecurity (Fortress)
> Status: DRAFT v1
> Created: 2026-03-27

---

## 1. Threat Model

### 1.1 Assets

| Asset | Sensitivity | Impact if compromised |
|-------|------------|----------------------|
| User credentials | HIGH | Account takeover |
| Payment data (Stripe tokens) | CRITICAL | Financial fraud |
| User PII (email, name) | HIGH | LGPD violation, reputation |
| Course video content | MEDIUM | Revenue loss (piracy) |
| API keys (X, DeepL, Stripe) | CRITICAL | Service abuse, financial |
| Curated content database | LOW | No sensitive data |

### 1.2 Threat Vectors

| Vector | Risk | Mitigation |
|--------|------|------------|
| Credential stuffing | HIGH | Rate limiting, 2FA (P2), breach detection |
| XSS via post content | MEDIUM | Sanitize Tiptap output, CSP headers |
| SQL injection | LOW | Supabase parameterized queries, Zod validation |
| Video piracy | MEDIUM | Signed URLs, DRM (future), watermark |
| API key exposure | HIGH | Server-only env vars, no client exposure |
| Stripe webhook spoofing | HIGH | Verify webhook signatures |
| CSRF | LOW | SameSite cookies, PKCE flow |
| Rate abuse (free tier) | MEDIUM | Per-tier rate limits on edge |

---

## 2. Authentication Security

### 2.1 Supabase Auth Configuration

```yaml
auth:
  providers:
    email: true
    google: true
    github: true (future)
    apple: true (future)

  password_policy:
    min_length: 8
    require_uppercase: false  # Usability over complexity
    require_number: false
    require_special: false
    # NIST 800-63B: length > complexity rules

  session:
    jwt_expiry: 3600         # 1 hour
    refresh_token_expiry: 604800  # 7 days
    reuse_interval: 10       # seconds

  rate_limits:
    sign_up: 5/hour/IP
    sign_in: 10/hour/IP
    password_reset: 3/hour/email
    magic_link: 5/hour/email

  hooks:
    after_sign_up: create_profile, send_welcome_email
    after_sign_in: update_streak, log_activity
```

### 2.2 JWT Strategy

```
JWT issued by Supabase Auth contains:
  - sub: user UUID
  - role: authenticated
  - app_metadata:
    - role: free|pro|premium|admin|instructor
    - stripe_customer_id: cus_xxx

Middleware verification:
  1. Extract JWT from cookie (supabase-auth-token)
  2. Verify signature (Supabase JWT secret)
  3. Check expiry
  4. Extract role for authorization
  5. Pass to RLS via supabase client
```

---

## 3. Authorization Model

### 3.1 Role Hierarchy

```
admin > instructor > premium > pro > free > anonymous

Permissions matrix:
                    | anon | free | pro  | prem | inst | admin |
  View landing page | ✅   | ✅   | ✅   | ✅   | ✅   | ✅    |
  View free spaces  | ❌   | ✅   | ✅   | ✅   | ✅   | ✅    |
  View pro spaces   | ❌   | ❌   | ✅   | ✅   | ✅   | ✅    |
  Create posts      | ❌   | ✅*  | ✅   | ✅   | ✅   | ✅    |
  View courses      | ❌   | 👁️   | 👁️   | 👁️   | ✅   | ✅    |
  Watch lessons     | ❌   | 🔒   | 🔒   | 🔒   | ✅   | ✅    |
  View calendar     | ❌   | ❌   | ✅   | ✅   | ✅   | ✅    |
  Join workshops    | ❌   | ❌   | ❌   | ✅   | ✅   | ✅    |
  Create courses    | ❌   | ❌   | ❌   | ❌   | ✅   | ✅    |
  Manage users      | ❌   | ❌   | ❌   | ❌   | ❌   | ✅    |

  ✅* = limited (1 post/day in free tier)
  👁️ = catalog only (no lesson access)
  🔒 = requires individual course purchase
```

### 3.2 RLS Enforcement

Authorization is enforced at the database level via RLS (Row Level Security). See `database-schema.md` for complete policies. Application code does NOT implement authorization — RLS is the single source of truth.

---

## 4. Data Protection & LGPD

### 4.1 LGPD Compliance

| Requirement | Implementation |
|-------------|---------------|
| Consent | Explicit opt-in at registration (checkbox) |
| Purpose limitation | Data used only for stated purposes |
| Data minimization | Collect only necessary data |
| Right to access | `/settings/data` → export all user data (JSON) |
| Right to deletion | `/settings/data` → delete account (30-day grace) |
| Right to portability | Same export endpoint |
| Data breach notification | Incident response plan + 72h notification |
| DPO | Caio Imori (initially) |

### 4.2 Data Handling

```yaml
data_at_rest:
  database: Supabase encryption at rest (AES-256, managed)
  storage: Supabase Storage encryption (S3 SSE)
  backups: Point-in-time recovery (Supabase Pro), encrypted

data_in_transit:
  external: TLS 1.3 (Vercel + Supabase enforce HTTPS)
  internal: TLS between Vercel → Supabase

data_retention:
  user_data: Until account deletion + 30 day grace
  activity_logs: 90 days
  curated_content: 30 days (low-score auto-deleted)
  payment_records: 5 years (legal requirement)
  analytics: 12 months (PostHog)

sensitive_data:
  passwords: bcrypt hash (Supabase Auth, never stored in plain)
  payment: Stripe handles all card data (PCI DSS compliant)
  tokens: server-side only, encrypted env vars
```

---

## 5. API Security

### 5.1 Rate Limiting

```yaml
rate_limits:
  # Per IP (anonymous)
  anonymous:
    requests: 60/minute
    search: 10/minute

  # Per user (authenticated)
  free:
    requests: 120/minute
    posts: 5/day
    comments: 30/day
    api_calls: 100/hour

  pro:
    requests: 300/minute
    posts: unlimited
    comments: unlimited
    api_calls: 500/hour

  premium:
    requests: 600/minute
    posts: unlimited
    comments: unlimited
    api_calls: 1000/hour

implementation: Vercel Edge Middleware + Upstash Redis (rate limiter)
```

### 5.2 Input Validation

```yaml
strategy: Zod schemas for ALL inputs

validation_points:
  - Server Actions (before DB write)
  - API Routes (before processing)
  - Client-side (UX only, not security)

sanitization:
  - Rich text (Tiptap): DOMPurify on server before storage
  - File uploads: type check + size limit + virus scan (future)
  - URLs: allowlist for embeds (YouTube, Twitter, GitHub)
```

### 5.3 Webhook Security

```yaml
stripe_webhooks:
  endpoint: /api/webhooks/stripe
  verification: stripe.webhooks.constructEvent(body, sig, secret)
  idempotency: Store processed event IDs, skip duplicates
  retry: Stripe retries for 3 days on failure
```

---

## 6. Content Security

### 6.1 Video Protection

```yaml
strategy:
  mvp:
    - Signed URLs with expiry (Bunny.net token auth)
    - URLs expire after 4 hours
    - Referer restriction (sinapse.club only)

  future:
    - DRM (Widevine/FairPlay via Bunny.net)
    - Invisible watermark with user ID
    - Download prevention (no right-click, DevTools detection)

note: >
  Perfect DRM is impossible. Focus on making casual piracy
  inconvenient, not on stopping determined pirates.
```

### 6.2 User Content Moderation

```yaml
strategy:
  automated:
    - Spam detection (simple keyword + pattern matching)
    - Link scanning (malicious URL detection)
    - Rate limiting (post frequency)

  manual:
    - Report button on all content
    - Admin moderation dashboard
    - Community guidelines with warnings → timeout → ban

  future:
    - AI content moderation (GPT-based)
    - Toxicity scoring
```

---

## 7. Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.mux.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.bunny.net",
      "media-src 'self' https://*.bunny.net https://*.mux.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.posthog.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "font-src 'self' data:",
    ].join('; ')
  }
]
```

---

## 8. Incident Response

### 8.1 Severity Levels

| Level | Description | Response Time | Example |
|-------|------------|---------------|---------|
| P0 | Critical | 1 hour | Data breach, payment compromise |
| P1 | High | 4 hours | Auth bypass, API key exposure |
| P2 | Medium | 24 hours | XSS vulnerability, rate limit bypass |
| P3 | Low | 72 hours | Minor UI bug, non-sensitive info leak |

### 8.2 Response Checklist

```
1. Identify and contain
2. Assess scope and impact
3. Notify affected users (LGPD: 72h for data breach)
4. Fix root cause
5. Post-mortem document
6. Update security measures
```

---

## 9. Security Checklist (Pre-Launch)

- [ ] All API keys in environment variables, not in code
- [ ] RLS enabled and tested on ALL tables
- [ ] Stripe webhook signature verification
- [ ] Rate limiting configured per tier
- [ ] Security headers applied
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced everywhere
- [ ] LGPD consent flow implemented
- [ ] Data export/deletion endpoints working
- [ ] Error messages don't leak sensitive info
- [ ] Dependency audit (npm audit)
- [ ] Video URLs signed and expiring
- [ ] Admin routes protected
- [ ] No sensitive data in client-side code

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-27 | Initial security spec | @cybersecurity (Fortress) + Imperator |
