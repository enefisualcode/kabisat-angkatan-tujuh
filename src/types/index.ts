export type ProgramStatus =
  | "idea"
  | "planned"
  | "preparation"
  | "upcoming"
  | "completed"
  | "postponed";

export interface Milestone {
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  estimatedDate: string;
  actualDate?: string;
  location?: string;
  status: ProgramStatus;
  progress?: number;
  coverImage?: string;
  pic?: string;
  participantCount?: number;
  milestones: Milestone[];
}

export interface Member {
  id: string;
  name: string;
  role: string;
  division?: string;
  image?: string;
  description?: string;
  order?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  event: string;
  year: number;
  location?: string;
  image: string;
  featured?: boolean;
}

export interface Update {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  programSlug?: string;
}

export interface AgendaItem {
  id: string;
  year: number;
  month: string;
  title: string;
  status: ProgramStatus;
  programSlug?: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}
