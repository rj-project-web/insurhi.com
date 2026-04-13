# Insurhi 7-Day Launch Plan

## Launch Objective
Ship a stable MVP of `insurhi.com` in 7 days, then iterate weekly.

## Scope for Week 1 (Must-Have Only)
- Core channels online:
  - Insurance categories (6 core categories)
  - Guides
  - Claims assistance
  - About/Contact/Privacy/Terms
- CMS editable content with publish workflow
- SEO baseline (metadata + sitemap + robots + key JSON-LD)
- Performance baseline near targets
- Production deployment on Vercel

## Out of Scope for Week 1 (Move to Week 2+)
- Advanced personalization
- Full multilingual support
- Complex quote engines
- Deep provider scoring algorithms
- Extensive A/B testing framework

---

## Day-by-Day Execution

## Day 1 - Foundation
- Agent A:
  - Project setup, UI baseline, route skeleton
  - Shared layout and nav/footer
- Agent B:
  - Payload + Postgres setup
  - Initial collections and admin localization
- PM:
  - Finalize naming conventions and PR template

Exit criteria:
- App boots locally
- CMS admin is reachable

## Day 2 - Data Contracts + First Templates
- Agent B:
  - Finalize core content schema and seed data
- Agent C:
  - Build first category template and guides template
- Agent D:
  - Create metadata helper and schema scaffolding

Exit criteria:
- Frontend renders real CMS content for at least one category and one article

## Day 3 - Complete Core Channels
- Agent C:
  - Finish insurance/guides/claims templates
  - Add legal pages
- Agent D:
  - Implement sitemap/robots and JSON-LD integration

Exit criteria:
- Required pages accessible via navigation
- Basic SEO routes available

## Day 4 - Performance Pass
- Agent E:
  - ISR strategy and caching setup
  - Image/font/JS optimizations
  - UA-based light HTML variation
- Agent C:
  - Fix rendering regressions from optimization changes

Exit criteria:
- Lighthouse major pages approach target
- No severe UX regressions

## Day 5 - QA + Content Fill
- Agent F:
  - Smoke tests desktop/mobile
  - Validate SEO and fallback behavior
- Agent B/C:
  - Fill launch-ready content for each core category

Exit criteria:
- No blocker bugs
- Launch content complete

## Day 6 - Staging Freeze + Pre-Launch
- All agents:
  - Bugfix only, no new features
- Agent F:
  - Final regression pass
- PM:
  - Go-live checklist review

Exit criteria:
- Release candidate approved

## Day 7 - Production Launch
- Agent F:
  - Deploy to production
  - Post-deploy verification
- Agent D/E:
  - Verify crawlability and performance baseline
- PM:
  - Publish launch report and week-2 backlog

Exit criteria:
- Site publicly accessible and stable

---

## Daily Ritual (Recommended)
- 10 min standup:
  - yesterday done
  - today plan
  - blockers
- 2 merge windows/day:
  - noon
  - end of day
- nightly health checks:
  - build status
  - preview status
  - top 5 page performance snapshot

---

## Risk Controls for 1-Week Delivery
- Scope guard: cut optional features early
- Contract-first integration: frontend/CMS agree fields first
- Freeze policy: day 6 no new capabilities
- Performance budget:
  - keep homepage and category pages lightweight
- SEO safety:
  - UA variant must not change core semantic content

---

## Week 2+ Iteration Backlog Seeds
- Add more comparison pages per category
- Expand claims case library
- Improve provider ranking methodology
- Add editorial workflow enhancements
- Introduce ad optimization and reporting

