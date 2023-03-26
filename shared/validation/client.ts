import { z } from "zod";

export const clientUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name is too long"),
  lastName: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .min(6, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  height: z
    .number({
      coerce: true,
      errorMap: () => ({
        message: "Invalid number format",
      }),
    })
    .min(100, "Too low value")
    .max(250, "Too high value")
    .optional()
    .or(z.literal("")),
  weight: z
    .number({
      coerce: true,
      errorMap: () => ({
        message: "Invalid number format",
      }),
    })
    .min(20, "Too low value")
    .max(500, "Too high value")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.date().optional().or(z.literal("")),
  goals: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export type ClientUserSchema = z.infer<typeof clientUserSchema>;
