# AEC Network — Claude Code Master Prompt

> This is the copy/paste implementation prompt extracted from the design document.

You are the lead product engineer and UI engineer for a demo application called “AEC Network”. Build the application, not merely a static design. Work iteratively, keep the repository runnable after each major step, and make reasonable implementation decisions when the specification leaves small details open.

PRODUCT
AEC Network is a professional social network for the architecture, engineering, and construction industry — essentially a LinkedIn-like network built around the way AEC work actually happens. The core graph is People ↔ Companies ↔ Projects. The platform should help users discover professionals and firms, see what projects they have actually worked on, follow industry activity, ask for help, and find work/opportunities.

DEMO OBJECTIVE
This is a polished demo/MVP, not a production-scale system. It must feel like a real network the moment it opens. The default first page after entering the app is a populated Feed. Optimize for visual credibility, coherent data relationships, responsive behavior, and a clean codebase that can later be connected to a real backend.

TECH STACK
- Next.js with App Router
- React + TypeScript
- Tailwind CSS
- shadcn/ui or equivalent lightweight accessible primitives where useful
- Lucide icons
- Prefer a seeded local-data repository/service layer for the first working demo so the app runs without external credentials.
- Structure data access so Supabase/PostgreSQL/Auth/Storage can be added later without rewriting the page components.
- Do not introduce microservices, queues, Kubernetes, or unnecessary infrastructure.

PRIMARY NAVIGATION
1. Feed — DEFAULT/HOME page
2. People
3. Companies
4. Projects
5. Needs & Help
6. My Profile
Include a global search field in the top navigation. On mobile, create an appropriate compact navigation pattern.

FEED
The Feed is the most important first impression. Build a create-post composer at the top and a realistic mixed activity feed. Seed post types including:
- project milestone
- project showcase
- company announcement
- individual professional insight/update
- hiring post
- Need/Help post
Every post card should show appropriate author/entity metadata and support demo-level Like, Comment, and Save interactions. Entity names and project references must be clickable.

PEOPLE
Create a People directory with filters for profession/discipline, location, skills, and company. Individual profile pages must include:
- name, title/headline, profession, location, avatar
- current company
- about section
- experience
- projects worked on, including role on each project
- skills with endorsement counts
- education/certifications as lightweight fields
Use professions such as Architect, Structural Engineer, Civil Engineer, MEP Engineer, General Contractor/Builder, Project Manager, Superintendent, Estimator, Designer, and related AEC roles.

COMPANIES
Create a Company directory with filters for company type, location, size, and specialty. Company types include:
- Architecture Firm
- Engineering Firm
- General Contractor
- Specialty Contractor
- Supplier / Manufacturer
- Other AEC Company
Company size is an ATTRIBUTE, not an account/company type. Store employee_count and optionally derive a size band such as Small/Medium/Large. Company profiles should contain name, logo, cover image, website, location/service regions, company type, employee count/size, About, specialties/capabilities, people, featured projects, posts, and open roles/needs.

SUPPLIERS / MATERIALS
Treat suppliers/manufacturers as companies with additional supplier-specific data. In the demo they may have product/material categories and a few featured product cards. Do NOT build full e-commerce, checkout, or procurement. Supplier profiles can post announcements and be linked to projects where relevant.

PROJECTS
Projects are a central AEC-specific feature. Create a Projects directory and project detail pages. A project page should include:
- project name, hero image, location, sector/type, status, completion year, description
- optional size/budget-range/delivery-method metadata when useful
- participating companies grouped by role, e.g. Architect, Structural Engineer, MEP Engineer, General Contractor, Specialty Contractor, Supplier
- individual contributors and their project role
- project-related posts/milestones
Model participation as relationships, not free-text fields. A company and a person can each have a specific role on a project, and the same relationship should surface on company/person profiles.

NEEDS & HELP
Create a section with two tabs/categories:
A. Open Discussion / Need Help — technical questions, recommendations, referrals, code/software questions, product/material questions, requests for expertise.
B. Hiring / Seeking Work — companies hiring employees, companies seeking subcontractors/consultants, professionals seeking work, freelancers advertising availability.
Cards should show author, company if relevant, category, location, tags, date, title and short body. Provide a detail view or expandable state.

ENDORSEMENTS
Profiles have skills. Other demo professionals can endorse a skill. For demo purposes, endorsement counts may be seeded and local interactions can increment them. Model this cleanly enough to support a real endorsements table later.

SEARCH
Global search should search at minimum People, Companies, and Projects in the seeded dataset. Display grouped results. Directory filters should work against seeded data.

DATA MODEL
Use TypeScript types/interfaces and a clean local repository/data layer that maps naturally to these future tables:
- users
- profiles
- companies
- company_members
- projects
- project_companies (project_id, company_id, role_type, role_label)
- project_people (project_id, profile_id, role_label)
- skills
- profile_skills
- endorsements
- posts
- post_likes
- comments
- needs
- jobs
- supplier_products
Do not hard-code relationship display strings separately on every page. Use shared data relationships so a change in seeded project participation can render consistently across project, person, and company views.

