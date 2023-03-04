// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getRandomWrongAnswerIndex } from "@/utils/functions/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Response = {
  eliminatedAnswerIndexes?: number[];
  statistics?: number[];
  isSuccess?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const { user } = session;
  const {
    query: { id, type },
    method,
  } = req;

  if (!user) return res.status(401);

  switch (method) {
    case "GET":
      switch (type) {
        case "halving":
          const question = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: { correctAnswer: true, examId: true },
          });
          if (!question) return res.status(404).json({ isSuccess: false });

          const answerIndexes = new Array(4).fill(0).map((_, index) => index);
          answerIndexes.splice(Number(question.correctAnswer), 1);

          const eliminatedAnswerIndexes = [
            getRandomWrongAnswerIndex(answerIndexes),
            getRandomWrongAnswerIndex(answerIndexes),
          ];

          await prisma.examsOnUsers.update({
            where: {
              userId_examId: {
                userId: user.id,
                examId: question.examId,
              },
            },
            data: {
              hasHalving: false,
            },
          });

          return res.status(200).json({ eliminatedAnswerIndexes });

        case "statistics":
          const questionStatistics = await prisma.questionsOnUsers.findMany({
            where: {
              questionId: id?.toString(),
            },
            select: { selectedAnswer: true },
          });

          const statistics = questionStatistics.reduce(
            (acc, curr) => {
              acc[curr.selectedAnswer]++;
              return acc;
            },
            [0, 0, 0, 0]
          );

          const questionExam = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: { examId: true },
          });
          if (!questionExam) return res.status(404).json({ isSuccess: false });

          await prisma.examsOnUsers.update({
            where: {
              userId_examId: {
                userId: user.id,
                examId: questionExam?.examId,
              },
            },
            data: {
              hasStatistics: false,
            },
          });
          return res.status(200).json({ statistics });
      }
  }
}
