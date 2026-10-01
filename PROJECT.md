# AEC Network: project record

This file is the project's manager. It holds what the project is, why it exists, every decision that shaped it, and a dated log of all work done. Update the log at the bottom whenever something is built, changed, decided, or deployed. The README covers how to run the code; this file covers the project itself.

Last updated: 1 October 2026.

---

## 1. What this project is

**AEC Network** is a professional network for the architecture, engineering, and construction (AEC) industry. It is built around the way AEC work actually happens: people work at firms, firms work on projects, people contribute to projects in specific roles, and suppliers' products end up in the building. The core of the product is the graph connecting People, Companies, and Projects, with the project as the shared piece of evidence that ties everyone together.

The nearest shorthand is "LinkedIn for AEC", but the point is not to recreate LinkedIn with construction job titles. On a general professional network, a person's history is a list of employers and self-described skills. Here, a person's history is the list of projects they actually worked on, the role they held on each, and who they built it with, which can be confirmed by the other people on that project.

### Who it is for

- **Individual practitioners**: architects, structural, civil, and MEP engineers, contractors, project managers, superintendents, estimators, designers, specialty trades, and supplier representatives. They publish work, keep a portable record of what they built, and get found through evidence rather than claims.
- **Firms**: architecture and engineering firms, general and specialty contractors, suppliers and manufacturers. They keep living project pages and team histories, and are discovered by what they have delivered.
- **The industry as a whole**: a place to ask technical questions, find referrals, find subcontractors and consultants, hire, and look for work.

### The idea in one line

Turn the temporary teams that form around every building into a durable, verified professional graph, and make that graph useful between projects so people come back when they are not hiring.

### Where the idea came from

The project belongs to Louise Hung, a licensed California architect with more than twenty years in healthcare and health science projects. It started as a notebook sketch titled "platform structure" (reproduced in the demo design document, Appendix A) with four groups: firms and offices (contractors by size, architects, engineers), materials (announcements, profile and contact), individuals (personal profiles with an endorsement system), and need/help (open discussion per system, hiring and seeking work). Karl Josefsson (SF Bay Development) is building the product with Louise.

---

## 2. The two source documents

Both live in `docs/`.

### Business proposal (`docs/louise_business_ides-lh.docx`, 5 September 2026)

A 25-section proposal prepared for cofounder and investor review. Its key arguments:

- **The atomic unit is a verified project record.** The platform's data asset is a provenance-aware graph of people, firms, projects, roles, contributions, credentials, and products. Every role claim carries a status (self-claimed, collaborator-confirmed, firm-confirmed, credential-verified, public-record sourced, disputed).
- **Content before transactions.** Professionals should return to learn and publish work before the product tries to be a marketplace. The feed is a distribution surface for structured project evidence, not the product itself.
- **Narrow wedge, dense cluster.** Start with mid-market architecture, structural engineering, and general contracting teams on multifamily, mixed-use, and institutional work in one or two metros. Recruit complete project teams, not isolated users.
- **Monetize workflow, not credibility.** Free for individuals. First paid product is a Firm Workspace (project pages, contributor approval, exports, analytics). Sourcing, recruiting, sponsorship, and data come later. Payment must never change a truth label.
- **Explicitly not** a LinkedIn clone, a consumer home-services marketplace, a project-management system, an uncurated image portfolio, a universal reputation score, or a pay-to-play directory.
- **Validation before platform.** A 90-day program (interviews, prototype, 50 to 100 concierge-seeded projects, editorial cohort, paid-pilot test), then a 12-month roadmap with decision gates and an indicative seed budget of $1.2 to $2.0 million.
- **Main danger:** an attractive but empty feed of low-context photos and marketing posts. The design response is to make structured project contribution and peer confirmation the product.

The document also contains the author's open notes, which are still live questions: starting revenue with a small setup fee for material suppliers' product presentations; adding a discussion panel for technical issues, creative solutions, and AI; whether the concierge phase of months 2 to 4 is too short; whether a design-partner program is realistic versus "individual discussions platform first"; and whether to start with individuals or firms.

### Demo product design document (`docs/AEC_Network_Demo_Design_Document.docx`, September 2026)

A 17-section spec written for a coding agent, with the full build prompt extracted to `docs/AEC_Network_Claude_Code_Master_Prompt.md`. It defines the demo that now exists:

