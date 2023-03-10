import { ClientUserSchema } from "../validation/client";

export type ClientUser = ClientUserSchema & { id?: string };
