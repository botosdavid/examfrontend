// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Exam, ExamsOnUsers } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../prisma/lib/prismadb";
import { authOptions } from "./auth/[...nextauth]";

type Response = Exam & {
  questions: { text: string; answers: { text: string }[] }[];
  subscribers: ExamsOnUsers[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const { user } = session;
  const {
    query: { code },
    method,
  } = req;

  switch (method) {
    case "GET":
      const exam = await prisma.exam.findUnique({
        where: { code: code?.toString() },
        include: {
          subscribers: { where: { userId: user.id } },
          questions: {
            select: {
              id: true,
              text: true,
              answers: { select: { text: true } },
            },
          },
        },
      });
      if (!exam) return res.status(404);

      const currentQuestionIndex = exam.subscribers[0].currentQuestion;
      const currentQuestion = exam.questions[currentQuestionIndex];
      if (!currentQuestion) exam.questions = [];
      else exam.questions = [currentQuestion];

      return res.status(200).json(exam);
  }
}
