import type { ProgramIconName } from "@/lib/program-icons";

export type ProgramStatus =
  | "idea"
  | "planned"
  | "preparation"
  | "upcoming"
  | "completed"
  | "postponed";

export type ProgramStage = "coming-soon" | "on-going" | "done";

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
  estimatedDate?: string;
  actualDate?: string;
  location?: string;
  status: ProgramStatus;
  stage: ProgramStage;
  coverImage?: string;
  icon?: ProgramIconName;
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