- Navigation: Feed (default), People, Companies, Projects, Needs & Help, My Profile, plus global search.
- Three primary entities (People, Companies, Projects) with participation modeled as relationship records, never free text.
- Company size is an attribute (employee count with a derived band), not a company type. Suppliers are companies with extra product data.
- Needs & Help has two tabs: Open Discussion / Need Help, and Hiring / Seeking Work.
- Stack: Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Lucide, with a seeded local data layer first and a clean path to Supabase.
- Out of scope: messaging, payments, procurement, bidding, applicant tracking, recommendations, billing, SSO, notifications, moderation tooling.

### How the two relate

The proposal is strategic and cautious; its differentiator is verified project credit. The demo spec is a pitch demo and deliberately drops verification to keep scope small. The build added a lightweight bridge between them (see decision 2 below) so the demo visibly carries the proposal's thesis.

---

## 3. Current state

| | |
|---|---|
| Status | Demo v1 complete and deployed |
| Live URL | https://aec-network.vercel.app |
| Repository | https://github.com/archlouise/platform-publishing (public, `main`) |
| Hosting | Vercel project `aec-network` in the `louise-hung` team; deployed manually from the local folder, no GitHub auto-deploy yet |
| Signed-in demo user | Louise Hung (see decision 7) |
| Data | Fictional, interconnected SF Bay Area seed: 16 people, 9 companies, 10 projects, 51 company roles, 70 individual roles, 24 posts, 10 needs, 7 jobs, 32 skills, 7 supplier products |
| Backend | None. Seeded local repository; demo interactions persist in the browser's localStorage |

Everything in the design document's definition of done is met. See the README for routes, architecture, data model, and the Supabase migration path.

---

## 4. Decisions

Numbered so later entries in the log can refer to them.

1. **Build the demo at the repo root, move the documents into `docs/`.** Decided 1 October 2026 with Karl. Keeps `pnpm dev` at the top level.
2. **Add a lightweight verification label to project roles.** Every `project_companies` and `project_people` record carries `status: "self_claimed" | "confirmed"`, shown as a small badge wherever a role appears. No claim or confirmation workflow; the status is seeded. Decided 1 October 2026 so the demo shows the proposal's core thesis. Most seeded roles are confirmed; a handful on in-design projects are self-claimed so the distinction is visible.
3. **Seed data is fictional and set in the SF Bay Area.** Firms, people, and projects are invented (Meridian Atelier, Halvorsen Structural, Harbor View Lofts, and so on) in San Francisco, Oakland, Berkeley, Alameda, Emeryville, Richmond, Hayward, Fremont, and San Jose. Matches the proposal's one-or-two-metro wedge and Karl's business base. Decided 1 October 2026.
4. **Git workflow: commit and push continuously; one PR per complete feature, squash-merged.** Karl's instruction, 1 October 2026. Branches are deleted after merge.
5. **Canonical feed route is `/`.** `/feed` redirects to it.
6. **Demo interactions live in the browser.** Likes, saves, comments, endorsements, and user-created posts and needs are stored in localStorage under `aec-network-demo-v1`, layered over the read-only seed. Images are generated inline SVGs (avatars, logos, covers, and elevation-style project drawings) so nothing depends on a remote host.
7. **The signed-in demo user is Louise Hung, using her public LinkedIn details.** Karl's request, 1 October 2026. Headline, summary, pre-2022 experience, Washington University in St. Louis M.Arch, California architect license, LEED AP BD+C, and skills come from her public profile. In the demo she is placed at the fictional Meridian Atelier with project-management roles on its fictional projects. Her real current employer is deliberately not shown so that no real firm is tied to invented projects. This is the only real person in the dataset. Open: Karl may prefer to show her real current role and detach her from the fictional firm.
8. **Deploy on Vercel from the local folder under Karl's account.** 1 October 2026. GitHub auto-deploys would require the Vercel GitHub app installed on Louise's GitHub account (archlouise), which only she can do.

---

## 5. Work log

Newest at the bottom. Each entry: date, what was done, where it landed, how it was verified.

### 2026-09-05
- Louise created the GitHub repository `archlouise/platform-publishing` with a two-line README describing it as a public presentation.

### 2026-09-30
- Louise uploaded the business proposal (`louise_business_ides-lh.docx`).

### 2026-10-01, morning
- Louise added the demo design document and the extracted master build prompt.
- Karl asked for the repository and documents to be reviewed and understood, then for the demo to be built. Four decisions were confirmed before starting (decisions 1 to 4).

