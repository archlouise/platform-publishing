import { ROLE_TYPE_ORDER, ROLE_TYPE_LABEL, COMPANY_TYPE_LABEL, PROJECT_STATUS_LABEL } from "./labels";
import type { FilterOptions, Repository } from "./repository";
import * as seed from "./data/seed";
import type {
  Company,
  CompanyView,
  Need,
  Post,
  NeedView,
  PostView,
  Profile,
  ProfileSummary,
  ProfileView,
  Project,
  ProjectView,
  RoleType,
  TeamGroup,
} from "./types";
import { sizeBand } from "./utils";

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

const profileById = new Map(seed.profiles.map((p) => [p.id, p]));
const profileBySlug = new Map(seed.profiles.map((p) => [p.slug, p]));
const companyById = new Map(seed.companies.map((c) => [c.id, c]));
const companyBySlug = new Map(seed.companies.map((c) => [c.slug, c]));
const projectById = new Map(seed.projects.map((p) => [p.id, p]));
const projectBySlug = new Map(seed.projects.map((p) => [p.slug, p]));
const skillById = new Map(seed.skills.map((s) => [s.id, s]));

function mustProfile(id: string): Profile {
  const p = profileById.get(id);
  if (!p) throw new Error(`Unknown profile ${id}`);
  return p;
}
function mustCompany(id: string): Company {
  const c = companyById.get(id);
  if (!c) throw new Error(`Unknown company ${id}`);
  return c;
}
function mustProject(id: string): Project {
  const p = projectById.get(id);
  if (!p) throw new Error(`Unknown project ${id}`);
  return p;
}

const byNewest = <T extends { created_at: string }>(a: T, b: T) =>
  b.created_at.localeCompare(a.created_at);

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function matches(haystack: string[], q: string) {
  const needle = normalize(q.trim());
  if (!needle) return true;
  return haystack.some((h) => normalize(h).includes(needle));
}

// ---------------------------------------------------------------------------
// View builders
// ---------------------------------------------------------------------------

