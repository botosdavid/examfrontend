// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Exam, ExamsOnUsers } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Response =
  | (Exam & {
      questions: { text: string; answers: { text: string }[] }[];
      subscribers: ExamsOnUsers[];
      currentQuestionIndex?: number;
    })
  | { isSuccess: boolean };

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
      const { id } = await prisma.exam.findUniqueOrThrow({
        where: { code: code?.toString() },
      });
      if (!id) return res.status(404);

      const currentQuestionIndex = await prisma.questionsOnUsers.count({
        where: {
          userId: user.id,
          question: { examId: id },
        },
      });

      const questionsOrder = await prisma.examsOnUsers.findUnique({
        where: {
          userId_examId: {
            userId: user.id,
            examId: id,
          },
        },
        select: { questionsOrder: true },
      });
      if (!questionsOrder?.questionsOrder)
        return res.status(404).json({ isSuccess: false });

      const order = questionsOrder.questionsOrder.split(",");
      const skip =
        currentQuestionIndex in order
          ? Number(order[currentQuestionIndex])
          : currentQuestionIndex;

      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          subscribers: { where: { userId: user.id } },
          questions: {
            select: {
              id: true,
              text: true,
              group: true,
              image: true,
              answers: { select: { text: true } },
            },
            skip,
            take: 1,
          },
        },
      });
      if (!exam) return res.status(404);

      return res.status(200).json({ ...exam, currentQuestionIndex });
  }
}
