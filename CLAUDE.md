# nenenesor.com — Project Specification

You are building **nenenesor.com**, a Turkish content platform for mothers and babies. The brand bridges traditional grandmother wisdom ("nene") with modern expert validation. Tagline: **"Önce nene'ne sor."**

Read this file at the start of every session. Treat it as the source of truth for scope, stack, and conventions.

---

## 1. Business Context

- **Audience:** Turkish women, 25–40, mothers and expectant mothers.
- **Editorial premise:** every traditional practice is filtered through an expert (dietitian / midwife / pediatrician). Tone is *wise grandmother* — warm, knowing, slightly playful, never patronizing, never fear-mongering.
- **MVP revenue:** affiliate links (Hepsiburada, Trendyol, ebebek, Amazon TR) + newsletter list building. **No commerce, no cart, no checkout.**
- **Expert roles:** `diyetisyen` (dietitian), `ebe` (midwife), `doktor` (pediatrician / OB-GYN).

---

## 2. Tech Stack — use exactly these

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, TypeScript strict) |
| CMS | **Payload CMS 3** (embedded in Next.js via `@payloadcms/next`) |
| DB | **PostgreSQL** via `@payloadcms/db-postgres` (Supabase or Neon in prod) |
| Styling | **Tailwind CSS 4** + **shadcn/ui** |
| Forms | **React Hook Form** + **Zod** |
| Email (transactional) | **Resend** |
| Captcha | **Cloudflare Turnstile** |
| Storage | **Cloudflare R2** via `@payloadcms/storage-s3` |
| Icons | **lucide-react** |
| Dates | **date-fns** with `tr` locale |
| Sitemap | **next-sitemap** |
| Newsletter | **MailerLite** API (handles weekly sends; we just capture emails) |
| Analytics | **Plausible** (script in layout) |
| Package manager | **pnpm** |

---

## 3. Folder Structure

```
nenenesor/
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx          # Header/Footer/fonts
│   │   │   ├── page.tsx            # Anasayfa
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── kategori/[slug]/page.tsx
│   │   │   ├── sorular/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/page.tsx
│   │   │   │   └── sor/page.tsx
│   │   │   ├── urunler/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── uzmanlar/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── hakkimizda/page.tsx
│   │   │   └── bulten/page.tsx
│   │   ├── (payload)/              # auto-generated admin
│   │   └── api/
│   │       ├── newsletter/route.ts
│   │       └── soru/route.ts
│   ├── collections/                # Payload collections
│   │   ├── Users.ts
│   │   ├── Experts.ts
│   │   ├── Categories.ts
│   │   ├── Posts.ts
│   │   ├── Questions.ts
│   │   ├── Products.ts
│   │   └── Media.ts
│   ├── components/
│   │   ├── ui/                     # shadcn primitives
│   │   ├── NeneNotu.tsx
│   │   ├── ExpertBadge.tsx
│   │   ├── ExpertCard.tsx
│   │   ├── PostCard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── QuestionForm.tsx
│   │   ├── AffiliateButton.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── payload.ts
│   │   ├── resend.ts
│   │   ├── mailerlite.ts
│   │   ├── turnstile.ts
│   │   ├── seo.ts                  # JSON-LD builders
│   │   ├── slug.ts
│   │   └── utils.ts
│   └── payload.config.ts
├── public/
│   ├── og-default.png              # 1200×630
│   └── fonts/                      # if self-hosting
├── .env.example
├── tailwind.config.ts
├── next.config.ts
├── next-sitemap.config.js
├── package.json
└── CLAUDE.md
```

---

## 4. Payload Collections

### `Users`
- Roles: `admin`, `editor`, `expert`
- Fields: `email`, `password`, `role` (select), `name`, `linkedExpert` (relationship to `Experts`, optional)
- Access: admin only

### `Experts`
- `name` (text, required)
- `slug` (text, unique, auto from name)
- `expertise` (select: `diyetisyen` | `ebe` | `doktor`)
- `title` (text — e.g. "Pediatri Uzmanı")
- `photo` (upload → Media)
- `bio` (richText)
- `credentials` (richText — diplomas, certifications)
- `socialLinks` (array of `{platform, url}`)
- Access: read public, write admin/editor

### `Categories`
- `name` (text), `slug` (text, unique), `description` (textarea), `parent` (self-relationship, optional)
- **Seed on first run:** Hamilelik, 0-6 Ay, 6-12 Ay, 1-3 Yaş, Anne Sağlığı, Beslenme

