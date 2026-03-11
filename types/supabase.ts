/**
 * Supabase database schema types.
 * Generated via `supabase gen types typescript` for production projects.
 * This placeholder allows the Supabase client to be typed.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Row type for the profiles table (read from database) */
export interface ProfilesRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onesignal_player_id: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

/** Update type for the profiles table (when updating existing rows) */
export interface ProfilesUpdate {
  id?: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  onesignal_player_id?: string | null;
  is_premium?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesRow;
        Update: ProfilesUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
