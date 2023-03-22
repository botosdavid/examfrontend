import { z } from "zod";

export const examCreateSchema = z.object({
  name: z.string().min(4).max(20),
  date: z.object({ _d: z.date() }),
  levels: z.number().array().min(2).max(20),
  questions: z
    .object({
      text: z.string().min(5).max(10),
      correctAnswer: z.number().min(0).max(3),
      group: z.string(),
      answers: z
        .object({
          text: z.string().min(3).max(30),
        })
        .array()
        .length(4),
      image: z.union([z.literal(""), z.string().trim().url()]),
    })
    .array()
    .min(2),
});

export const registrationSchema = z.object({
  name: z.string().min(3).max(25),
  neptun: z.string().length(6),
  password: z.string().min(6).max(30),
});

export type examCreateSchemaType = z.infer<typeof examCreateSchema>;
export type registrationSchemaType = z.infer<typeof registrationSchema>;
