// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Exam } from "@prisma/client";
import { noSelectedAnswer } from "@/components/Kviz/Kviz";
import { getQuestionStatistics } from "../question/helper";

type Response = {
  exam?: Partial<Exam>;
  questionsCorrectAnswers?: QuestionStatistics[];
  allQuestionStatistics?: any;
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

      return res.status(200).json({
        exam: examResults,
        questionsCorrectAnswers,
        allQuestionStatistics,
        isSuccess: true,
      });
  }
}
