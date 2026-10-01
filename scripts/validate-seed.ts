/**
 * Referential integrity checks for the seeded dataset.
 * Run with: pnpm validate-seed
 */
import * as seed from "../src/lib/data/seed";

const errors: string[] = [];
const ids = <T extends { id: string }>(xs: T[]) => new Set(xs.map((x) => x.id));

const profileIds = ids(seed.profiles);
const companyIds = ids(seed.companies);
const projectIds = ids(seed.projects);
const skillIds = ids(seed.skills);
const postIds = ids(seed.posts);
const userIds = ids(seed.users);

function unique<T extends { id: string }>(name: string, xs: T[]) {
  const seen = new Set<string>();
  for (const x of xs) {
    if (seen.has(x.id)) errors.push(`${name}: duplicate id ${x.id}`);
    seen.add(x.id);
  }
}
function slugsUnique<T extends { slug: string }>(name: string, xs: T[]) {
  const seen = new Set<string>();
  for (const x of xs) {
    if (seen.has(x.slug)) errors.push(`${name}: duplicate slug ${x.slug}`);
    seen.add(x.slug);
  }
}

unique("profiles", seed.profiles);
unique("companies", seed.companies);
unique("projects", seed.projects);
unique("skills", seed.skills);
unique("posts", seed.posts);
unique("needs", seed.needs);
unique("jobs", seed.jobs);
unique("projectCompanies", seed.projectCompanies);
unique("projectPeople", seed.projectPeople);
slugsUnique("profiles", seed.profiles);
slugsUnique("companies", seed.companies);
slugsUnique("projects", seed.projects);

for (const p of seed.profiles) {
  if (!userIds.has(p.user_id)) errors.push(`profile ${p.id}: unknown user ${p.user_id}`);
  if (p.current_company_id && !companyIds.has(p.current_company_id))
    errors.push(`profile ${p.id}: unknown company ${p.current_company_id}`);
  const skillCount = seed.profileSkills.filter((ps) => ps.profile_id === p.id).length;
  if (skillCount < 2) errors.push(`profile ${p.id}: only ${skillCount} skills (need ≥2)`);
  if (!seed.projectPeople.some((pp) => pp.profile_id === p.id))
    errors.push(`profile ${p.id}: no project roles`);
  if (!seed.companyMembers.some((m) => m.profile_id === p.id && m.company_id === p.current_company_id))
    errors.push(`profile ${p.id}: not a member of current company`);
}
for (const ps of seed.profileSkills) {
  if (!profileIds.has(ps.profile_id)) errors.push(`profileSkill: unknown profile ${ps.profile_id}`);
  if (!skillIds.has(ps.skill_id)) errors.push(`profileSkill ${ps.profile_id}: unknown skill ${ps.skill_id}`);
}
for (const e of seed.experiences)
  if (!profileIds.has(e.profile_id)) errors.push(`experience ${e.id}: unknown profile`);
for (const e of seed.education)
  if (!profileIds.has(e.profile_id)) errors.push(`education ${e.id}: unknown profile`);
for (const c of seed.certifications)
  if (!profileIds.has(c.profile_id)) errors.push(`certification ${c.id}: unknown profile`);
for (const m of seed.companyMembers) {
  if (!profileIds.has(m.profile_id)) errors.push(`companyMember: unknown profile ${m.profile_id}`);
  if (!companyIds.has(m.company_id)) errors.push(`companyMember: unknown company ${m.company_id}`);
}
for (const pc of seed.projectCompanies) {
  if (!projectIds.has(pc.project_id)) errors.push(`${pc.id}: unknown project ${pc.project_id}`);
  if (!companyIds.has(pc.company_id)) errors.push(`${pc.id}: unknown company ${pc.company_id}`);
}
for (const pp of seed.projectPeople) {
  if (!projectIds.has(pp.project_id)) errors.push(`${pp.id}: unknown project ${pp.project_id}`);
  if (!profileIds.has(pp.profile_id)) errors.push(`${pp.id}: unknown profile ${pp.profile_id}`);
  if (pp.company_id && !companyIds.has(pp.company_id)) errors.push(`${pp.id}: unknown company ${pp.company_id}`);
  if (pp.company_id && !seed.projectCompanies.some((pc) => pc.project_id === pp.project_id && pc.company_id === pp.company_id))
    errors.push(`${pp.id}: employer ${pp.company_id} has no role on ${pp.project_id}`);
}
for (const pj of seed.projects) {
  const cos = seed.projectCompanies.filter((pc) => pc.project_id === pj.id).length;
  const ppl = seed.projectPeople.filter((pp) => pp.project_id === pj.id).length;
  if (cos < 1) errors.push(`project ${pj.id}: no companies`);
  if (ppl < 1) errors.push(`project ${pj.id}: no people`);
}
for (const po of seed.posts) {
  if (!profileIds.has(po.author_profile_id)) errors.push(`post ${po.id}: unknown author`);
  if (po.author_company_id && !companyIds.has(po.author_company_id)) errors.push(`post ${po.id}: unknown company`);
  if (po.project_id && !projectIds.has(po.project_id)) errors.push(`post ${po.id}: unknown project`);
  if (po.body.toLowerCase().includes("lorem")) errors.push(`post ${po.id}: lorem ipsum`);
}
for (const c of seed.comments) {
  if (!postIds.has(c.post_id)) errors.push(`comment ${c.id}: unknown post`);
  if (!profileIds.has(c.profile_id)) errors.push(`comment ${c.id}: unknown profile`);
}
for (const n of seed.needs) {
  if (!profileIds.has(n.author_profile_id)) errors.push(`need ${n.id}: unknown author`);
  if (n.company_id && !companyIds.has(n.company_id)) errors.push(`need ${n.id}: unknown company`);
}
for (const j of seed.jobs) if (!companyIds.has(j.company_id)) errors.push(`job ${j.id}: unknown company`);
for (const sp of seed.supplierProducts) {
  const co = seed.companies.find((c) => c.id === sp.company_id);
  if (!co) errors.push(`product ${sp.id}: unknown company`);
  else if (co.company_type !== "supplier") errors.push(`product ${sp.id}: company is not a supplier`);
}
for (const co of seed.companies) {
  if (co.company_type === "supplier" && co.product_categories.length === 0)
    errors.push(`company ${co.id}: supplier with no product categories`);
}

const counts = {
  profiles: seed.profiles.length,
  companies: seed.companies.length,
  projects: seed.projects.length,
  projectCompanies: seed.projectCompanies.length,
  projectPeople: seed.projectPeople.length,
  posts: seed.posts.length,
  comments: seed.comments.length,
  needs: seed.needs.length,
  jobs: seed.jobs.length,
  skills: seed.skills.length,
  profileSkills: seed.profileSkills.length,
  supplierProducts: seed.supplierProducts.length,
};
console.table(counts);

if (errors.length) {
  console.error(`\n${errors.length} integrity error(s):`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("\nSeed data OK: all references resolve.");
