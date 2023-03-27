import { ClientUserSchema } from "../validation/client";
import { AppointmentRow, ClientRow } from "./database";

export type ClientUser = ClientUserSchema & { id?: string };

export type NewAppointment = Pick<AppointmentRow, "day"> & {
  from: Date;
  to: Date;
  clientIds: string[];
};

export type ExtendedAppointmentRow = AppointmentRow & {
  clients:
    | Pick<ClientRow, "first_name" | "last_name" | "email">
    | Pick<ClientRow, "first_name" | "last_name" | "email">[]
    | null;
};