### `Posts` (blog)
- `title` (text, required)
- `slug` (text, unique, auto)
- `excerpt` (textarea, max 200 chars)
- `coverImage` (upload → Media)
- `content` (richText — Lexical with default blocks)
- `category` (relationship → Categories)
- `tags` (array of text)
- `author` (relationship → Experts, required)
- `neneNote` (richText, optional) — short traditional perspective
- `status` (select: `draft`, `published`)
- `publishedAt` (date)
- `seo` (group: `metaTitle`, `metaDescription`, `ogImage`)
- Hook on publish: `revalidatePath` for `/blog`, `/blog/[slug]`, `/blog/kategori/[slug]`

### `Questions` (Q&A)
- `questionTitle` (text, auto-derive from first sentence or manual)
- `slug` (text, unique)
- `questionBody` (textarea, 50–1000 chars)
- `askerName` (text, defaults to "İsimsiz Anne")
- `askerEmail` (email — **never displayed publicly**, used for notification)
- `category` (relationship → Categories)
- `assignedExpert` (relationship → Experts)
- `answer` (richText)
- `status` (select: `pending`, `assigned`, `answered`, `published`, `rejected`)
- `publishedAt` (date)
- `seo` (group)
- **Access:**
  - Create: public via `/api/soru` (Turnstile-verified)
  - Read: only `published` publicly; admin/expert see all
  - Update: admin/editor full; `expert` role can only update `answer` if `assignedExpert.id === user.linkedExpert.id`
- Hook on `status` → `published`: send notification email via Resend to `askerEmail`

### `Products` (curated guides — affiliate, no commerce)
- `title` (text)
- `slug` (text, unique)
- `intro` (richText)
- `items` (array): each has
  - `name` (text)
  - `image` (upload → Media)
  - `reason` (textarea — "neden bu" paragraph)
  - `expertNote` (textarea, optional)
  - `affiliateLinks` (array of `{retailer: select(hepsiburada|trendyol|ebebek|amazon), url: text}`)
- `category` (relationship → Categories)
- `author` (relationship → Experts)
- `status`, `publishedAt`, `seo`

### `Media`
- Standard Payload media collection
- Storage adapter: Cloudflare R2 via `@payloadcms/storage-s3`
- Image sizes generated: `thumbnail` (400px), `card` (800px), `hero` (1600px)
- Format: webp where supported

---

## 5. Public Routes & Page Specs

### `/` — Anasayfa
Sections top-to-bottom:
1. Hero: tagline "Önce nene'ne sor.", one-sentence mission, two CTAs (Bültene Katıl / Soru Sor)
2. Latest 6 blog posts grid (with category badges)
3. Recently answered questions strip (4 cards)
4. One featured product guide
5. Expert team strip (photos, names, expertise badges)
6. Newsletter signup block

### `/blog`
- Filter chips by category
- Paginated, 10 per page
- Card: cover image, category badge, title, excerpt, expert byline (photo + name), date

### `/blog/[slug]`
- Cover image, title, expert byline, date, category
- Lexical content rendered to HTML
- `<NeneNotu>` callout inline where set
- Expert bio card at end with link to profile
- 3 related posts (same category)
- Inline newsletter CTA mid-article + at end
- JSON-LD: `Article` + `Person` (author)

### `/sorular`
- Newest answered questions
- Filter: category + expert type
- Card: truncated question, expert who answered (with badge), category, date
- Sticky "Soru Sor" button (mobile bottom bar)

### `/sorular/[slug]`
- Question text + `askerName` + date
- Expert answer (rich)
- Expert profile card
- 3 related questions
- JSON-LD: `QAPage`

### `/sorular/sor`
Form fields:
- Name (optional, placeholder "İsimsiz Anne")
- Email (required, never shown publicly — explicit disclaimer)
- Category (select)
- Question (textarea, 50–1000 chars, counter)
- Cloudflare Turnstile widget
- KVKK consent checkbox (required)

Flow: POST `/api/soru` → server verifies Turnstile token → creates `pending` Question → success state:
> "Sorun ulaştı. Uzmanımız cevap yazınca mail atarız — söz."

### `/urunler` & `/urunler/[slug]`
- Listing + detail
- Detail: intro, then each item card with image, name, "neden bu" paragraph, optional expert note, affiliate buttons (clearly marked, `rel="sponsored noopener"`, opens new tab)
- JSON-LD: `ItemList`
- **Disclosure:** small banner on every product page: "Bu sayfadaki ürün bağlantılarından alışveriş yaparsan, küçük bir komisyon kazanırız. Senin için fiyatı değişmez."

