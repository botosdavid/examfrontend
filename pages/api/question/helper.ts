// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getRandomWrongAnswerIndex } from "@/utils/functions/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";
import { getPointSum } from "@/utils/functions/functions";
import { noSelectedAnswer } from "@/components/Kviz/Kviz";

const hasHalving = "hasHalving";
const hasStatistics = "hasStatistics";
const hasBestAnswer = "hasBestAnswer";

type Response = {
  eliminatedAnswerIndexes?: number[];
  statistics?: number[];
  bestAnswer?: number;
  isSuccess?: boolean;
};

export const getQuestionStatistics = async (questionId: string) => {
  const questionStatistics = await prisma.questionsOnUsers.findMany({
    where: {
      questionId,
    },
    select: { selectedAnswer: true },
  });

  return questionStatistics.reduce(
    (acc, curr) => {
      if (curr.selectedAnswer !== noSelectedAnswer) {
        acc[curr.selectedAnswer]++;
      }
      return acc;
    },
    [0, 0, 0, 0]
  );
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

  const setHelperUsed = async (helper: string, examId: string) => {
    await prisma.examsOnUsers.update({
      where: {
        userId_examId: {
          userId: user.id,
          examId,
        },
      },
      data: {
        [helper]: false,
      },
    });
  };

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
          await setHelperUsed(hasHalving, question.examId);

          return res.status(200).json({ eliminatedAnswerIndexes });

        case "statistics":
          const statistics = await getQuestionStatistics(id?.toString()!);

          const questionExam = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: { examId: true },
          });
          if (!questionExam) return res.status(404).json({ isSuccess: false });

          await setHelperUsed(hasStatistics, questionExam?.examId);

          return res.status(200).json({ statistics });

        case "bestanswer":
          const questionInfo = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: { examId: true, group: true, correctAnswer: true },
          });
          if (!questionInfo) return res.status(404).json({ isSuccess: false });

          const answersData = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: {
              exam: {
                select: {
                  subscribers: {
                    where: { group: questionInfo?.group },
                    select: {
                      user: {
                        select: {
                          selectedAnswers: {
                            where: {
                              question: { examId: questionInfo?.examId },
                            },
                            include: { question: true },
                          },
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          if (!answersData?.exam?.subscribers?.length) {
            await setHelperUsed(hasBestAnswer, questionInfo?.examId);
            return res
              .status(200)
              .json({ bestAnswer: questionInfo?.correctAnswer });
          }

          const bestUser = answersData?.exam.subscribers.reduce(
            (acc, curr: Subscription) => {
              const points = getPointSum(curr.user.selectedAnswers);
              if (points <= acc.points) return acc;
              return { points, userId: curr.user.id };
            },
            { points: -1, userId: "" }
          );

          const bestAnswer = await prisma.questionsOnUsers.findUnique({
            where: {
              userId_questionId: {
                userId: bestUser?.userId,
                questionId: id!.toString(),
              },
            },
            select: { selectedAnswer: true },
          });

          await setHelperUsed(hasBestAnswer, questionInfo?.examId);

          return res
            .status(200)
            .json({ bestAnswer: bestAnswer?.selectedAnswer });
      }
  }
}
