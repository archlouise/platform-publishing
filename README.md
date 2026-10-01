# AEC Network

A demo professional network for the architecture, engineering, and construction industry. People, companies, and projects are linked through explicit relationship records, so a feed post leads to a project, the project to the firms and people who built it, and each of those back to their other work.

Everything runs from a seeded, fictional San Francisco Bay Area dataset. No backend or credentials are needed.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The app lands on the Feed, signed in as the demo user, Louise Hung, shown as Project Manager at the fictional Meridian Atelier.

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` then `pnpm start` | Production build and serve |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Generate route types and run `tsc` |
| `pnpm validate-seed` | Check every seeded relationship resolves |

## What the demo does

- **Feed** (`/`): composer plus 24 seeded posts across six types (milestone, project showcase, announcement, insight, hiring, need). Like, Comment, and Save work. New posts appear at the top immediately.
- **People** (`/people`, `/people/[slug]`): directory with profession, location, skill, and company filters. Profiles show about, projects with role and claim status, experience, skills with endorsement counts, education and licenses, and posts.
- **Companies** (`/companies`, `/companies/[slug]`): directory with type, location, size, and specialty filters. Company pages show projects by role, people, open roles, posts, and current needs. Suppliers additionally show product categories and product cards.
- **Projects** (`/projects`, `/projects/[slug]`): directory with sector, city, status, and year filters. Project pages show key facts, systems, the team grouped by role with each company's contributors, and linked updates.
- **Needs & Help** (`/needs`, `/needs/[id]`): two tabs, Open discussion and Hiring and seeking work. Posting a question or an opening works.
- **Search** (`/search?q=`): grouped results across people, companies, and projects from the header search box.
- **My Profile** (`/profile`): redirects to the demo user.

Demo interactions (likes, saves, comments, endorsements, created posts and needs) persist in `localStorage` under the key `aec-network-demo-v1`. Clear site data to reset.

## Architecture

```
src/
├─ app/                      App Router pages; server components that call the repository
├─ components/
│  ├─ layout/                AppHeader, NavLinks, MobileNav, SearchBox, RightRail, PageContainer, Skeletons
│  ├─ feed/                  PostComposer, FeedPostCard, FeedList, PostList
│  ├─ entities/              PersonCard, CompanyCard, ProjectCard, ProjectTeamSection, SkillChip,
│  │                         RoleStatusBadge, PostTypeBadge, EntityLink, Avatars, Section, EmptyState
│  ├─ needs/                 NeedsBoard, NeedCard, NeedComposer, LocalNeedDetail
│  ├─ search/                FilterBar, SearchResults
│  └─ ui/                    shadcn/ui primitives (Base UI)
└─ lib/
   ├─ types.ts               One interface per table plus resolved view models
   ├─ labels.ts              Display labels for enums
   ├─ repository.ts          The Repository interface (all methods async)
   ├─ repository.local.ts    Seeded implementation; resolves relationships in one place
   ├─ data/index.ts          `repo`: the active Repository
   ├─ data/seed/*.ts         Seed data, one file per group of tables
   ├─ store.ts               Client interaction store persisted to localStorage
   ├─ placeholders.ts        Deterministic SVG avatars, logos, covers, and project drawings
   └─ utils.ts               cn, slugify, sizeBand, formatters
```

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui on Base UI, Lucide icons, Archivo typeface.

Pages are server components. They read URL search params for filters, call `repo`, and pass plain data to small client components for interactive parts (post actions, composer, endorsements, tabs, filter bar).

## Data model

Tables and their TypeScript interfaces in `src/lib/types.ts`:

| Table | Key fields |
|---|---|
| `users` | id, email |
| `profiles` | id, user_id, slug, full_name, headline, profession, location, bio, current_company_id |
| `experiences`, `education`, `certifications` | profile_id plus the entry |
| `companies` | id, slug, name, company_type, employee_count, location, about, specialties, product_categories |
| `company_members` | company_id, profile_id, title, is_admin |
| `projects` | id, slug, name, city, sector, status, completion_year, description, systems |
| `project_companies` | project_id, company_id, role_type, role_label, status |
| `project_people` | project_id, profile_id, company_id (employer at the time), role_label, status |
| `skills`, `profile_skills`, `endorsements` | skill catalogue, per-profile counts, individual endorsements |
| `posts`, `post_likes`, `comments` | feed content and reactions |
| `needs` | need_type (discussion or hiring), category, title, body, location, tags |
| `jobs` | company_id, title, location, employment_type, summary |
| `supplier_products` | company_id, name, category, summary |

Company size is an attribute: `employee_count` with a derived band from `sizeBand()` (Small under 50, Medium under 250, Large otherwise). It is never a company type.

Project participation is modeled only as `project_companies` and `project_people` rows. `repository.local.ts` joins them once, and project, company, and person pages all render from those joins.

## Product decisions and assumptions

1. **Role claim status.** `project_companies` and `project_people` carry `status: "self_claimed" | "confirmed"`, shown as a small badge wherever a role appears. This is a reduced form of the evidence states in the business proposal. There is no claim or confirmation workflow in the demo; the status is seeded.
2. **Canonical feed route is `/`.** `/feed` redirects to it.
3. **Demo interactions live in the browser.** Likes, saves, comments, endorsements, and created posts and needs are stored in `localStorage`, layered over the read-only seed. Needs created locally render through a client component on their detail page.
4. **Images are generated.** Avatars, logos, covers, product images, and project heroes are deterministic inline SVGs, so the demo never depends on a remote image host. Replace `avatar_url`, `logo_url`, `cover_url`, `hero_url`, or `image_url` with real URLs to override.
5. **Relative times** are computed from the real clock but never earlier than 1 October 2026, the latest seeded date.
6. **Seed data is fictional** and set in the SF Bay Area, with one exception: the signed-in demo user is Louise Hung, using her public professional details (headline, summary, pre-2022 experience, education, licenses, and skills from LinkedIn). In the demo she is placed at the fictional Meridian Atelier with roles on its fictional projects; her real current employer is not shown so that no real firm is tied to invented projects.

## Connecting Supabase

The pages depend only on the `Repository` interface in `src/lib/repository.ts`.

1. Create the tables above in Postgres (the interfaces in `types.ts` map one to one).
2. Write `src/lib/repository.supabase.ts` implementing `Repository` with Supabase queries. The resolved view types (`ProfileView`, `CompanyView`, `ProjectView`, `PostView`, `NeedView`) describe exactly what each page needs, so most methods are a query plus a join.
3. Point `src/lib/data/index.ts` at the new implementation, or choose it when `NEXT_PUBLIC_SUPABASE_URL` is set and keep the local repository as the fallback so presentations never depend on a network.
4. Move the interaction store server-side: `post_likes`, `comments`, `endorsements`, `posts`, and `needs` writes replace the `localStorage` writes in `store.ts`. Add Supabase Auth and swap the seeded demo user for the session user in `getDemoProfile()`.

## Source documents and project record

The business proposal, demo design document, and the master build prompt are in `docs/`. `PROJECT.md` is the project record: what the project is and why, every decision, and a dated log of all work.
