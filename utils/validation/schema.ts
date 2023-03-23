import { z } from "zod";

export const examCreateSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Exam name must be minimum 4 characters" })
    .max(20, { message: "Exam name must be maximum 20 characters" }),
  date: z.object({ _d: z.date() }),
  levels: z
    .number()
    .array()
    .min(2, { message: "Minimum 2 levels are required" })
    .max(10, { message: "Maximum number of levels is 10" }),
  questions: z
    .object({
      text: z
        .string()
        .min(5, { message: "Question must be minimum 5 characters" })
        .max(30, { message: "Question max number of characters is 30" }),
      correctAnswer: z.number().min(0).max(3),
      group: z.string(),
      answers: z
        .object({
          text: z
            .string()
            .min(2, { message: "Answer must be minimum 2 characters" })
            .max(30, { message: "Answer must be maximum of 30 characters" }),
        })
        .array()
        .length(4),
      image: z.union([z.literal(""), z.string().trim().url()]),
    })
    .array()
    .min(2, { message: "Minimum number of questions is 2" })
    .max(20, { message: "Maximum number of questions is 20" }),
});

export const registrationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be minimum 3 characters" })
    .max(25, { message: "Name must be maximum 25 characters" }),
  neptun: z
    .string()
    .length(6, { message: "Neptun must be exactly 6 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be minimum 6 characters" })
    .max(30, { message: "Password must be maximum 30 characters" }),
});

export const loginSchema = registrationSchema.omit({ name: true });

export type examCreateSchemaType = z.infer<typeof examCreateSchema>;
export type registrationSchemaType = z.infer<typeof registrationSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
