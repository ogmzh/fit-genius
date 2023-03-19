import type { Database } from "./generated";

export enum DatabaseTables {
  CLIENTS = "clients",
  APPOINTMENTS = "appointments",
  CLIENT_APPOINTMENTS = "client_appointments",
}

export type ClientTable =
  Database["public"]["Tables"][DatabaseTables.CLIENTS];
export type ClientRow =
  Database["public"]["Tables"][DatabaseTables.CLIENTS]["Row"];

export type AppointmentTable =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS];
export type AppointmentRow =
  Database["public"]["Tables"][DatabaseTables.APPOINTMENTS]["Row"];

export type ClientAppointmentTable =
  Database["public"]["Tables"][DatabaseTables.CLIENT_APPOINTMENTS];
export type ClientAppointmentRow =
  Database["public"]["Tables"][DatabaseTables.CLIENT_APPOINTMENTS]["Row"];

export type AppointmentClient =
  Database["public"]["Functions"]["appointment_clients_by_date"];
export type AppointmentClientRows =
  Database["public"]["Functions"]["appointment_clients_by_date"]["Returns"];
