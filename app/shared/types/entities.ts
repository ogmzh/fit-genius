import { ClientUserSchema } from "../validation/client";

export type ClientUser = ClientUserSchema & { id?: string };
export type Appointment = {
  id?: string;
  createdAt?: string;
  day: string;
  from: Date;
  to: Date;
};
