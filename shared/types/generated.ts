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
          client_id: string
          created_at: string
          day: string
          from: string
          id: string
          to: string
        }
        Insert: {
          client_id: string
          created_at?: string
          day: string
          from: string
          id?: string
          to: string
        }
        Update: {
          client_id?: string
          created_at?: string
          day?: string
          from?: string
          id?: string
          to?: string
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
          workouts_group: number | null
          workouts_solo: number | null
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
          workouts_group?: number | null
          workouts_solo?: number | null
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
          workouts_group?: number | null
          workouts_solo?: number | null
        }
      }
      exercises: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          link: string | null
          name: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          name: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          link?: string | null
          name?: string
          type?: string | null
        }
      }
      measurements: {
        Row: {
          active_straight_leg_raise_comment: string | null
          active_straight_leg_raise_final: number | null
          active_straight_leg_raise_left_raw: number | null
          active_straight_leg_raise_right_raw: number | null
          client_id: string
          created_at: string | null
          deep_squat_comment: string | null
          deep_squat_final: number | null
          deep_squat_raw: number | null
          hurdle_step_comment: string | null
          hurdle_step_final: number | null
          hurdle_step_left_raw: number | null
          hurdle_step_right_raw: number | null
          id: string
          Impingement_clearing_test_comment: string | null
          Impingement_clearing_test_final: number | null
          Impingement_clearing_test_left_raw: number | null
          Impingement_clearing_test_right_raw: number | null
          inline_lunge_comment: string | null
          inline_lunge_final: number | null
          inline_lunge_left_raw: number | null
          inline_lunge_right_raw: number | null
          posterior_rocking_test_comment: string | null
          posterior_rocking_test_final: number | null
          posterior_rocking_test_raw: number | null
          pressup_clearing_test_comment: string | null
          pressup_clearing_test_final: number | null
          pressup_clearing_test_raw: number | null
          rotary_stability_comment: string | null
          rotary_stability_final: number | null
          rotary_stability_left_raw: number | null
          rotary_stability_right_raw: number | null
          shoulder_mobility_comment: string | null
          shoulder_mobility_final: number | null
          shoulder_mobility_left_raw: number | null
          shoulder_mobility_right_raw: number | null
          trunk_stability_pushup_comment: string | null
          trunk_stability_pushup_final: number | null
          trunk_stability_pushup_raw: number | null
        }
        Insert: {
          active_straight_leg_raise_comment?: string | null
          active_straight_leg_raise_final?: number | null
          active_straight_leg_raise_left_raw?: number | null
          active_straight_leg_raise_right_raw?: number | null
          client_id: string
          created_at?: string | null
          deep_squat_comment?: string | null
          deep_squat_final?: number | null
          deep_squat_raw?: number | null
          hurdle_step_comment?: string | null
          hurdle_step_final?: number | null
          hurdle_step_left_raw?: number | null
          hurdle_step_right_raw?: number | null
          id: string
          Impingement_clearing_test_comment?: string | null
          Impingement_clearing_test_final?: number | null
          Impingement_clearing_test_left_raw?: number | null
          Impingement_clearing_test_right_raw?: number | null
          inline_lunge_comment?: string | null
          inline_lunge_final?: number | null
          inline_lunge_left_raw?: number | null
          inline_lunge_right_raw?: number | null
          posterior_rocking_test_comment?: string | null
          posterior_rocking_test_final?: number | null
          posterior_rocking_test_raw?: number | null
          pressup_clearing_test_comment?: string | null
          pressup_clearing_test_final?: number | null
          pressup_clearing_test_raw?: number | null
          rotary_stability_comment?: string | null
          rotary_stability_final?: number | null
          rotary_stability_left_raw?: number | null
          rotary_stability_right_raw?: number | null
          shoulder_mobility_comment?: string | null
          shoulder_mobility_final?: number | null
          shoulder_mobility_left_raw?: number | null
          shoulder_mobility_right_raw?: number | null
          trunk_stability_pushup_comment?: string | null
          trunk_stability_pushup_final?: number | null
          trunk_stability_pushup_raw?: number | null
        }
        Update: {
          active_straight_leg_raise_comment?: string | null
          active_straight_leg_raise_final?: number | null
          active_straight_leg_raise_left_raw?: number | null
          active_straight_leg_raise_right_raw?: number | null
          client_id?: string
          created_at?: string | null
          deep_squat_comment?: string | null
          deep_squat_final?: number | null
          deep_squat_raw?: number | null
          hurdle_step_comment?: string | null
          hurdle_step_final?: number | null
          hurdle_step_left_raw?: number | null
          hurdle_step_right_raw?: number | null
          id?: string
          Impingement_clearing_test_comment?: string | null
          Impingement_clearing_test_final?: number | null
          Impingement_clearing_test_left_raw?: number | null
          Impingement_clearing_test_right_raw?: number | null
          inline_lunge_comment?: string | null
          inline_lunge_final?: number | null
          inline_lunge_left_raw?: number | null
          inline_lunge_right_raw?: number | null
          posterior_rocking_test_comment?: string | null
          posterior_rocking_test_final?: number | null
          posterior_rocking_test_raw?: number | null
          pressup_clearing_test_comment?: string | null
          pressup_clearing_test_final?: number | null
          pressup_clearing_test_raw?: number | null
          rotary_stability_comment?: string | null
          rotary_stability_final?: number | null
          rotary_stability_left_raw?: number | null
          rotary_stability_right_raw?: number | null
          shoulder_mobility_comment?: string | null
          shoulder_mobility_final?: number | null
          shoulder_mobility_left_raw?: number | null
          shoulder_mobility_right_raw?: number | null
          trunk_stability_pushup_comment?: string | null
          trunk_stability_pushup_final?: number | null
          trunk_stability_pushup_raw?: number | null
        }
      }
      payments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_solo: boolean
          workouts: number
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_solo?: boolean
          workouts: number
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_solo?: boolean
          workouts?: number
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
