import type {
  ClaimStatus,
  CompanyType,
  PostType,
  ProjectStatus,
  RoleType,
  SizeBand,
} from "./types";

export const COMPANY_TYPE_LABEL: Record<CompanyType, string> = {
  architecture_firm: "Architecture firm",
  engineering_firm: "Engineering firm",
  general_contractor: "General contractor",
  specialty_contractor: "Specialty contractor",
  supplier: "Supplier / manufacturer",
  other: "Other AEC company",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "Planning",
  design: "In design",
  under_construction: "Under construction",
  completed: "Completed",
};

export const ROLE_TYPE_LABEL: Record<RoleType, string> = {
  architect: "Architecture",
  structural_engineer: "Structural engineering",
  civil_engineer: "Civil engineering",
  mep_engineer: "MEP engineering",
  general_contractor: "General contractor",
  specialty_contractor: "Specialty contractors",
  supplier: "Suppliers and manufacturers",
};

/** Display order for project team groups. */
export const ROLE_TYPE_ORDER: RoleType[] = [
  "architect",
  "structural_engineer",
  "civil_engineer",
  "mep_engineer",
  "general_contractor",
  "specialty_contractor",
  "supplier",
];

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  confirmed: "Confirmed",
  self_claimed: "Self-claimed",
};

export const POST_TYPE_LABEL: Record<PostType, string> = {
  project_milestone: "Milestone",
  project_showcase: "Project",
  company_announcement: "Announcement",
  insight: "Insight",
  hiring: "Hiring",
  need: "Need help",
};

export const SIZE_BANDS: SizeBand[] = ["Small", "Medium", "Large"];
