// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Exam, Question } from "@prisma/client";

type Response = {
  isSuccess?: boolean;
  exam?:
    | (Exam & {
        questions: (Question & {
          selectedAnswers: { selectedAnswer: number }[];
        })[];
      })
    | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const {
    body: { questionId, selectedAnswer },
    query: { code },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  const {
    user: { id: userId },
  } = session;

  switch (method) {
    case "GET":
      if (!code) return res.status(404).json({ isSuccess: false });
      const examWIthQuestions = await prisma.exam.findFirst({
        where: { code: code.toString() },
        include: {
          questions: {
            include: {
              selectedAnswers: {
                where: {
                  userId,
                },
                select: {
                  selectedAnswer: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json({ exam: examWIthQuestions });

    case "POST":
      await prisma.questionsOnUsers.create({
        data: {
          userId,
          questionId,
          selectedAnswer,
        },
      });
      res.status(200).json({ isSuccess: true });
  }
}
