import { formatISO } from "date-fns";

import { ClientRow } from "./types/database";
import { ClientUserSchema } from "./validation/client";

export const HUMAN_DATE_FORMAT = "MMM dd. yyyy";
export const SQL_DATE_FORMAT = "yyyy-MM-dd";
export const TIME_FORMAT = "HH:mm";
export const CALENDAR_DATE_FORMAT = `${SQL_DATE_FORMAT} ${TIME_FORMAT}`;

export const mapClientRowToFormObject = (
  row: ClientRow
): ClientUserSchema => ({
  firstName: row.first_name ?? "",
  lastName: row.last_name ?? "",
  email: row.email ?? "",
  phoneNumber: row.phone_number ?? "",
  dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : undefined,
  height: row.height ?? "",
  weight: row.weight ?? "",
  goals: row.goals ?? "",
  notes: row.notes ?? "",
});

export const mapFormObjectToClientRow = (
  formObject: ClientUserSchema
): Partial<ClientRow> => ({
  first_name: formObject.firstName,
  last_name: formObject.lastName,
  email: formObject.email || null,
  phone_number: formObject.phoneNumber || null,
  height:
    formObject.height &&
    typeof formObject.height === "number" &&
    !Number.isNaN(Number(formObject.height))
      ? Number(formObject.height)
      : null,
  weight:
    formObject.weight &&
    typeof formObject.weight === "number" &&
    !Number.isNaN(Number(formObject.weight))
      ? Number(formObject.weight)
      : null,
  date_of_birth: formObject.dateOfBirth
    ? formatISO(formObject.dateOfBirth)
    : null,
  goals: formObject.goals || null,
  notes: formObject.notes || null,
});
