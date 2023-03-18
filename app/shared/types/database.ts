import type { Database } from "./generated";

export enum DatabaseTables {
  CLIENTS = "clients",
  APPOINTMENTS = "appointments",
}

export type ClientTable =
  Database["public"]["Tables"][DatabaseTables.CLIENTS];
export type ClientRow =
  Database["public"]["Tables"][DatabaseTables.CLIENTS]["Row"];

export type AppointmentTable =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS];
export type AppointmentRow =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS]["Row"];
