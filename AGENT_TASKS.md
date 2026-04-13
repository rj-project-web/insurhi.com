# Insurhi Multi-Agent Task Instructions (1-Week Launch)

## Global Context (Share with every agent)
- Project: `insurhi.com`
- Audience: English users in North America, Europe, Australia
- Stack: Next.js 14+, Tailwind CSS, shadcn/ui, Payload CMS, PostgreSQL
- Deployment: Vercel (frontend), Payload service separately hosted
- Goal: MVP launch within 7 days, then iterate continuously
- Content verticals:
  - Auto insurance
  - Life insurance
  - Home insurance
  - Pet insurance
  - Medicare
  - Renters insurance
  - Explore more insurance resources
- Required channels:
  - Insurance category channels
  - Insurance guides
  - Claims assistance
  - About/Contact/Privacy/Terms/Sitemap
- Non-functional:
  - SEO-friendly
  - Unified URL for desktop/mobile
  - Server-side UA detection for light HTML variation
  - Static/ISR strategy for speed
  - AdSense placeholders reserved
- Performance target:
  - Lighthouse > 90
  - LCP < 2.5s
  - First screen load < 1.5s

---

## Coordination Rules
- Branch naming: `feat/<agent>-<scope>`
- PR size: keep each PR focused and reviewable
- Every PR must include:
  - What changed
  - Why it changed
  - How to test
  - Screenshots for UI changes
- Do not block on perfection for MVP; prioritize launch-critical paths
- Shared definition of done:
  - Works locally and in preview
  - No severe lint/build errors
  - Basic test evidence included
  - Docs updated

---

## Agent A - Foundation Engineer
### Mission
Bootstrap production-ready project foundation.

### Deliverables
- Next.js app initialized with App Router
- Tailwind + shadcn/ui installed and configured
- Base layout, header, footer, navigation
- Environment config template (`.env.example`)
- Shared utility setup (fetch layer, constants, helper functions)
- Basic CI checks (lint + build)

### Tasks
1. Initialize project and dependency baseline.
2. Create base app shell and responsive layout.
3. Add route groups for:
   - `/insurance`
   - `/guides`
   - `/claims`
   - legal pages
4. Prepare ad slot components as placeholders.
5. Add docs for run/build/deploy.

### Acceptance
- `npm run build` passes
- Key routes render without runtime errors
- Team can start feature work on top of baseline

---

## Agent B - CMS Engineer (Payload + Postgres)
### Mission
Build Chinese-friendly CMS backend and content model.

### Deliverables
- Payload project with PostgreSQL connection
- Chinese labels in admin panel where feasible
- Content collections:
  - categories
  - providers
  - products
  - articles
  - faqItems
  - claimsGuides
  - claimCases
  - pages
- Draft/published workflow
- Seed script for sample content

### Tasks
1. Define schema for each collection and relationships.
2. Add SEO fields to all publishable content.
3. Provide localized admin field labels (Chinese).
4. Create seed data for one category end-to-end.
5. Expose secure read endpoints for frontend consumption.

### Acceptance
- Admin can create and publish content successfully
- Frontend can query at least one full content chain

---

## Agent C - Frontend Channel Engineer
### Mission
Implement all user-facing channel templates for MVP launch.

### Deliverables
- Insurance hub and category pages
- Comparison, recommendation, FAQ, provider listing templates
- Guides list/detail templates
- Claims center list/detail templates
- Static pages: About/Contact/Privacy/Terms

### Tasks
1. Build reusable page sections for category and guide pages.
2. Bind templates to CMS data contracts.
3. Add empty/error states for missing data.
4. Ensure responsive behavior for mobile and desktop.
5. Keep design style close to reference, with brand differentiation.

### Acceptance
- All required channels reachable and render CMS-backed content
- No broken navigation paths

---

## Agent D - SEO Engineer
### Mission
Implement technical and on-page SEO baseline for launch.

### Deliverables
- Page-level metadata generation
- Canonical handling
- `sitemap.xml` and `robots.txt`
- JSON-LD support:
  - Organization
  - Breadcrumb
  - FAQPage
  - HowTo
  - Article
- Internal linking widgets

### Tasks
1. Create reusable SEO helpers and schema generators.
2. Add metadata to core templates.
3. Implement sitemap and robots route handlers.
4. Validate rich results compatibility.
5. Provide SEO QA checklist.

### Acceptance
- Core pages expose valid metadata and schema
- Sitemap and robots are accessible in preview

---

## Agent E - Performance Engineer
### Mission
Hit launch performance goals through rendering and asset strategy.

### Deliverables
- ISR/static strategy by route type
- Server-side UA detection and light HTML variation
- Image optimization policy
- Lazy loading for non-critical sections
- Third-party script loading strategy (AdSense ready)

### Tasks
1. Set route revalidation policies.
2. Implement UA branch that does not alter core content semantics.
3. Reduce JS cost for above-the-fold sections.
4. Add font/image optimizations.
5. Run Lighthouse and provide before/after report.

### Acceptance
- Home and core templates score >90 in Lighthouse (target)
- No SEO-cloaking-like behavior introduced

---

## Agent F - QA & Release Engineer
### Mission
Ensure MVP quality and drive deployment to production.

### Deliverables
- Smoke test plan and test results
- Critical path test coverage:
  - navigation
  - content rendering
  - contact page
  - SEO routes
- Production deploy checklist
- Vercel deployment and post-deploy verification

### Tasks
1. Write a lightweight launch test checklist.
2. Validate desktop/mobile behavior on key pages.
3. Verify fallback behavior for missing CMS content.
4. Confirm environment variables and build settings.
5. Run final go-live checklist and sign-off.

### Acceptance
- Production site accessible
- No blocker/severity-1 defects
- Rollback procedure documented

---

## PM Orchestrator Prompt (Use for central agent)
You are the delivery orchestrator for insurhi.com MVP launch in 7 days.
Your job:
1. Keep all agents aligned to launch-critical scope.
2. Track dependencies and unblock cross-agent issues quickly.
3. Enforce "small PR, fast merge, verified preview" workflow.
4. Escalate only blocker risks:
   - Build/deploy failures
   - Data contract mismatches
   - SEO-critical regressions
   - Severe performance regressions
5. Produce twice-daily status:
   - Completed
   - In progress
   - Blocked
   - Next 24h plan

