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

/**
 * Insert shape: identity and timestamps are optional, everything else is not.
 *
 * Written with mapped types rather than `Omit`/`Pick` because those demand a
 * `K extends keyof T` constraint that string literals cannot satisfy for an
 * unresolved generic parameter.
 */
type NewRow<T> = {
  [K in keyof T as K extends "id" | "created_at" | "updated_at" ? never : K]: T[K];
} & {
  [K in Extract<keyof T, "id" | "created_at" | "updated_at">]?: T[K];
};

export type ProfileRow = {
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

export type ProjectRow = {
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

export type SkillRow = {
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

export type ExperienceRow = {
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

export type CertificationRow = {
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

export type AchievementRow = {
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

export type ContactMessageRow = {
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

export type AdminAllowlistRow = {
  email: string;
  created_at: string;
}

export type Tables = {
  /**
   * Compile-time shape only. The app never queries this table — it has no
   * grants and no policies, so no web role can read it regardless of what the
   * types say here.
   */
  admin_allowlist: {
    Row: AdminAllowlistRow;
    Insert: { email: string; created_at?: string };
    Update: { email?: string; created_at?: string };
    Relationships: [];
  };
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
    Functions: {
      reorder_items: {
        Args: { p_table: string; p_ids: string[] };
        Returns: number;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type ReorderableTable =
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "achievements";

export type TableRow<T extends keyof Tables> = Tables[T]["Row"];
