# sinapse.club — Financial Viability Model

> **Prepared by:** @finance (Ledger) | **Date:** 2026-03-27
> **Currency:** BRL (R$) unless noted | **USD/BRL assumed:** R$ 5.50

---

## Table of Contents

1. [Pricing Benchmarks](#1-pricing-benchmarks)
2. [Cost Structure](#2-cost-structure)
3. [Revenue Model](#3-revenue-model)
4. [Break-Even Analysis](#4-break-even-analysis)
5. [Recommendations](#5-recommendations)

---

## 1. Pricing Benchmarks

### 1.1 Platform Pricing (Competitors / Analogues)

| Platform | Model | Price | Key Feature | Source |
|----------|-------|-------|-------------|--------|
| **Skool** | Creator subscription | $9-$99/mo (creator pays) | Community + courses, 2.9-10% tx fee | [Skool Pricing](https://www.skool.com/pricing) |
| **Circle** | Creator subscription | $89-$419/mo (creator pays) | Community + courses, 1-2% tx fee | [Circle Pricing](https://circle.so/pricing) |
| **Hotmart** | Revenue share | 9.90% + $0.50 per sale | Marketplace, no monthly fee | [Hotmart Pricing](https://hotmart.com/en/pricing) |
| **Kajabi** | Creator subscription | $71-$399/mo (creator pays) | All-in-one, 0% tx fee | [Kajabi Pricing](https://www.kajabi.com/pricing) |
| **Maven** | Revenue share | 10% per enrollment | Cohort-based courses | [Maven Pricing](https://maven.com/start) |

### 1.2 PT-BR Market — Tech Community Pricing

| Platform | Target | Price (R$/mo) | Model |
|----------|--------|---------------|-------|
| **Alura** | Tech education (general) | ~R$ 109/mo (annual plan) | Subscription, all courses |
| **Rocketseat ONE** | Dev education | ~R$ 146/mo (annual, 12x) | Annual subscription, all courses |
| **IA Expert Academy** | AI/Data Science | ~R$ 49-89/mo (estimated) | Monthly/semestral/annual |
| **MyHUB.IA** | AI tools bundle | R$ 69.90/mo (annual) | AI tool access |
| **Udemy (AI courses)** | Self-paced | R$ 28-212 (one-time) | Perpetual, heavy discounting |

**Key Insight — PT-BR Price Sensitivity:**
- Brazilian tech audience is accustomed to R$ 29-49/mo for communities
- R$ 69-149/mo for comprehensive education platforms
- R$ 200+ only for premium, recognized brands (Alura, Rocketseat)
- PIX and boleto are expected payment methods (not just credit card)
- Annual plans with 12x installments are the norm for higher-ticket items

### 1.3 Course Pricing Ranges (AI/Tech in Brazil)

| Type | Price Range (R$) | Notes |
|------|------------------|-------|
| **Perpetual (self-paced)** | R$ 97-497 | Udemy-style, heavy discounting expected |
| **Launch (cohort-based)** | R$ 297-1,997 | Scarcity + live interaction premium |
| **Mini-course / Workshop** | R$ 47-197 | Low-ticket, funnel entry |
| **Bootcamp / Formacao** | R$ 997-2,997 | Multi-week, project-based |

---

## 2. Cost Structure

### 2.1 Infrastructure Costs (Monthly)

#### Hosting & Compute

| Service | Plan | Monthly Cost | Notes |
|---------|------|-------------|-------|
| **Vercel Pro** | Pro | $20/mo (~R$ 110) | Next.js hosting, 10M edge requests, 1TB bandwidth |
| **Supabase** | Pro | $25/mo (~R$ 137) | 8GB DB, 100K MAUs, auth, realtime |
| **Domain + DNS** | Various | ~R$ 25/mo | sinapse.club + Cloudflare |
| **Email (Resend/Postmark)** | Starter | ~$20/mo (~R$ 110) | Transactional + marketing |
| **Total Hosting** | | **~R$ 382/mo** | MVP baseline |

**Scaling Note:** At 1,000+ subscribers, Supabase may need compute upgrade (+$50/mo) and Vercel may incur overages (+$20-50/mo).

#### Video Hosting & Streaming

| Service | Rate | Est. Monthly (50h content) | Est. Monthly (200h content) |
|---------|------|---------------------------|----------------------------|
| **Bunny Stream** | $0.01/GB storage + $0.005/GB delivery | ~$8 (~R$ 44) | ~$25 (~R$ 137) |
| **Mux** | $0.003/min storage + $0.00096/min delivery | ~$15 (~R$ 82) | ~$50 (~R$ 275) |

**Recommendation:** Bunny Stream for MVP (significantly cheaper). At 50 hours of stored content with ~500 monthly viewing hours:
- Storage: ~25GB = $0.25/mo
- Delivery: ~150GB = $0.75/mo
- Transcoding: free
- **Total: ~$1-5/mo for MVP, scaling to $20-50/mo at 1000 users**

**Chosen estimate:** R$ 50/mo (MVP) → R$ 275/mo (1000 subscribers)

#### Translation & AI Processing

| Service | Rate | Est. Monthly Usage | Monthly Cost |
|---------|------|-------------------|-------------|
| **DeepL API Pro** | $5.49 base + $25/1M chars | ~500K chars (news curation) | ~$18 (~R$ 99) |
| **GPT-4o-mini** (alternative) | $0.15/1M input + $0.60/1M output | ~2M tokens total | ~$1.20 (~R$ 7) |
| **GPT-4o** (quality tasks) | $2.50/1M input + $10/1M output | ~500K tokens | ~$6.25 (~R$ 34) |

**Recommendation:** Use GPT-4o-mini for bulk translation (16x cheaper than GPT-4o), GPT-4o for curation/summarization quality tasks. DeepL only if translation quality must be premium.

**Chosen estimate:** R$ 50/mo (MVP, GPT-4o-mini heavy) → R$ 200/mo (scaled)

#### Content Curation APIs

| API | Plan | Monthly Cost | Limits |
|-----|------|-------------|--------|
| **X (Twitter) API** | Basic | $200/mo (~R$ 1,100) | 15K tweets read/mo |
| **X API** | Free | $0 | 1 req/15min — unusable |
| **Reddit API** | Free tier | $0 | 10K calls/mo — sufficient for curation |
| **RSS Feeds** | Free | $0 | LLM docs, blogs, newsletters |

**CRITICAL WARNING:** X API Basic at $200/mo is a significant fixed cost. Alternatives:
- **Third-party X scrapers** (Apify, etc.): ~$49-99/mo for equivalent data
- **Manual curation + RSS**: $0 (labor cost only)
- **Community-driven submission**: $0

**Chosen estimate:** R$ 275/mo (X API Basic) or R$ 0 (RSS + community-driven for MVP)

### 2.2 Payment Processing Costs

#### Stripe Brazil Fees

| Method | Fee | Share of Payments (est.) | Effective Blended Rate |
|--------|-----|------------------------|----------------------|
| **Credit Card** | 3.99% + R$ 0.39 | 40% | 1.60% + R$ 0.16 |
| **PIX** | 1.19% | 50% | 0.60% |
| **Boleto** | R$ 3.45 flat | 10% | variable (high for low tickets) |

**Blended effective rate (weighted):** ~2.5% + R$ 0.20 per transaction

**Additional considerations:**
- IOF of 3.5% applies if business is domiciled outside Brazil
- If Brazilian CNPJ: no IOF, standard Stripe BR rates apply
- **Strong recommendation:** Operate with Brazilian entity (CNPJ) to avoid IOF

### 2.3 Total Monthly Cost Summary

| Category | MVP (0-100 users) | Growth (100-500) | Scale (500-1000) |
|----------|-------------------|-------------------|-------------------|
| Hosting (Vercel + Supabase + Email) | R$ 382 | R$ 450 | R$ 600 |
| Video (Bunny Stream) | R$ 50 | R$ 110 | R$ 275 |
| Translation/AI | R$ 50 | R$ 110 | R$ 200 |
| Content Curation APIs | R$ 0* | R$ 275 | R$ 1,100 |
| Payment Processing | ~2.5% of rev | ~2.5% of rev | ~2.5% of rev |
| Misc (monitoring, backups) | R$ 50 | R$ 100 | R$ 150 |
| **Total Fixed Costs** | **R$ 532/mo** | **R$ 1,045/mo** | **R$ 2,325/mo** |

*MVP uses RSS + community curation instead of X API

---

## 3. Revenue Model

### 3.1 Tier Structure

#### Tier Design

| Tier | Price | Value Proposition | Target |
|------|-------|------------------|--------|
| **Free** | R$ 0 | Public forum access, limited news feed, 1 free mini-course | Lead gen, community building |
| **Pro** | R$ 49/mo | Full curated news (EN↔PT), all forum areas, monthly live Q&A, calendar access | Core subscriber |
| **Premium** | R$ 97/mo | Everything in Pro + exclusive deep-dive sessions, early course access, priority support, private channel | Power user |

**Annual pricing (20% discount):**
- Pro: R$ 470/year (R$ 39.17/mo effective) — 12x R$ 39.17
- Premium: R$ 932/year (R$ 77.67/mo effective) — 12x R$ 77.67

**Rationale:**
- R$ 49/mo sits in the Brazilian "impulse subscribe" range for tech content
- R$ 97/mo is the ceiling for a community-only product (not full course platform)
- Free tier is essential for organic growth and SEO in PT-BR market

#### Course Pricing (Separate)

| Course Type | Price | Model | Est. Conversion |
|-------------|-------|-------|----------------|
| **Mini-course** | R$ 47-97 | Perpetual, always available | 5-8% of free users |
| **Standard course** | R$ 197-397 | Perpetual with launch windows | 3-5% of subscribers |
| **Premium course (launch)** | R$ 497-997 | Cohort-based, 2-4x/year | 2-3% of subscribers |
| **Bootcamp** | R$ 1,497-2,497 | Cohort, 4-8 weeks | 1-2% of subscribers |

**Subscriber discount:** Pro members get 15% off, Premium get 30% off courses.

### 3.2 Unit Economics

#### Key Assumptions

| Metric | Conservative | Moderate | Optimistic |
|--------|-------------|----------|-----------|
| **Monthly churn** | 8% | 6% | 4% |
| **Annual plan adoption** | 30% | 45% | 60% |
| **Pro:Premium ratio** | 80:20 | 70:30 | 60:40 |
| **CAC (organic-heavy)** | R$ 80 | R$ 50 | R$ 30 |
| **Course attach rate** | 10% | 15% | 20% |

**Churn context:** Community subscription average is 5.3% monthly. Tech/education averages 6.5%. Communities with strong engagement reduce churn by 23%. Annual plans reduce churn by 51%.

#### Customer Lifetime Value (LTV)

**Monthly subscriber (Pro, R$ 49/mo):**
- Average lifetime at 6% churn = 16.7 months
- LTV = R$ 49 x 16.7 = **R$ 818**

**Monthly subscriber (Premium, R$ 97/mo):**
- Average lifetime at 5% churn (premium retains better) = 20 months
- LTV = R$ 97 x 20 = **R$ 1,940**

**Blended LTV (70/30 Pro/Premium):**
- Blended = (0.70 x R$ 818) + (0.30 x R$ 1,940) = **R$ 1,155**

**With course upsell (15% attach, avg R$ 297):**
- Blended LTV = R$ 1,155 + (0.15 x R$ 297) = **R$ 1,200**

#### LTV:CAC Ratio

| Scenario | CAC | LTV | Ratio | Verdict |
|----------|-----|-----|-------|---------|
| Conservative | R$ 80 | R$ 1,000 | 12.5:1 | Excellent |
| Moderate | R$ 50 | R$ 1,200 | 24.0:1 | Outstanding |
| Optimistic | R$ 30 | R$ 1,400 | 46.7:1 | Exceptional |

**Note:** These ratios are very favorable because sinapse.club leverages organic/content marketing (low CAC) in a niche with high retention. The 3:1 minimum benchmark is easily exceeded in all scenarios.

### 3.3 Revenue Projections

#### Monthly Recurring Revenue (MRR)

| Subscribers | Pro (70%) | Premium (30%) | MRR | ARR |
|-------------|-----------|---------------|-----|-----|
| **100** | 70 x R$ 49 = R$ 3,430 | 30 x R$ 97 = R$ 2,910 | **R$ 6,340** | R$ 76,080 |
| **250** | 175 x R$ 49 = R$ 8,575 | 75 x R$ 97 = R$ 7,275 | **R$ 15,850** | R$ 190,200 |
| **500** | 350 x R$ 49 = R$ 17,150 | 150 x R$ 97 = R$ 14,550 | **R$ 31,700** | R$ 380,400 |
| **1,000** | 700 x R$ 49 = R$ 34,300 | 300 x R$ 97 = R$ 29,100 | **R$ 63,400** | R$ 760,800 |

#### Course Revenue (Quarterly Estimate)

| Subscribers | Course Buyers (15%) | Avg Ticket | Quarterly Course Rev | Monthly Equiv |
|-------------|--------------------|-----------|--------------------|--------------|
| 100 | 15 | R$ 297 | R$ 4,455 | R$ 1,485 |
| 500 | 75 | R$ 297 | R$ 22,275 | R$ 7,425 |
| 1,000 | 150 | R$ 297 | R$ 44,550 | R$ 14,850 |

#### Total Revenue (Monthly)

| Subscribers | MRR (subs) | Course Rev (monthly equiv) | **Total Monthly** |
|-------------|-----------|--------------------------|-------------------|
| **100** | R$ 6,340 | R$ 1,485 | **R$ 7,825** |
| **250** | R$ 15,850 | R$ 3,713 | **R$ 19,563** |
| **500** | R$ 31,700 | R$ 7,425 | **R$ 39,125** |
| **1,000** | R$ 63,400 | R$ 14,850 | **R$ 78,250** |

---

## 4. Break-Even Analysis

### 4.1 Scenario Modeling

#### Cost vs Revenue at Each Scale

| Metric | 100 subs | 250 subs | 500 subs | 1,000 subs |
|--------|----------|----------|----------|------------|
| **Gross Revenue** | R$ 7,825 | R$ 19,563 | R$ 39,125 | R$ 78,250 |
| Payment Processing (~2.5%) | (R$ 196) | (R$ 489) | (R$ 978) | (R$ 1,956) |
| **Net Revenue** | **R$ 7,629** | **R$ 19,074** | **R$ 38,147** | **R$ 76,294** |
| Fixed Infra Costs | (R$ 532) | (R$ 750) | (R$ 1,045) | (R$ 2,325) |
| Content Creation (your time)* | (R$ 3,000) | (R$ 3,000) | (R$ 5,000) | (R$ 8,000) |
| Marketing/Ads | (R$ 0) | (R$ 1,000) | (R$ 2,500) | (R$ 5,000) |
| **Operating Profit** | **R$ 4,097** | **R$ 14,324** | **R$ 29,602** | **R$ 60,969** |
| **Profit Margin** | **52%** | **73%** | **76%** | **78%** |

*Content creation cost represents opportunity cost of your time for curation, forum moderation, live sessions, course creation.

### 4.2 Break-Even Points

| Scenario | Monthly Fixed Cost | Revenue per Subscriber | Break-Even Subs |
|----------|-------------------|----------------------|----------------|
| **MVP (bare minimum)** | R$ 532 | R$ 63.40 (blended) | **9 subscribers** |
| **MVP + content time** | R$ 3,532 | R$ 63.40 | **56 subscribers** |
| **Growth (with X API + marketing)** | R$ 5,795 | R$ 78.25 (incl. courses) | **74 subscribers** |
| **Full operation** | R$ 15,325 | R$ 78.25 | **196 subscribers** |

**Key Finding:** The infrastructure costs are extremely low relative to revenue. Break-even is achievable with fewer than 60 paying subscribers even when accounting for your time. The business becomes highly profitable at 250+ subscribers.

### 4.3 Time to Break-Even

| Growth Rate | Time to 56 subs | Time to 200 subs | Time to 500 subs |
|-------------|-----------------|-------------------|-------------------|
| **Slow** (10 net subs/mo) | 6 months | 20 months | 50 months |
| **Moderate** (25 net subs/mo) | 3 months | 8 months | 20 months |
| **Fast** (50 net subs/mo) | 2 months | 4 months | 10 months |

---

## 5. Recommendations

### 5.1 MVP Pricing Strategy

**Launch pricing (first 3 months):**

| Tier | Launch Price | Regular Price | Savings |
|------|-------------|---------------|---------|
| **Free** | R$ 0 | R$ 0 | — |
| **Founding Pro** | R$ 29/mo | R$ 49/mo | 41% off, locked forever |
| **Founding Premium** | R$ 67/mo | R$ 97/mo | 31% off, locked forever |

**Why "Founding Member" pricing works:**
1. Creates urgency with a real deadline
2. Rewards early adopters who tolerate rougher MVP
3. Generates social proof and testimonials
4. The lock-in reduces churn (people don't want to lose their deal)
5. You still profit at these prices (break-even at ~18 subs at R$ 29)

**Limit:** Cap founding membership at 100 Pro + 30 Premium, then switch to regular pricing.

### 5.2 Free vs Paid — Content Strategy

#### Give Free (lead generation)

| Content | Purpose | Frequency |
|---------|---------|-----------|
| Public forum (general AI discussion) | SEO, community building | Always on |
| Weekly curated news digest (top 5 items, PT-BR) | Showcase value of full curation | Weekly |
| 1 free mini-course ("Intro to AI for Brazilians") | Demonstrate course quality | Evergreen |
| Monthly open live session (30 min) | Build trust, show expertise | Monthly |
| Blog posts / newsletter | SEO, email list building | 2-3x/week |

#### Charge For (Pro/Premium)

| Content | Tier | Why It's Worth Paying |
|---------|------|----------------------|
| Full daily curated feed (EN↔PT, 20+ items) | Pro | Time savings, can't get elsewhere in PT-BR |
| All forum areas (advanced topics, job board, collabs) | Pro | Network effects, exclusive access |
| Monthly subscriber live Q&A (60 min) | Pro | Direct interaction value |
| Calendar with all events + reminders | Pro | Organization, FOMO reduction |
| Deep-dive weekly sessions (90 min, recorded) | Premium | High-value education |
| Priority course access + 30% discount | Premium | Direct cost savings |
| Private mastermind channel | Premium | Exclusivity, networking |
| 1-on-1 monthly office hours (15 min) | Premium | Personal attention |

### 5.3 Upsell Paths

```
Free User
  ├── Newsletter subscriber (email capture)
  │     ├── Free mini-course → Paid mini-course → Pro subscription
  │     └── Open live session → Pro subscription
  │
  ├── Forum lurker → Active poster → Pro subscription
  │
  └── Direct conversion (landing page / social proof)

Pro Subscriber (R$ 49/mo)
  ├── Individual course purchases (R$ 197-497)
  ├── Premium upgrade (deep-dives, mastermind) → R$ 97/mo
  └── Bootcamp enrollment (R$ 1,497-2,497)

Premium Subscriber (R$ 97/mo)
  ├── Premium courses with 30% discount
  ├── Bootcamps with priority enrollment
  └── Consulting/mentoring (future upsell)
```

### 5.4 Build vs Buy Decision

| Option | Monthly Cost | Pros | Cons |
|--------|-------------|------|------|
| **Build custom (recommended)** | R$ 382 infra | Full control, no tx fees to platform, unique differentiator, own your data | Dev time investment |
| **Skool** | $99 + 2.9% tx | Fast launch, built-in community features | No PT-BR localization, limited customization, platform risk |
| **Circle** | $89 + 2% tx | White-label, courses + community | Expensive at scale, 2% tx adds up |
| **Hotmart** | 9.9% + $0.50/sale | Zero upfront, Brazilian marketplace | High take rate, no community features |

**Verdict:** Building custom on Vercel + Supabase + Bunny Stream is the clear winner for sinapse.club because:
1. Infrastructure costs are 3-10x lower than platform fees at 200+ subscribers
2. Full control over UX, localization (PT-BR native), and features
3. No platform risk (Skool/Circle can change pricing anytime)
4. The curated news feed with AI translation is a unique differentiator that no platform supports natively

### 5.5 Critical Success Factors

1. **Content quality over quantity** — 5 excellent curated items/day beats 50 mediocre ones
2. **PT-BR first** — The gap in the market is quality AI content in Portuguese, not another English community
3. **Community before courses** — Build the forum and subscriber base first, validate course topics with the community, then create courses based on demand
4. **Annual plans aggressively** — Offer 25-30% discount for annual. Target 50%+ annual adoption to reduce churn and improve cash flow
5. **PIX as default payment** — 1.19% fee vs 3.99% credit card. Promote PIX heavily (saves ~R$ 2.80 per R$ 100 in fees)

### 5.6 Financial Summary

| Metric | Value |
|--------|-------|
| **MVP monthly cost** | R$ 532 (infra only) |
| **Break-even** | 9 subscribers (infra) / 56 subscribers (incl. your time) |
| **Target MRR at 6 months** | R$ 15,000-20,000 (250 subs) |
| **Target ARR at 12 months** | R$ 380,000-500,000 (500 subs) |
| **Blended LTV** | R$ 1,200 |
| **Target CAC** | R$ 30-80 (organic-heavy) |
| **LTV:CAC ratio** | 15:1 to 40:1 |
| **Gross margin** | 92-95% (digital, no COGS) |
| **Operating margin at scale** | 75-80% |

---

## Appendix A: Sources

### Platform Pricing
- [Skool Pricing](https://www.skool.com/pricing)
- [Skool Pricing Analysis 2026](https://www.courseplatformsreview.com/blog/skool-pricing/)
- [Circle Pricing](https://circle.so/pricing)
- [Circle Pricing 2026](https://www.schoolmaker.com/blog/circle-so-pricing)
- [Hotmart Pricing](https://hotmart.com/en/pricing)
- [Hotmart Fee Changes 2025](https://hotmart.com/en/blog/reajuste-taxa-parcelamento-2025)
- [Kajabi Pricing](https://www.kajabi.com/pricing)
- [Kajabi 2025 Updates](https://www.kajabi.com/updates/2025-pricing-updates)
- [Maven Pricing](https://maven.com/start)

### Infrastructure
- [Vercel Pricing](https://vercel.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)
- [Bunny Stream Pricing](https://bunny.net/pricing/stream/)
- [Mux Pricing](https://www.mux.com/pricing)

### Payment Processing
- [Stripe Brazil Pricing](https://stripe.com/en-br/pricing)
- [Stripe PIX Documentation](https://docs.stripe.com/payments/pix)
- [Stripe Boleto Documentation](https://docs.stripe.com/payments/boleto)

### Translation & AI
- [DeepL API Pricing](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Translation API Pricing Comparison 2026](https://www.buildmvpfast.com/api-costs/translation)

### Content Curation
- [X API Pricing Tiers 2025](https://twitterapi.io/blog/twitter-api-pricing-2025)
- [X API Pricing 2026](https://zernio.com/blog/twitter-api-pricing)
- [Reddit API Pricing](https://data365.co/blog/reddit-api-pricing)

### Market Benchmarks
- [Subscription Churn Benchmarks](https://recurly.com/research/churn-rate-benchmarks/)
- [CAC Benchmarks 2026](https://genesysgrowth.com/blog/customer-acquisition-cost-benchmarks-for-marketing-leaders)
- [Course Platform LTV/CAC](https://passion.io/blog/creator-course-metrics-ltv-cac-payback)

### PT-BR Market
- [Precos de IA no Brasil 2026](https://findskill.ai/pt/blog/precos-de-ia-em-2026-vale-pagar-r-100-mes-nessas-assinaturas/)
- [Rocketseat ONE Pricing](https://www.rocketseat.com.br/assinatura)
- [Alura Plans](https://www.alura.com.br/planos-cursos-online)

---

## Appendix B: Assumptions & Risks

### Key Assumptions
1. Brazilian CNPJ entity (no IOF on payments)
2. Content curation primarily via RSS + GPT-4o-mini (not X API for MVP)
3. Organic growth strategy (content marketing, SEO, social media)
4. You are the primary content creator for first 12 months
5. USD/BRL at R$ 5.50 (actual rate fluctuation impacts infra costs)

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| BRL depreciation (infra costs rise) | Medium | Medium | Price in BRL, absorb with margins |
| X API becomes unusable/too expensive | High | Low | RSS + community curation as primary |
| Churn higher than 8% | Medium | High | Invest in community engagement, annual plans |
| Low course attach rate (<10%) | Medium | Medium | Validate topics before building, use community polls |
| Competitor launches PT-BR AI community | Medium | Medium | First-mover advantage, unique curation quality |
| Stripe Brazil regulatory changes | Low | Medium | Secondary payment processor as backup |
