import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().min(2, "Name is required").max(50, "Name is too long"),
  description: z.string().optional(),
  type: z.literal("repetition").or(z.literal("time")),
  tags: z.array(z.string(), {
    required_error: "Must select at least one tag",
  }),
  link: z.string().optional(),
});

export type ExerciseSchema = z.infer<typeof exerciseSchema>;
