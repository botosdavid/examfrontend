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
              answers: true,
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
          subscribers: {
            where: {
              userId,
            },
          },
        },
      });
      if (!examWIthQuestions?.subscribers[0]?.questionsOrder)
        return res.status(404).json({ isSuccess: false });

      examWIthQuestions.questions =
        examWIthQuestions.subscribers[0].questionsOrder
          .split(",")
          .map((index: string) => examWIthQuestions.questions[Number(index)]);
      return res.status(200).json({ exam: examWIthQuestions });

    case "POST":
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
          exam: { select: { subscribers: { where: { userId } } } },
        },
      });
      if (!question) return res.status(404).json({ isSuccess: false });

      await prisma.questionsOnUsers.upsert({
        where: {
          userId_questionId: { userId, questionId },
        },
        update: {
          selectedAnswer,
        },
        create: {
          userId,
          questionId,
          selectedAnswer,
        },
      });

      const isInSecondPhase =
        question.exam.subscribers[0].group !== question.group;
      const wasAnswerWrong = question.correctAnswer !== selectedAnswer;

      if (isInSecondPhase && wasAnswerWrong) {
        await prisma.examsOnUsers.update({
          where: {
            userId_examId: { examId: question.examId, userId },
          },
          data: { hasFinished: true },
        });
      }
      return res.status(200).json({ isSuccess: true });
  }
}