function buildPostView(post: Post): PostView {
  return {
    post,
    author: mustProfile(post.author_profile_id),
    company: post.author_company_id ? mustCompany(post.author_company_id) : null,
    project: post.project_id ? mustProject(post.project_id) : null,
    comments: seed.comments
      .filter((c) => c.post_id === post.id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((comment) => ({ comment, author: mustProfile(comment.profile_id) })),
  };
}

function buildNeedView(need: Need): NeedView {
  return {
    need,
    author: mustProfile(need.author_profile_id),
    company: need.company_id ? mustCompany(need.company_id) : null,
  };
}

function summarize(profile: Profile): ProfileSummary {
  return {
    profile,
    company: profile.current_company_id
      ? mustCompany(profile.current_company_id)
      : null,
  };
}

function buildProfileView(profile: Profile): ProfileView {
  const skills = seed.profileSkills
    .filter((ps) => ps.profile_id === profile.id)
    .map((ps) => ({ skill: skillById.get(ps.skill_id)!, endorsement_count: ps.endorsement_count }))
    .sort((a, b) => b.endorsement_count - a.endorsement_count);

  const projects = seed.projectPeople
    .filter((pp) => pp.profile_id === profile.id)
    .map((pp) => ({
      project: mustProject(pp.project_id),
      role_label: pp.role_label,
      status: pp.status,
      employer: pp.company_id ? mustCompany(pp.company_id) : null,
    }))
    .sort((a, b) => b.project.completion_year - a.project.completion_year);

  return {
    profile,
    company: profile.current_company_id ? mustCompany(profile.current_company_id) : null,
    skills,
    projects,
    experiences: seed.experiences
      .filter((e) => e.profile_id === profile.id)
      .sort((a, b) => (b.end_year ?? 9999) - (a.end_year ?? 9999) || b.start_year - a.start_year),
    education: seed.education.filter((e) => e.profile_id === profile.id),
    certifications: seed.certifications.filter((c) => c.profile_id === profile.id),
    posts: seed.posts
      .filter((p) => p.author_profile_id === profile.id)
      .sort(byNewest)
      .map(buildPostView),
  };
}

function buildCompanyView(company: Company): CompanyView {
  const members = seed.companyMembers
    .filter((m) => m.company_id === company.id)
    .map((m) => ({ profile: mustProfile(m.profile_id), title: m.title }));

  const projects = seed.projectCompanies
    .filter((pc) => pc.company_id === company.id)
    .map((pc) => ({
      project: mustProject(pc.project_id),
      role_label: pc.role_label,
      role_type: pc.role_type,
      status: pc.status,
    }))
    .sort((a, b) => b.project.completion_year - a.project.completion_year);

  return {
    company,
    size_band: sizeBand(company.employee_count),
    members,
    projects,
    posts: seed.posts
      .filter((p) => p.author_company_id === company.id)
      .sort(byNewest)
      .map(buildPostView),
    jobs: seed.jobs.filter((j) => j.company_id === company.id).sort(byNewest),
    needs: seed.needs
      .filter((n) => n.company_id === company.id)
      .sort(byNewest)
      .map(buildNeedView),
    products: seed.supplierProducts.filter((p) => p.company_id === company.id),
  };
}

function buildProjectView(project: Project): ProjectView {
  const companyRoles = seed.projectCompanies.filter((pc) => pc.project_id === project.id);
  const peopleRoles = seed.projectPeople.filter((pp) => pp.project_id === project.id);
  const companyIdsOnProject = new Set(companyRoles.map((pc) => pc.company_id));

  const groups = new Map<RoleType, TeamGroup>();
  for (const pc of companyRoles) {
    const group = groups.get(pc.role_type) ?? {
      role_type: pc.role_type,
      heading: ROLE_TYPE_LABEL[pc.role_type],
      companies: [],
    };
    const people = peopleRoles
      .filter((pp) => pp.company_id === pc.company_id)
      // When a company holds two roles on a project (e.g. structural and
      // civil), attach each person to the role that matches their title.
      .filter((pp) => {
        const sameCompanyRoles = companyRoles.filter((o) => o.company_id === pc.company_id);
        if (sameCompanyRoles.length === 1) return true;
        const label = pp.role_label.toLowerCase();
        if (pc.role_type === "civil_engineer") return label.includes("civil");
        return !label.includes("civil");
      })
      .map((pp) => ({ profile: mustProfile(pp.profile_id), role_label: pp.role_label, status: pp.status }));
    group.companies.push({
      company: mustCompany(pc.company_id),
      role_label: pc.role_label,
      status: pc.status,
      people,
    });
    groups.set(pc.role_type, group);
  }

  const team = ROLE_TYPE_ORDER.filter((rt) => groups.has(rt)).map((rt) => groups.get(rt)!);

  const unaffiliated_people = peopleRoles
    .filter((pp) => !pp.company_id || !companyIdsOnProject.has(pp.company_id))
    .map((pp) => ({ profile: mustProfile(pp.profile_id), role_label: pp.role_label, status: pp.status }));

  return {
    project,
    team,
    unaffiliated_people,
    posts: seed.posts
      .filter((p) => p.project_id === project.id)
      .sort(byNewest)
      .map(buildPostView),
  };
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const localRepository: Repository = {
  async getFeed() {
    return [...seed.posts].sort(byNewest).map(buildPostView);
  },
  async getPost(id) {
    const post = seed.posts.find((p) => p.id === id);
    return post ? buildPostView(post) : null;
  },

  async getProfiles(filters = {}) {
    return seed.profiles
      .filter((p) => !filters.profession || p.profession === filters.profession)
      .filter((p) => !filters.location || p.location === filters.location)
      .filter((p) => !filters.company || p.current_company_id === filters.company)
      .filter((p) => {
        if (!filters.skill) return true;
        return seed.profileSkills.some((ps) => ps.profile_id === p.id && ps.skill_id === filters.skill);
      })
      .filter((p) => !filters.q || matches([p.full_name, p.headline, p.profession, p.location], filters.q))
      .sort((a, b) => a.full_name.localeCompare(b.full_name))
      .map(summarize);
  },
  async getProfileBySlug(slug) {
    const p = profileBySlug.get(slug);
    return p ? buildProfileView(p) : null;
  },
  async getProfileById(id) {
    return profileById.get(id) ?? null;
  },
  async getDemoProfile() {
    return buildProfileView(mustProfile(seed.DEMO_PROFILE_ID));
  },
  async getSuggestedPeople(forProfileId, limit = 4) {
    const mine = new Set(seed.projectPeople.filter((pp) => pp.profile_id === forProfileId).map((pp) => pp.project_id));
    const me = profileById.get(forProfileId);
    const scored = seed.profiles
      .filter((p) => p.id !== forProfileId && p.current_company_id !== me?.current_company_id)
      .map((p) => ({
        p,
        shared: seed.projectPeople.filter((pp) => pp.profile_id === p.id && mine.has(pp.project_id)).length,
      }))
      .sort((a, b) => b.shared - a.shared || b.p.connections_count - a.p.connections_count);
    return scored.slice(0, limit).map(({ p }) => summarize(p));
  },

  async getCompanies(filters = {}) {
    return seed.companies
      .filter((c) => !filters.type || c.company_type === filters.type)
      .filter((c) => !filters.location || c.location === filters.location)
      .filter((c) => !filters.size || sizeBand(c.employee_count) === filters.size)
      .filter((c) => !filters.specialty || c.specialties.includes(filters.specialty))
      .filter((c) => !filters.q || matches([c.name, c.about, ...c.specialties, c.location], filters.q))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  async getCompanyBySlug(slug) {
    const c = companyBySlug.get(slug);
    return c ? buildCompanyView(c) : null;
  },
  async getCompanyById(id) {
    return companyById.get(id) ?? null;
  },
  async getSuggestedCompanies(forProfileId, limit = 3) {
    const me = profileById.get(forProfileId);
    const mine = new Set(seed.projectPeople.filter((pp) => pp.profile_id === forProfileId).map((pp) => pp.project_id));
    return seed.companies
      .filter((c) => c.id !== me?.current_company_id)
      .map((c) => ({
        c,
        shared: seed.projectCompanies.filter((pc) => pc.company_id === c.id && mine.has(pc.project_id)).length,
      }))
      .sort((a, b) => b.shared - a.shared || b.c.employee_count - a.c.employee_count)
      .slice(0, limit)
      .map(({ c }) => c);
  },

  async getProjects(filters = {}) {
    return seed.projects
      .filter((p) => !filters.sector || p.sector === filters.sector)
      .filter((p) => !filters.location || p.city === filters.location)
      .filter((p) => !filters.status || p.status === filters.status)
      .filter((p) => !filters.year || String(p.completion_year) === filters.year)
      .filter((p) => !filters.q || matches([p.name, p.description, p.sector, p.city, ...p.systems], filters.q))
      .sort((a, b) => b.completion_year - a.completion_year || a.name.localeCompare(b.name));
  },
  async getProjectBySlug(slug) {
    const p = projectBySlug.get(slug);
    return p ? buildProjectView(p) : null;
  },

  async getNeeds(type) {
    return seed.needs
      .filter((n) => !type || n.need_type === type)
      .sort(byNewest)
      .map(buildNeedView);
  },
  async getNeedById(id) {
    const n = seed.needs.find((x) => x.id === id);
    return n ? buildNeedView(n) : null;
  },
  async getTrendingNeeds(limit = 3) {
    return [...seed.needs]
      .sort((a, b) => b.reply_count - a.reply_count)
      .slice(0, limit)
      .map(buildNeedView);
  },
  async getJobs() {
    return [...seed.jobs].sort(byNewest).map((job) => ({ job, company: mustCompany(job.company_id) }));
  },

  async search(query) {
    const q = query.trim();
    if (!q) return { query: q, people: [], companies: [], projects: [] };
    const skillNames = (profileId: string) =>
      seed.profileSkills
        .filter((ps) => ps.profile_id === profileId)
        .map((ps) => skillById.get(ps.skill_id)!.name);
    return {
      query: q,
      people: seed.profiles
        .filter((p) => matches([p.full_name, p.headline, p.profession, p.location, p.bio, ...skillNames(p.id)], q))
        .map(summarize),
      companies: seed.companies.filter((c) =>
        matches([c.name, c.about, c.location, COMPANY_TYPE_LABEL[c.company_type], ...c.specialties, ...c.product_categories], q),
      ),
      projects: seed.projects.filter((p) =>
        matches([p.name, p.description, p.sector, p.city, p.location, PROJECT_STATUS_LABEL[p.status], ...p.systems], q),
      ),
    };
  },

  async getFilterOptions(): Promise<FilterOptions> {
    const uniq = (xs: string[]) => Array.from(new Set(xs)).sort();
    return {
      professions: uniq(seed.profiles.map((p) => p.profession)),
      locations: uniq([...seed.profiles.map((p) => p.location), ...seed.companies.map((c) => c.location)]),
      skills: seed.skills.map((s) => s.name).sort(),
      companies: seed.companies.map((c) => ({ id: c.id, name: c.name })).sort((a, b) => a.name.localeCompare(b.name)),
      companyTypes: Object.keys(COMPANY_TYPE_LABEL),
      specialties: uniq(seed.companies.flatMap((c) => c.specialties)),
      sectors: uniq(seed.projects.map((p) => p.sector)),
      statuses: Object.keys(PROJECT_STATUS_LABEL),
      years: uniq(seed.projects.map((p) => String(p.completion_year))),
    };
  },
};
