import type { Database } from "./generated";

export enum DatabaseTables {
  CLIENTS = "clients",
}

export type Client = Database["public"]["Tables"][DatabaseTables.CLIENTS];
export type ClientRow = Database["public"]["Tables"][DatabaseTables.CLIENTS]["Row"];
