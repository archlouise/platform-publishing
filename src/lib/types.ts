/**
 * Domain types. Each interface maps to a future database table so the
 * seeded local repository can be swapped for Supabase without changing
 * page components.
 */

export type CompanyType =
  | "architecture_firm"
  | "engineering_firm"
  | "general_contractor"
  | "specialty_contractor"
  | "supplier"
  | "other";

export type SizeBand = "Small" | "Medium" | "Large";

export type Profession =
  | "Architect"
  | "Designer"
  | "Structural Engineer"
  | "Civil Engineer"
  | "MEP Engineer"
  | "General Contractor"
  | "Project Manager"
  | "Superintendent"
  | "Estimator"
  | "Specialty Contractor"
  | "Supplier Representative";

export type ProjectSector =
  | "Multifamily"
  | "Office"
  | "Education"
  | "Healthcare"
  | "Civic"
  | "Hospitality"
  | "Infrastructure"
  | "Adaptive Reuse";

export type ProjectStatus =
  | "planning"
  | "design"
  | "under_construction"
  | "completed";

/**
 * How a project role was established. Mirrors the proposal's evidence
 * states in a reduced form: a role is either asserted by the member or
 * confirmed by another verified participant on the project.
 */
export type ClaimStatus = "self_claimed" | "confirmed";

export type RoleType =
  | "architect"
  | "structural_engineer"
  | "mep_engineer"
  | "civil_engineer"
  | "general_contractor"
  | "specialty_contractor"
  | "supplier";

export type PostType =
  | "project_milestone"
  | "project_showcase"
  | "company_announcement"
  | "insight"
  | "hiring"
  | "need";

export type NeedType = "discussion" | "hiring";

export type NeedCategory =
  | "Technical question"
  | "Referral request"
  | "Software"
  | "Code & permitting"
  | "Product & materials"
  | "Hiring"
  | "Seeking subcontractor"
  | "Seeking consultant"
  | "Seeking work"
  | "Available for freelance";

export type EmploymentType = "Full-time" | "Part-time" | "Contract";

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  user_id: string;
  slug: string;
  full_name: string;
  headline: string;
  profession: Profession;
  location: string;
  bio: string;
  avatar_url: string | null;
  current_company_id: string | null;
  connections_count: number;
  years_experience: number;
}

export interface Experience {
  id: string;
  profile_id: string;
  company_id: string | null;
  company_name: string;
  title: string;
  start_year: number;
  end_year: number | null;
  summary: string;
}

export interface Education {
  id: string;
  profile_id: string;
  school: string;
  degree: string;
  year: number;
}

export interface Certification {
  id: string;
  profile_id: string;
  name: string;
  issuer: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  company_type: CompanyType;
  employee_count: number;
  location: string;
  service_regions: string[];
  about: string;
  specialties: string[];
  website: string;
  founded_year: number;
  logo_url: string | null;
  cover_url: string | null;
  /** Suppliers and manufacturers only. */
  product_categories: string[];
}

export interface CompanyMember {
  company_id: string;
  profile_id: string;
  title: string;
  is_admin: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  sector: ProjectSector;
  status: ProjectStatus;
  completion_year: number;
  description: string;
  hero_url: string | null;
  size_sqft: number | null;
  budget_range: string | null;
  delivery_method: string | null;
  systems: string[];
}

export interface ProjectCompany {
  id: string;
  project_id: string;
  company_id: string;
  role_type: RoleType;
  role_label: string;
  status: ClaimStatus;
}

export interface ProjectPerson {
  id: string;
  project_id: string;
  profile_id: string;
  /** Employer at the time of the project. */
  company_id: string | null;
  role_label: string;
  status: ClaimStatus;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ProfileSkill {
  profile_id: string;
  skill_id: string;
  endorsement_count: number;
}

export interface Endorsement {
  id: string;
  endorser_profile_id: string;
  endorsed_profile_id: string;
  skill_id: string;
}

export interface Post {
  id: string;
  author_profile_id: string;
  author_company_id: string | null;
  project_id: string | null;
  post_type: PostType;
  body: string;
  image_url: string | null;
  created_at: string;
  like_count: number;
}

export interface PostLike {
  post_id: string;
  profile_id: string;
}

export interface Comment {
  id: string;
  post_id: string;
  profile_id: string;
  body: string;
  created_at: string;
}

export interface Need {
  id: string;
  author_profile_id: string;
  company_id: string | null;
  need_type: NeedType;
  category: NeedCategory;
  title: string;
  body: string;
  location: string;
  tags: string[];
  created_at: string;
  reply_count: number;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  location: string;
  employment_type: EmploymentType;
  summary: string;
  created_at: string;
}

export interface SupplierProduct {
  id: string;
  company_id: string;
  name: string;
  category: string;
  summary: string;
  image_url: string | null;
}

// ---------------------------------------------------------------------------
// Resolved view models returned by the repository
// ---------------------------------------------------------------------------

export interface ProfileSummary {
  profile: Profile;
  company: Company | null;
}

export interface PostView {
  post: Post;
  author: Profile;
  company: Company | null;
  project: Project | null;
  comments: CommentView[];
}

export interface CommentView {
  comment: Comment;
  author: Profile;
}

export interface SkillView {
  skill: Skill;
  endorsement_count: number;
}

export interface ProjectRoleForProfile {
  project: Project;
  role_label: string;
  status: ClaimStatus;
  employer: Company | null;
}

export interface ProfileView {
  profile: Profile;
  company: Company | null;
  skills: SkillView[];
  projects: ProjectRoleForProfile[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  posts: PostView[];
}

export interface ProjectRoleForCompany {
  project: Project;
  role_label: string;
  role_type: RoleType;
  status: ClaimStatus;
}

export interface CompanyView {
  company: Company;
  size_band: SizeBand;
  members: Array<{ profile: Profile; title: string }>;
  projects: ProjectRoleForCompany[];
  posts: PostView[];
  jobs: Job[];
  needs: NeedView[];
  products: SupplierProduct[];
}

export interface TeamCompany {
  company: Company;
  role_label: string;
  status: ClaimStatus;
  people: Array<{ profile: Profile; role_label: string; status: ClaimStatus }>;
}

export interface TeamGroup {
  role_type: RoleType;
  heading: string;
  companies: TeamCompany[];
}

export interface ProjectView {
  project: Project;
  team: TeamGroup[];
  /** People with a project role whose employer is not on the project. */
  unaffiliated_people: Array<{
    profile: Profile;
    role_label: string;
    status: ClaimStatus;
  }>;
  posts: PostView[];
}

export interface NeedView {
  need: Need;
  author: Profile;
  company: Company | null;
}

export interface JobView {
  job: Job;
  company: Company;
}

export interface SearchResults {
  query: string;
  people: ProfileSummary[];
  companies: Company[];
  projects: Project[];
}

export interface PeopleFilters {
  profession?: string;
  location?: string;
  skill?: string;
  company?: string;
  q?: string;
}

export interface CompanyFilters {
  type?: CompanyType | string;
  location?: string;
  size?: SizeBand | string;
  specialty?: string;
  q?: string;
}

export interface ProjectFilters {
  sector?: string;
  location?: string;
  status?: ProjectStatus | string;
  year?: string;
  q?: string;
}
