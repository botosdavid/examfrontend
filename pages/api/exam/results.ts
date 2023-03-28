// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Exam } from "@prisma/client";
import { noSelectedAnswer } from "@/components/Kviz/Kviz";
import { getQuestionStatistics } from "../question/helper";
import { getPointSum } from "@/utils/functions/functions";

type Response = {
  exam?: Partial<Exam>;
  questionsCorrectAnswers?: QuestionStatistics[];
  allQuestionStatistics?: any;
  correctAnswersHighlight?: any;
  isSuccess: boolean;
};

// todo: reuse this function in getquestion api generate second phase
const getQuestionsCorrectAnswers = async (examId: string) => {
  const questions = await prisma.question.findMany({
    where: { examId },
    include: {
      selectedAnswers: true,
      answers: { select: { text: true } },
    },
  });
  return questions.map((question, index) => {
    const correctAnswerCount = question.selectedAnswers.reduce(
      (acc, curr) =>
        acc + Number(curr.selectedAnswer === question.correctAnswer),
      0
    );
    const skippedAnswerCount = question.selectedAnswers.reduce(
      (acc, curr) => acc + Number(curr.selectedAnswer === noSelectedAnswer),
      0
    );
    const wrongAnswerCount = question.selectedAnswers.reduce(
      (acc, curr) =>
        acc +
        Number(
          curr.selectedAnswer !== question.correctAnswer &&
            curr.selectedAnswer !== noSelectedAnswer
        ),
      0
    );
    return {
      index,
      correctAnswerCount,
      skippedAnswerCount,
      wrongAnswerCount,
      group: question.group,
      text: question.text,
      answers: question.answers,
    };
  });
};

const getCorrectAnswersHighlight = async (examId: string) => {
  const examData = await prisma.exam.findUnique({
    where: { id: examId },
    select: {
      subscribers: {
        select: {
          questionsOrder: true,
          user: {
            select: {
              selectedAnswers: {
                where: {
                  question: { examId },
                },
                include: { question: true },
              },
              id: true,
            },
          },
        },
      },
    },
  });
  if (!examData?.subscribers.length)
    return { highest: 0, lowerst: 0, sum: 0, count: 1 };

  const highestCorrectAnswerCount = examData.subscribers.reduce(
    (acc, curr) => {
      const userCorrectAnswerCount = getPointSum(curr.user.selectedAnswers);
      const highest = Math.max(userCorrectAnswerCount, acc.highest);
      const lowest = Math.min(userCorrectAnswerCount, acc.lowest);
      const sum = acc.sum + userCorrectAnswerCount;
      const count = acc.count + Number(!!curr.questionsOrder?.length);
      return { highest, lowest, sum, count };
    },
    { highest: 0, lowest: Infinity, sum: 0, count: 0 }
  );
  return highestCorrectAnswerCount;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const {
    user: { id: userId },
  } = await getServerSession(req, res, authOptions);
  const {
    query: { code },
    method,
  } = req;

  switch (method) {
    case "GET":
      const examResults = await prisma.exam.findUnique({
        where: { code: code!.toString() },
        select: {
          id: true,
          subscribers: { select: { user: true } },
          questions: { select: { id: true, answers: true } },
        },
      });
      if (!examResults) return res.status(404).json({ isSuccess: false });

      const questionsCorrectAnswers = await getQuestionsCorrectAnswers(
        examResults.id
      );

      const allQuestionStatistics = await Promise.all(
        examResults.questions.map((question) =>
          getQuestionStatistics(question.id)
        )
      );

      const correctAnswersHighlight = await getCorrectAnswersHighlight(
        examResults.id
      );

      return res.status(200).json({
        exam: examResults,
        questionsCorrectAnswers,
        allQuestionStatistics,
        correctAnswersHighlight,
        isSuccess: true,
      });
  }
}
