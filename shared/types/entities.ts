import { ClientUserSchema } from "../validation/client";
import { AppointmentRow, ClientRow } from "./database";

export type ClientUser = ClientUserSchema & {
  id?: string;
  workoutsSolo?: number;
  workoutsGroup?: number;
};

export type NewAppointment = Pick<AppointmentRow, "day"> & {
  from: Date;
  to: Date;
  clientIds: string[];
};

export type ExtendedAppointmentRow = AppointmentRow & {
  clients:
    | Pick<
        ClientRow,
        | "first_name"
        | "last_name"
        | "email"
        | "workouts_group"
        | "workouts_solo"
      >
    | Pick<
        ClientRow,
        | "first_name"
        | "last_name"
        | "email"
        | "workouts_group"
        | "workouts_solo"
      >[]
    | null;
};

export type Payment = {
  id?: string;
  clientId?: string;
  workouts: number;
  isSolo: boolean;
  createdAt: Date;
};