### 2026-10-01, build (all merged to `main` the same day)
| PR | Merged (local time) | What |
|---|---|---|
| #1 | 09:15 | Scaffold: Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui on Base UI, Lucide, Archivo typeface, design tokens, header with desktop nav, mobile sheet nav and search box, placeholder pages for every route. Documents moved to `docs/`. |
| #2 | 09:26 | Domain types for every future table plus resolved view models; the full fictional seed dataset; `Repository` interface and local implementation that resolves relationships in one place; deterministic SVG placeholder generator; `pnpm validate-seed` integrity script (zero errors). |
| #3 | 09:30 | Feed: composer with post type and project link, post cards with entity links and generated project covers, Like / Comment / Save, inline comment threads, right rail of people and firms from the viewer's projects and active needs. Client store persisted to localStorage. Fixed a hydration bug where stored state was not read on first render. |
| #4 | 09:33 | People directory with profession, location, skill, and company filters in the URL; profile page with about, projects with role and status badge, experience, endorsable skills, education and licenses, posts. `/profile` redirects to the demo user. |
| #5 | 09:35 | Companies directory with type, location, size band, and specialty filters; company page with projects by role, people, open roles, posts, and needs; supplier variant with product categories and product cards. |
| #6 | 09:37 | Projects directory with sector, city, status, and year filters; project page with hero, key facts, systems, team grouped by role with each company's contributors and status badges, and linked updates. |
| #7 | 09:39 | Needs & Help with Open discussion and Hiring and seeking work tabs, cards, detail page, and a working composer for questions and openings. Locally created needs resolve on their detail page through the client store. |
| #8 | 09:41 | Global search at `/search?q=` with results grouped into people, companies, and projects; empty and no-result states; fixed a duplicated input id between the desktop and mobile search boxes. |
| #9 | 09:45 | Polish: custom 404, loading skeletons, mobile header stacking and two-column filters on phones, full README (setup, routes, architecture, data model, decisions, Supabase path). |

Verification for the build: lint, typecheck, seed validation, and production build passed on every PR; in Chrome, liked, saved, commented, created a post, endorsed a skill, posted an opening, searched "timber", and walked Feed to project to company to person; every route checked at 390px width with zero horizontal overflow; interactions survived a reload.

### 2026-10-01, afternoon
- **PR #10, 10:09.** Replaced the fictional demo user with Louise Hung's public profile (decision 7). Added Architectural design and Design research to the skills catalogue. README updated.
- **Vercel deployment, about 11:20.** Logged the Vercel CLI into Karl's account by device code, linked the folder to a new project `aec-network`, deployed to production. Verified: deployment state Ready, https://aec-network.vercel.app returns 200 with no login wall and renders the feed with Louise as the signed-in user in a fresh browser. Link sent to Louise.
- **This file created** and a rule added to `CLAUDE.md` to keep it updated.

---

## 6. Open items and next steps

Product and data
- Decide whether Louise's profile should show her real current employer and be detached from the fictional firm (decision 7).
- Decide whether to replace the fictional Meridian Atelier with a real or Louise-owned firm for pitching, and whether any real projects should appear.
- The proposal's open notes (section 2) are still unanswered: supplier setup-fee revenue, a discussion panel for technical issues and AI, concierge-phase length, design-partner program versus individual discussions, individuals-first versus firms-first.

Engineering
- Connect Supabase for multi-user persistence and auth; the `Repository` interface and view types in `src/lib` are the seam. Keep the seeded local mode for presentations.
- Install the Vercel GitHub app on archlouise/platform-publishing so every merge to `main` deploys itself. Until then, redeploy manually with `pnpm dlx vercel --prod --yes` from this folder.
- Known quirk: the Next dev server can serve a stale Tailwind CSS chunk after new utility classes are added in new files; restarting `pnpm dev` fixes it. Production builds are correct.

Out of scope for the demo, per the design document: messaging, payments, procurement, bidding, applicant tracking, recommendation algorithms, billing, SSO, notifications, moderation tooling.

---

## 7. How to keep this file current

- After every merged PR, deployment, or decision, add a dated entry to section 5 and, if it changes anything above, update sections 3, 4, or 6.
- Decisions get a number in section 4 so log entries can refer to them.
- Keep the README for how to run the code; keep this file for what the project is and what has happened to it.
