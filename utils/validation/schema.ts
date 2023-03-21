import { z } from "zod";

export const examCreateSchema = z.object({
  name: z.string().min(4).max(20),
  date: z.date(),
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
    .array(),
});
