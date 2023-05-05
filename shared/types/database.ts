import type { Database } from "./generated";

export enum DatabaseTables {
  CLIENTS = "clients",
  APPOINTMENTS = "appointments",
  CLIENT_APPOINTMENTS = "client_appointments",
  PAYMENTS = "payments",
  EXERCISES = "exercises",
}

export type ClientTable =
  Database["public"]["Tables"][DatabaseTables.CLIENTS];
export type ClientRow =
  Database["public"]["Tables"][DatabaseTables.CLIENTS]["Row"];

export type AppointmentTable =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS];
export type AppointmentRow =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS]["Row"];

export type PaymentTable =
  Database["public"]["Tables"][DatabaseTables.PAYMENTS];
export type PaymentRow =
  Database["public"]["Tables"][DatabaseTables.PAYMENTS]["Row"];

export type ExerciseTable =
  Database["public"]["Tables"][DatabaseTables.EXERCISES];
export type ExerciseRow =
  Database["public"]["Tables"][DatabaseTables.EXERCISES]["Row"];
