export type OpportunityType = "job" | "business";
export type OpportunityStatus = "pending" | "published" | "rejected";

export interface OpportunityImage {
  id: string;
  url: string;
  sortOrder: number;
}

export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Internship"
  | "Freelance";

export interface OpportunityBase {
  id: string;
  slug: string;
  type: OpportunityType;
  status: OpportunityStatus;
  description: string;
  location: string;
  whatsapp: string;
  image: string;
  images: OpportunityImage[];
  publishedAt: string;
}

export interface JobOpportunity extends OpportunityBase {
  type: "job";
  title: string;
  company: string;
  employmentType: EmploymentType;
  requirements: string[];
  deadline?: string;
  applicationUrl: string;
  submittedBy: string;
}

export interface BusinessOpportunity extends OpportunityBase {
  type: "business";
  businessName: string;
  ownerName: string;
  category: string;
  instagram: string;
  website?: string;
}

export type Opportunity = JobOpportunity | BusinessOpportunity;
