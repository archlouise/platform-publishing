import type {
  Company,
  CompanyFilters,
  CompanyView,
  JobView,
  NeedType,
  NeedView,
  PeopleFilters,
  PostView,
  Profile,
  ProfileSummary,
  ProfileView,
  Project,
  ProjectFilters,
  ProjectView,
  SearchResults,
} from "./types";

export interface FilterOptions {
  professions: string[];
  locations: string[];
  skills: string[];
  companies: Array<{ id: string; name: string }>;
  companyTypes: string[];
  specialties: string[];
  sectors: string[];
  statuses: string[];
  years: string[];
}

/**
 * Data access contract. Every method is async so the seeded local
 * implementation can be replaced by Supabase queries without touching
 * page components.
 */
export interface Repository {
  getFeed(): Promise<PostView[]>;
  getPost(id: string): Promise<PostView | null>;

  getProfiles(filters?: PeopleFilters): Promise<ProfileSummary[]>;
  getProfileBySlug(slug: string): Promise<ProfileView | null>;
  getProfileById(id: string): Promise<Profile | null>;
  getDemoProfile(): Promise<ProfileView>;
  getSuggestedPeople(forProfileId: string, limit?: number): Promise<ProfileSummary[]>;

  getCompanies(filters?: CompanyFilters): Promise<Company[]>;
  getCompanyBySlug(slug: string): Promise<CompanyView | null>;
  getCompanyById(id: string): Promise<Company | null>;
  getSuggestedCompanies(forProfileId: string, limit?: number): Promise<Company[]>;

  getProjects(filters?: ProjectFilters): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<ProjectView | null>;

  getNeeds(type?: NeedType): Promise<NeedView[]>;
  getNeedById(id: string): Promise<NeedView | null>;
  getTrendingNeeds(limit?: number): Promise<NeedView[]>;
  getJobs(): Promise<JobView[]>;

  search(query: string): Promise<SearchResults>;
  getFilterOptions(): Promise<FilterOptions>;
}
