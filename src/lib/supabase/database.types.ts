/**
 * Hand-maintained mirror of `supabase/migrations/0001_schema.sql`.
 *
 * Keeping this in sync by hand is deliberate: it is the contract the whole app
 * type-checks against. If you change a column, change it here too — a wrong
 * type here is a compile error, which is cheaper than a runtime surprise.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamps = { created_at: string; updated_at: string };

type NewRow<T> = Omit<T, keyof Timestamps | "id"> &
  Partial<Pick<T, "id" | keyof Timestamps>>;

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  socials: Json;
  is_public: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string;
  category: string | null;
  status: string | null;
  problem: string | null;
  solution: string | null;
  my_contribution: string | null;
  technologies: string[];
  case_study: Json;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillRow {
  id: string;
  category: string;
  name: string;
  context: string | null;
  highlight: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceRow {
  id: string;
  title: string;
  slug: string;
  organization: string | null;
  type: string;
  role: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  highlights: string[];
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CertificationRow {
  id: string;
  name: string;
  slug: string;
  organization: string | null;
  issue_date: string | null;
  credential_url: string | null;
  badge: string | null;
  description: string;
  details: string[];
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  metric: string | null;
  link: string | null;
  type: string | null;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  project_type: string | null;
  message: string;
  read: boolean;
  spam: boolean;
  user_agent: string | null;
  created_at: string;
}

export type Tables = {
  admin_allowlist: { Row: never; Insert: never; Update: never; Relationships: [] };
  profiles: {
    Row: ProfileRow;
    Insert: NewRow<ProfileRow>;
    Update: Partial<NewRow<ProfileRow>>;
    Relationships: [];
  };
  projects: {
    Row: ProjectRow;
    Insert: NewRow<ProjectRow>;
    Update: Partial<NewRow<ProjectRow>>;
    Relationships: [];
  };
  skills: {
    Row: SkillRow;
    Insert: NewRow<SkillRow>;
    Update: Partial<NewRow<SkillRow>>;
    Relationships: [];
  };
  experience: {
    Row: ExperienceRow;
    Insert: NewRow<ExperienceRow>;
    Update: Partial<NewRow<ExperienceRow>>;
    Relationships: [];
  };
  certifications: {
    Row: CertificationRow;
    Insert: NewRow<CertificationRow>;
    Update: Partial<NewRow<CertificationRow>>;
    Relationships: [];
  };
  achievements: {
    Row: AchievementRow;
    Insert: NewRow<AchievementRow>;
    Update: Partial<NewRow<AchievementRow>>;
    Relationships: [];
  };
  contact_messages: {
    Row: ContactMessageRow;
    Insert: Partial<ContactMessageRow> &
      Pick<ContactMessageRow, "name" | "email" | "subject" | "message">;
    Update: Partial<ContactMessageRow>;
    Relationships: [];
  };
};

export type Database = {
  public: {
    Tables: Tables;
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type TableRow<T extends keyof Tables> = Tables[T]["Row"];