SEEDED DEMO CONTENT
Create high-quality fictional data, not lorem ipsum and not “Company 1 / User 1”. Seed approximately:
- 12–18 professionals across architecture, engineering, contracting, PM, and supplier roles
- 8–10 companies including at least 2 architecture firms, 2 engineering firms, 2 contractors, 1 specialty contractor, and 1–2 suppliers/manufacturers
- 8–12 projects across multifamily, office, education, healthcare, civic, hospitality and/or infrastructure
- 20–30 feed posts
- 8–12 Needs & Help posts
- skills and endorsements on most profiles
Make the dataset interconnected enough that clicking from a feed post → project → company → person feels coherent. Use fictional company/project names so the demo does not imply real credentials or partnerships. Use reliable remote placeholder imagery or locally bundled placeholders that do not break.

VISUAL DESIGN
The UI should feel professional, architectural, calm, and credible. Avoid flashy gradients, excessive glassmorphism, crypto-style design, or cartoonish social UI. Favor:
- neutral/light background
- strong typography
- restrained borders and subtle elevation
- generous whitespace
- project imagery as the primary visual interest
- clear information hierarchy
- consistent cards, chips/tags, metadata, and entity links
Desktop can use a centered content layout with an optional right rail for suggested people/firms or trending Needs. Mobile must stack cleanly with no horizontal overflow.

KEY USER JOURNEYS THAT MUST WORK
1. Open app → Feed → click project milestone → Project page → click architect/engineer/contractor → Company page → click team member → Person profile.
2. Feed → professional post → Person profile → skills/endorsements and past projects.
3. Companies → filter to General Contractors → open company → view projects and open role.
4. Needs & Help → switch between Open Discussion and Hiring/Seeking Work → open an item.
5. Search for a company/person/project term → open result.
6. Create a simple demo post or Need/Help item → show it immediately in the UI; local state persistence is acceptable for the first demo.

ROUTES
Use readable routes/slugs where practical, for example:
/ or /feed
/people
/people/[slug]
/companies
/companies/[slug]
/projects
/projects/[slug]
/needs
/profile
/search?q=
Choose either / or /feed as the canonical Feed route, but the app must land on Feed by default.

COMPONENTS / CODE QUALITY
Create reusable components such as AppHeader, MobileNav, FeedPostCard, PersonCard, CompanyCard, ProjectCard, NeedCard, SearchResults, SkillChip, EntityLink, ProjectTeamSection, EmptyState, and filters. Keep business/data types separate from presentation components. Avoid giant single-file pages. Use semantic HTML and accessible labels/focus states.

DEMO AUTH
Do not block the entire build on authentication. For the first iteration, assume a seeded signed-in demo user and show “My Profile”. If you add auth later, keep the demo user mode available so presentations never depend on an external login.

OUT OF SCOPE FOR THIS DEMO
- direct messaging infrastructure
- payments
- procurement/checkout
- bidding/RFP engine
- production applicant tracking
- advanced recommendation algorithms
- billing/subscriptions
- enterprise SSO/permissions
- production notification system
- production moderation tooling

EXECUTION PLAN
Work in this order:
1. Inspect repository. If empty, scaffold the app.
2. Create data types, seeded dataset, and repository/data access layer.
3. Create the visual system, shell, header/navigation, responsive layout.
4. Build the Feed first and make it the default page.
5. Build People directory + profile.
6. Build Companies directory + company profile, including supplier variant.
7. Build Projects directory + project detail with role-based relationships.
8. Build Needs & Help.
9. Build global search and filters.
10. Add demo interactions (likes/comments/save, endorsements, create post/need) using local state or a lightweight persistence strategy.
11. Polish responsive behavior, empty/loading states, accessibility and content.
12. Add README with setup, route map, architecture, data model, and next steps for connecting Supabase.

Do not stop after scaffolding or after creating only a homepage. Continue until the complete demo scope above is navigable and coherent. Run lint/typecheck/build as appropriate and fix errors before considering the demo complete.

ACCEPTANCE CRITERIA
- App starts locally using documented commands.
- Default first page is a populated Feed.
- All primary nav destinations are implemented.
- People, companies, and projects are mutually cross-linked.
- Project pages clearly show companies and professionals by role.
- Company size is an attribute, not a separate company class.
- Needs & Help has both Open Discussion and Hiring/Seeking Work.
- Skills and endorsements appear on person profiles.
- Global search works over seeded people, companies, and projects.
- Seeded data is realistic and interconnected.
- No lorem ipsum, broken media, dead primary links, or obviously unfinished placeholder screens.
- Responsive on desktop and mobile.
- README explains how the demo works and how to evolve the local repository layer to Supabase.

When you encounter a small unspecified UI/detail decision, choose a sensible AEC-professional convention and proceed rather than pausing for approval. If a decision would materially change product scope or data relationships, note it in README under “Product decisions / assumptions”.
