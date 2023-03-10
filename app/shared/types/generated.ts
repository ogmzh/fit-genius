export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          goals: string | null
          height: number | null
          id: string
          last_name: string | null
          notes: string | null
          phone_number: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone_number?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone_number?: string | null
          weight?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