### `/uzmanlar` & `/uzmanlar/[slug]`
- Team grid (photos, names, expertise tags)
- Profile: bio, credentials, recent posts by this expert, recent answered questions

### `/bulten`
- Hero, value prop ("Haftada bir, Nene'den Mektup"), signup form, sample issue preview (static for now)

### `/hakkimizda`
- Manifesto-style page explaining the editorial premise (Nene + bilim), how experts are vetted, KVKK and editorial independence

---

## 6. Design System

### Color tokens (Tailwind config)
```ts
'nene-cream': '#FBF7F0',   // page background
'nene-ink':   '#2A2520',   // primary text
'nene-rust':  '#C75D3F',   // primary accent, links/buttons
'nene-sage':  '#7A8F6F',   // secondary, expert badges (ebe/diyetisyen)
'nene-gold':  '#D4A24C',   // highlights, NeneNotu border
'nene-mist':  '#E8E2D5',   // muted backgrounds, borders
```
Palette mood: earthy, warm, slightly nostalgic but modern — *küçük bir Anadolu kitabevi*. **Avoid** baby pink/blue, pastel, cartoonish illustration.

### Typography
- **Fraunces** (headings + NeneNotu) — serif, optical sizing, warm and slightly nostalgic
- **Inter** (body, UI) — clean, legible
- NeneNotu uses Fraunces italic for the hand-written feel
- Load via `next/font/google`, with `display: swap`

### Microcopy library (use these voices verbatim where they fit)
- Newsletter CTA: *"Nene'den haftalık mektup. Spam yok, sıkıcılık yok."*
- Empty Q&A state: *"Henüz cevaplanmış soru yok. İlk soruyu sen sor."*
- Submission success: *"Sorun ulaştı. Cevap gelince mail atarız — söz."*
- 404: *"Bu sayfa nene'nin sandığında bile yok. Anasayfaya dönelim mi?"*
- Affiliate disclosure: *"Bu sayfadaki bağlantılardan alışveriş yaparsan küçük bir komisyon kazanırız. Senin için fiyatı değişmez."*
- KVKK consent: *"Mailini sadece sana cevap göndermek için kullanırız. Üçüncü kişilerle paylaşmayız."*

### Components to build (priority order)
1. `<NeneNotu>` — bordered callout, gold left border, Fraunces italic body, "— Nene'den" signature in small caps
2. `<ExpertBadge>` — pill: diyetisyen=sage, ebe=rust, doktor=gold
3. `<AffiliateButton>` — clearly marked, `rel="sponsored noopener"`, `target="_blank"`, retailer logo + price-not-shown
4. `<NewsletterForm>` — email-only, single field, inline success/error
5. `<QuestionForm>` — full submission form with validation + Turnstile

---

## 7. SEO Requirements (non-negotiable)

- Every page: dynamic `<title>`, `<meta description>`, OG image (1200×630), Twitter card
- JSON-LD on every content page:
  - Blog post → `Article` + `Person`
  - Q&A → `QAPage`
  - Product guide → `ItemList`
  - Expert profile → `Person`
