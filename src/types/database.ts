import type { EmploymentType, OpportunityStatus, OpportunityType } from "./opportunity";

export type OpportunityRow = {
  id: string; type: OpportunityType; status: OpportunityStatus; slug: string | null;
  title: string; description: string; location: string | null; image_url: string | null;
  whatsapp: string | null; submitted_by: string | null; published_at: string | null;
  created_at: string; updated_at: string; company: string | null;
  employment_type: EmploymentType | null; requirements: string | null; deadline: string | null;
  application_url: string | null; application_email: string | null; owner_name: string | null; category: string | null;
  instagram: string | null; website: string | null;
};
export type OpportunityInsert = Pick<OpportunityRow, "type" | "title" | "description"> & Partial<Omit<OpportunityRow, "type" | "title" | "description">>;
export type OpportunityImageRow = { id: string; opportunity_id: string; storage_path: string; sort_order: number; created_at: string };
export type OpportunityWithImages = OpportunityRow & { opportunity_images: OpportunityImageRow[] };
export type UploadSessionRow = { id: string; token_hash: string; payload: OpportunityInsert; image_paths: string[]; status: "open" | "completed" | "cancelled"; expires_at: string; created_at: string };
export type OpportunityNotificationRow = { opportunity_id: string; status: "sending" | "sent" | "failed"; created_at: string; sent_at: string | null; provider_id: string | null };
export type Database = {
  public: {
    Tables: {
      opportunities: { Row: OpportunityRow; Insert: OpportunityInsert; Update: Partial<OpportunityRow>; Relationships: [] };
      opportunity_images: { Row: OpportunityImageRow; Insert: Pick<OpportunityImageRow, "opportunity_id" | "storage_path"> & Partial<OpportunityImageRow>; Update: Partial<OpportunityImageRow>; Relationships: [{ foreignKeyName: "opportunity_images_opportunity_id_fkey"; columns: ["opportunity_id"]; isOneToOne: false; referencedRelation: "opportunities"; referencedColumns: ["id"] }] };
      opportunity_upload_sessions: { Row: UploadSessionRow; Insert: Pick<UploadSessionRow, "id" | "token_hash" | "payload" | "image_paths"> & Partial<UploadSessionRow>; Update: Partial<UploadSessionRow>; Relationships: [] };
      opportunity_notifications: { Row: OpportunityNotificationRow; Insert: Pick<OpportunityNotificationRow, "opportunity_id"> & Partial<OpportunityNotificationRow>; Update: Partial<OpportunityNotificationRow>; Relationships: [{ foreignKeyName: "opportunity_notifications_opportunity_id_fkey"; columns: ["opportunity_id"]; isOneToOne: true; referencedRelation: "opportunities"; referencedColumns: ["id"] }] };
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_opportunity_limit: { Args: { p_key: string; p_limit: number; p_seconds: number }; Returns: boolean };
      complete_opportunity_submission: { Args: { p_id: string; p_token_hash: string }; Returns: string };
      detach_opportunity_images: { Args: { p_id: string; p_paths: string[] }; Returns: undefined };
      delete_opportunity_record: { Args: { p_id: string; p_paths: string[] }; Returns: undefined };
      claim_opportunity_notification: { Args: { p_id: string }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
