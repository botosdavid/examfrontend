// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Exam, ExamsOnUsers, Group } from "@prisma/client";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Response =
  | (Exam & {
      questions: { text: string; answers: { text: string }[] }[];
      subscribers: ExamsOnUsers[];
      currentQuestionIndex?: number;
      currentQuestionIndexInSecondPhase?: number;
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
      const examInfo = await prisma.exam.findUnique({
        where: { code: code?.toString() },
        select: {
          id: true,
          date: true,
          _count: { select: { questions: true } },
        },
      });
      if (!examInfo) return res.status(404);

      const currentQuestionIndex = await prisma.questionsOnUsers.count({
        where: {
          userId: user.id,
          question: { examId: examInfo.id },
        },
      });

      const currentQuestionIndexByTime = moment
        .utc(new Date())
        .startOf("minute")
        .diff(moment.utc(examInfo?.date).startOf("minute"), "minutes");

      if (currentQuestionIndexByTime > currentQuestionIndex) {
        await prisma.examsOnUsers.update({
          where: { userId_examId: { userId: user.id, examId: examInfo.id } },
          data: { hasFinished: true },
        });
      }

      const questionsOrder = await prisma.examsOnUsers.findUnique({
        where: {
          userId_examId: {
            userId: user.id,
            examId: examInfo.id,
          },
        },
        select: { questionsOrder: true, group: true },
      });
      if (!questionsOrder?.questionsOrder)
        return res.status(404).json({ isSuccess: false });

      let order = questionsOrder.questionsOrder.split(",");
      const shouldGenerateSecondPhase =
        currentQuestionIndex === order.length &&
        order.length < examInfo._count.questions;

      const generateSecondPhaseOrder = async () => {
        const secondGroup =
          questionsOrder.group === Group.A ? Group.B : Group.A;

        const questions = await prisma.question.findMany({
          where: { examId: examInfo.id },
          include: {
            selectedAnswers: true,
          },
        });
        const questionsCorrectAnswers = questions.map((question, index) => {
          const correctAnswerCount = question.selectedAnswers.reduce(
            (acc, curr) =>
              acc + Number(curr.selectedAnswer === question.correctAnswer),
            0
          );
          return { index, correctAnswerCount, group: question.group };
        });
        return questionsCorrectAnswers
          .sort(
            (question1, question2) =>
              question2.correctAnswerCount - question1.correctAnswerCount
          )
          .filter((question) => question.group === secondGroup)
          .map(({ index }) => index)
          .join(",");
      };

      if (shouldGenerateSecondPhase) {
        const secondPhaseOrder = await generateSecondPhaseOrder();
        await prisma.examsOnUsers.update({
          where: { userId_examId: { userId: user.id, examId: examInfo.id } },
          data: {
            questionsOrder: `${questionsOrder.questionsOrder},${secondPhaseOrder}`,
          },
        });
        const newQuestionsOrder = await prisma.examsOnUsers.findUnique({
          where: {
            userId_examId: {
              userId: user.id,
              examId: examInfo.id,
            },
          },
          select: { questionsOrder: true },
        });
        order = newQuestionsOrder?.questionsOrder?.split(",")!;
      }

      const skip =
        currentQuestionIndex in order
          ? Number(order[currentQuestionIndex])
          : currentQuestionIndex;

      const exam = await prisma.exam.findUnique({
        where: { id: examInfo.id },
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

      const currentQuestionIndexInSecondPhase =
        await prisma.questionsOnUsers.count({
          where: {
            userId: user.id,
            question: {
              examId: examInfo.id,
              group: { not: { equals: questionsOrder.group } },
            },
          },
        });

      return res.status(200).json({
        ...exam,
        currentQuestionIndex,
        currentQuestionIndexInSecondPhase,
      });
  }
}
