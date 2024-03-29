import { formatISO } from "date-fns";

import { ClientRow, ExerciseRow } from "./types/database";
import { ClientUserSchema } from "./validation/client";
import { ClientUser } from "./types/entities";
import { ExerciseSchema } from "./validation/exercise";

export const EVENT_TIME_FORMAT = "yyyy-MM-dd HH:mm";
export const HUMAN_DATE_FORMAT = "MMM dd. yyyy";
export const SQL_DATE_FORMAT = "yyyy-MM-dd";
export const TIME_FORMAT = "HH:mm";
export const CALENDAR_DATE_FORMAT = `${SQL_DATE_FORMAT} ${TIME_FORMAT}`;

export const mapClientRowToFormObject = (row: ClientRow): ClientUser => ({
  id: row.id,
  firstName: row.first_name ?? "",
  lastName: row.last_name ?? "",
  email: row.email ?? "",
  phoneNumber: row.phone_number ?? "",
  dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth) : undefined,
  height: row.height ?? "",
  weight: row.weight ?? "",
  goals: row.goals ?? "",
  notes: row.notes ?? "",
  workoutsGroup: row.workouts_group ?? 0,
  workoutsSolo: row.workouts_solo ?? 0,
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

export const mapFormObjectToExerciseRow = (
  formObject: ExerciseSchema
): Omit<ExerciseRow, "id" | "created_at"> => ({
  name: formObject.name,
  description: formObject.description || null,
  link: formObject.link || null,
  type: formObject.type || null,
});

export const getWorkoutCountColor = (count: number): string => {
  if (count > 4) {
    return "$accent";
  }
  if (count > 0) {
    return "$warning";
  }
  return "$danger";
};
