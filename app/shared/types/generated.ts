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
      appointments: {
        Row: {
          client_ids: string[] | null
          created_at: string | null
          day: string
          from: string
          id: string
          to: string
        }
        Insert: {
          client_ids?: string[] | null
          created_at?: string | null
          day: string
          from: string
          id?: string
          to: string
        }
        Update: {
          client_ids?: string[] | null
          created_at?: string | null
          day?: string
          from?: string
          id?: string
          to?: string
        }
      }
      client_appointments: {
        Row: {
          appointment_id: string
          client_id: string
          id: string
        }
        Insert: {
          appointment_id: string
          client_id: string
          id?: string
        }
        Update: {
          appointment_id?: string
          client_id?: string
          id?: string
        }
      }
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
      appointment_clients_by_date: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          appointment_id: string
          day: string
          time_from: string
          time_to: string
          client_id: string
          first_name: string
          last_name: string
          email: string
        }[]
      }
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
