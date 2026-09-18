import type { EmploymentType, OpportunityStatus, OpportunityType } from "./opportunity";

export type OpportunityRow = {
  id: string; type: OpportunityType; status: OpportunityStatus; slug: string | null;
  title: string; description: string; location: string | null; image_url: string | null;
  whatsapp: string | null; submitted_by: string | null; published_at: string | null;
  created_at: string; updated_at: string; company: string | null;
  employment_type: EmploymentType | null; requirements: string | null; deadline: string | null;
  application_url: string | null; owner_name: string | null; category: string | null;
  instagram: string | null; website: string | null;
};
export type OpportunityInsert = Pick<OpportunityRow, "type" | "title" | "description"> & Partial<Omit<OpportunityRow, "type" | "title" | "description">>;
export type Database = {
  public: {
    Tables: { opportunities: { Row: OpportunityRow; Insert: OpportunityInsert; Update: Partial<OpportunityRow>; Relationships: [] } };
    Views: { [_ in never]: never };
    Functions: { consume_opportunity_limit: { Args: { p_key: string; p_limit: number; p_seconds: number }; Returns: boolean } };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