- `sitemap.xml` via next-sitemap, includes all published Posts, Questions, Products, Experts
- `robots.txt`: allow all, disallow `/admin`, `/api`
- Canonical URLs on every page
- Internal linking rule: every blog post links to 2–3 related Q&As + 1 product guide where relevant (use related-content component)
- Core Web Vitals: target green across the board (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- All images via `next/image`, `loading="lazy"` except hero
- Use ISR with 60s revalidate on dynamic content; on-demand revalidate via Payload hooks on publish

---

## 8. Email (Resend)

### Template 1: Q&A answered notification
- Trigger: Payload hook when Question.status → `published`
- To: `askerEmail`
- From: `nene@nenenesor.com`
- Subject: *"Sorduğun soruya Nene'nin uzmanından cevap geldi"*
- Body: warm greeting using `askerName`, one-line summary, CTA button to public Q&A URL, soft newsletter CTA in footer

### Template 2: Newsletter welcome
- Trigger: successful POST to `/api/newsletter`
- Subject: *"Hoş geldin — Nene'den ilk mektup"*

Weekly newsletter sends happen in MailerLite manually — not in-app.

---

## 9. Environment Variables (`.env.example`)

```
DATABASE_URI=postgres://...
PAYLOAD_SECRET=...

# Storage
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
S3_REGION=auto
S3_ENDPOINT=https://...r2.cloudflarestorage.com

# Email
RESEND_API_KEY=...
RESEND_FROM=nene@nenenesor.com

# Newsletter
MAILERLITE_API_KEY=...
MAILERLITE_GROUP_ID=...

# Captcha
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Site
NEXT_PUBLIC_SITE_URL=https://nenenesor.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=nenenesor.com
```

---

## 10. Strict Scope — DO NOT BUILD

- ❌ User accounts for mothers (only experts/admins log in)
- ❌ Shopping cart, checkout, payments, inventory
- ❌ Forum, comments, threaded discussions
- ❌ Mobile app
- ❌ Live chat with experts, video consultation
- ❌ Multi-language (Turkish only in MVP)
- ❌ Wishlist, favorites, "save for later"
- ❌ Push notifications, web push
- ❌ Social login
- ❌ Gamification, badges, points

If user asks for anything in this list, **push back** and confirm before adding scope.

---

## 11. Implementation Phases

### Phase 1 — Foundation (Day 1–3)
- `pnpm create payload-app` with Next.js template + Postgres adapter
- Install Tailwind 4, shadcn/ui, fonts (Fraunces + Inter)
- Define color tokens in `tailwind.config.ts`
- Build collections: `Users`, `Experts`, `Categories`, `Media`
- Seed 6 categories on first boot
- Build `<Header>`, `<Footer>` with final brand styling
- Confirm `pnpm build` is clean

### Phase 2 — Blog (Day 4–6)
- `Posts` collection with Lexical
- `<NeneNotu>` component (priority — defines brand feel)
- `/blog`, `/blog/[slug]`, `/blog/kategori/[slug]`
- Article JSON-LD
- Seed 3 example posts (one per expert type) for visual QA

### Phase 3 — Q&A (Day 7–9)
- `Questions` collection with full status workflow
- `/sorular`, `/sorular/[slug]`, `/sorular/sor`
- `/api/soru` endpoint with Turnstile server-side verification
- Resend integration + notification template
- QAPage JSON-LD
- Test full flow: submit → moderate → assign → answer → publish → email received

### Phase 4 — Products & Experts (Day 10–12)
- `Products` collection
- `/urunler`, `/urunler/[slug]`
- `<AffiliateButton>` with correct rel attributes
- `/uzmanlar`, `/uzmanlar/[slug]`
- ItemList + Person JSON-LD
- Affiliate disclosure banner component

### Phase 5 — Polish & Launch (Day 13–14)
- Final anasayfa composition with real content
- `next-sitemap` config, `robots.txt`
- OG image generation (use Next.js OG image API for dynamic per-post OG)
- Newsletter signup → MailerLite API integration
- Plausible script
- 404 + error pages with brand voice
- Performance pass — Lighthouse all green
- Deploy: DigitalOcean App Platform, Postgres on Supabase, R2 storage
- DNS, SSL, smoke tests

---

## 12. Working Style

- At the start of each phase, **list the files you will create/modify**, then proceed.
- After each phase, run `pnpm build` and `pnpm lint` — do not move on with red.
- Default to **Server Components**; use Client Components only for forms, interactive widgets, and components needing browser APIs.
- Keep components under ~200 lines; split when bigger.
- Code comments in English; all user-facing copy in Turkish (lifted from §6 microcopy library where possible).
- Commit conventions: `feat:`, `fix:`, `chore:`, `refactor:` — small, focused commits.
- When uncertain about brand voice for new copy, match the voice of existing microcopy in §6 rather than inventing a new tone.

---

## 13. Definition of Done (MVP)

- Site is deployed at `nenenesor.com` with SSL
- 6 categories seeded, 3 experts seeded, 5+ blog posts, 5+ answered questions, 2+ product guides published
- A mother can submit a question, get a moderation receipt, and receive an email when the answer is published
- A user can subscribe to the newsletter and receive a welcome email
- All four JSON-LD types validate in Google's Rich Results Test
- Lighthouse: Performance ≥ 90, SEO = 100, Accessibility ≥ 95
- Mobile and desktop look intentional and on-brand, not "default tailwind"

---

**Start with Phase 1. Confirm the exact package versions you will install before scaffolding, and ask before deviating from this spec.**
