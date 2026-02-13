// ==========================================
// ENUMS
// ==========================================

export type MemberRole = 'owner' | 'coach' | 'runner'
export type MemberStatus = 'active' | 'inactive' | 'pending_payment'
export type AttendanceStatus = 'registered' | 'attended' | 'skipped'

// ==========================================
// TABLE INTERFACES
// ==========================================

export interface Profile {
  id: string // UUID from auth.users
  email: string | null
  full_name: string | null
  avatar_url: string | null
  strava_access_token: string | null
  strava_refresh_token: string | null
  created_at: string // timestamp
  updated_at: string | null // timestamp
}

export interface Club {
  id: string // UUID
  name: string
  slug: string // unique
  description: string | null
  logo_url: string | null
  branding_color: string // default '#000000'
  created_at: string // timestamp
}

export interface Membership {
  id: string // UUID
  user_id: string // UUID -> profiles.id
  club_id: string // UUID -> clubs.id
  role: MemberRole // default 'runner'
  status: MemberStatus // default 'pending_payment'
  joined_at: string // timestamp
}

export interface Event {
  id: string // UUID
  club_id: string // UUID -> clubs.id
  title: string
  description: string | null
  start_time: string // timestamp
  location_name: string | null
  location_coords: {
    lat: number
    lng: number
  } | null // JSONB
  gpx_file_url: string | null
  created_by: string | null // UUID -> profiles.id
  created_at: string // timestamp
}

export interface Attendance {
  id: string // UUID
  event_id: string // UUID -> events.id
  user_id: string // UUID -> profiles.id
  status: AttendanceStatus // default 'registered'
  check_in_time: string | null // timestamp
  notes: string | null
}

// ==========================================
// INSERT TYPES (for creating new records)
// ==========================================

export interface ProfileInsert {
  id: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
  strava_access_token?: string | null
  strava_refresh_token?: string | null
  created_at?: string
  updated_at?: string | null
}

export interface ClubInsert {
  id?: string
  name: string
  slug: string
  description?: string | null
  logo_url?: string | null
  branding_color?: string
  created_at?: string
}

export interface MembershipInsert {
  id?: string
  user_id: string
  club_id: string
  role?: MemberRole
  status?: MemberStatus
  joined_at?: string
}

export interface EventInsert {
  id?: string
  club_id: string
  title: string
  description?: string | null
  start_time: string
  location_name?: string | null
  location_coords?: {
    lat: number
    lng: number
  } | null
  gpx_file_url?: string | null
  created_by?: string | null
  created_at?: string
}

export interface AttendanceInsert {
  id?: string
  event_id: string
  user_id: string
  status?: AttendanceStatus
  check_in_time?: string | null
  notes?: string | null
}

// ==========================================
// UPDATE TYPES (for updating records)
// ==========================================

export interface ProfileUpdate {
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
  strava_access_token?: string | null
  strava_refresh_token?: string | null
  updated_at?: string | null
}

export interface ClubUpdate {
  name?: string
  slug?: string
  description?: string | null
  logo_url?: string | null
  branding_color?: string
}

export interface MembershipUpdate {
  role?: MemberRole
  status?: MemberStatus
}

export interface EventUpdate {
  title?: string
  description?: string | null
  start_time?: string
  location_name?: string | null
  location_coords?: {
    lat: number
    lng: number
  } | null
  gpx_file_url?: string | null
}

export interface AttendanceUpdate {
  status?: AttendanceStatus
  check_in_time?: string | null
  notes?: string | null
}

// ==========================================
// DATABASE INTERFACE (Main Export)
// ==========================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      clubs: {
        Row: Club
        Insert: ClubInsert
        Update: ClubUpdate
      }
      memberships: {
        Row: Membership
        Insert: MembershipInsert
        Update: MembershipUpdate
      }
      events: {
        Row: Event
        Insert: EventInsert
        Update: EventUpdate
      }
      attendance: {
        Row: Attendance
        Insert: AttendanceInsert
        Update: AttendanceUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      member_role: MemberRole
      member_status: MemberStatus
      attendance_status: AttendanceStatus
    }
  }
}
