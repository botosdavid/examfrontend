// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Exam } from "@prisma/client";
import { noSelectedAnswer } from "@/components/Kviz/Kviz";

type Response = {
  exam?: Partial<Exam>;
  questionsCorrectAnswers?: {
    index: number;
    correctAnswerCount: number;
    skippedAnswerCount: number;
    group: string;
  }[];
  isSuccess: boolean;
};

// todo: reuse this function in getquestion api generate second phase
const getQuestionsCorrectAnswers = async (examId: string) => {
  const questions = await prisma.question.findMany({
    where: { examId },
    include: {
      selectedAnswers: true,
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
    return {
      index,
      correctAnswerCount,
      skippedAnswerCount,
      group: question.group,
      text: question.text,
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
        },
      });
      if (!examResults) return res.status(404).json({ isSuccess: false });

      const questionsCorrectAnswers = await getQuestionsCorrectAnswers(
        examResults.id
      );

      return res
        .status(200)
        .json({ exam: examResults, questionsCorrectAnswers, isSuccess: true });
  }
}
