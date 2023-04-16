// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { timeBetweenPhasesInMinutes } from "@/utils/constants/constants";
import { Exam, ExamsOnUsers, Group, User } from "@prisma/client";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Response =
  | (Exam & {
      questions: { text: string; answers: { text: string }[] }[];
      subscribers: Partial<ExamsOnUsers>[];
      countDownDuration: number;
      currentQuestionIndexInSecondPhase?: number;
    })
  | { isSuccess: boolean }
  | { waitTimeBetweenPhases: number };

const getWaitTimeBetweenPhases = async (
  exam: {
    date: Date;
    id: string;
  },
  questionsOrder: { group: Group }
) => {
  const questionCountFirstPhase = await prisma.question.count({
    where: { examId: exam.id, group: questionsOrder.group },
  });

  const timeOfSecondPhaseStart = moment
    .utc(exam.date)
    .startOf("minute")
    .add(questionCountFirstPhase + timeBetweenPhasesInMinutes, "minutes");

  return moment
    .utc(timeOfSecondPhaseStart)
    .diff(moment.utc(new Date()), "seconds");
};

const checkIsLateForQuestion = async (
  exam: { id: string; date: Date },
  currentQuestionIndex: number,
  user: User,
  isSecondPhase: boolean
) => {
  const currentQuestionIndexByTime =
    moment
      .utc(new Date())
      .startOf("minute")
      .diff(moment.utc(exam?.date).startOf("minute"), "minutes") -
    Number(isSecondPhase) * timeBetweenPhasesInMinutes;

  const isLateForQuestion = currentQuestionIndexByTime > currentQuestionIndex;

  if (isLateForQuestion) {
    await prisma.examsOnUsers.update({
      where: { userId_examId: { userId: user.id, examId: exam.id } },
      data: { hasFinished: true },
    });
  }
  return isLateForQuestion;
};

const getQuestionCountDownDuration = (
  currentQuestionIndex: number,
  isInSecondPhase: boolean,
  exam: Exam
) => {
  const pauseTime = isInSecondPhase ? timeBetweenPhasesInMinutes : 0;
  return moment
    .utc(exam?.date)
    .startOf("minute")
    .add(currentQuestionIndex + 1 + pauseTime, "minutes")
    .diff(moment.utc(new Date()), "seconds");
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
      const examInfo = await prisma.exam.findUnique({
        where: { code: code?.toString() },
        select: {
          id: true,
          date: true,
          _count: { select: { questions: true } },
        },
      });
      if (!examInfo) return res.status(404).json({ isSuccess: false });

      const currentQuestionIndex = await prisma.questionsOnUsers.count({
        where: {
          userId: user.id,
          question: { examId: examInfo.id },
        },
      });

      const questionsOrder = await prisma.examsOnUsers.findUnique({
        where: {
          userId_examId: {
            userId: user.id,
            examId: examInfo.id,
          },
        },
        select: { questionsOrder: true, group: true, hasFinished: true },
      });
      if (!questionsOrder?.questionsOrder)
        return res.status(404).json({ isSuccess: false });

      if (questionsOrder.hasFinished)
        return res.status(200).json({
          subscribers: [questionsOrder],
          isSuccess: true,
        });

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

      const isSecondPhase = order.length === examInfo._count.questions;

      const isLateForQuestion = await checkIsLateForQuestion(
        examInfo,
        currentQuestionIndex,
        user,
        isSecondPhase
      );

      if (isLateForQuestion)
        return res.status(200).json({
          subscribers: [questionsOrder],
          isSuccess: true,
        });

      const waitTimeBetweenPhases = await getWaitTimeBetweenPhases(
        examInfo,
        questionsOrder
      );

      if (isSecondPhase && waitTimeBetweenPhases > 0) {
        return res.json({ waitTimeBetweenPhases });
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
      if (!exam) return res.status(404).json({ isSuccess: false });

      const countDownDuration = getQuestionCountDownDuration(
        currentQuestionIndex,
        isSecondPhase,
        exam
      );

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
        countDownDuration,
        currentQuestionIndexInSecondPhase,
        isSuccess: true,
      });
  }
}
