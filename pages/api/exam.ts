// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/lib/prismadb";
import { Exam, Group, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { shuffleQuestions } from "@/utils/functions/functions";

type Response =
  | {
      isSuccess?: boolean;
    }
  | Exam;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const {
    body: { name, code, questions, date },
    method,
    query,
  } = req;
  const {
    user: { id: authorId, role },
  } = session;

  switch (method) {
    case "GET":
      const exam = await prisma.exam.findFirst({
        where: { code: query.code?.toString() },
        include: {
          questions: { include: { answers: true } },
          subscribers: { where: { userId: authorId } },
        },
      });
      if (!exam) return res.status(404);
      return res.status(200).json(exam);

    case "POST":
      if (role === Role.STUDENT) return res.status(401);
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const formatedQuestions = questions.map((question: CreateQuestion) => ({
        ...question,
        answers: { create: question.answers },
      }));

      await prisma.exam.create({
        data: {
          name,
          authorId,
          date,
          code: newCode,
          questions: {
            create: formatedQuestions,
          },
        },
      });
      return res.status(200).json({ isSuccess: true });

    case "PATCH":
      const examToSubscribe = await prisma.exam.findUnique({
        where: { code },
        include: {
          questions: true,
        },
      });
      if (!examToSubscribe) return res.status(404);

      const numberOfSubscribers = await prisma.examsOnUsers.count({
        where: { examId: examToSubscribe.id },
      });
      const group = numberOfSubscribers % 2 ? Group.A : Group.B;
      const secondGroup = !(numberOfSubscribers % 2) ? Group.A : Group.B;

      const questionsIndexGroups = examToSubscribe.questions.reduce(
        (sum, curr, index) => ({
          ...sum,
          [curr.group]: [...sum[curr.group], index],
        }),
        { A: [], B: [] }
      );

      const questionsOrder = [
        ...shuffleQuestions(questionsIndexGroups[group]),
        ...questionsIndexGroups[secondGroup],
      ].join(",");

      await prisma.examsOnUsers.upsert({
        where: {
          userId_examId: {
            userId: session.user.id,
            examId: examToSubscribe.id,
          },
        },
        update: {},
        create: {
          userId: session.user.id,
          examId: examToSubscribe.id,
          questionsOrder,
          group,
        },
      });
      return res.status(200).json({ isSuccess: true });

    case "PUT":
      await prisma.exam.update({
        where: { code },
        include: { questions: true },
        data: { questions: { deleteMany: {} } },
      });

      const formatedQuestionsUpdate = questions.map(
        (question: CreateQuestion) => ({
          text: question.text,
          correctAnswer: question.correctAnswer,
          group: question.group,
          answers: {
            create: question.answers.map((answer) => ({
              text: answer.text,
            })),
          },
        })
      );
      await prisma.exam.update({
        where: { code },
        data: {
          name,
          date,
          questions: {
            create: formatedQuestionsUpdate,
          },
        },
        include: {
          questions: {
            include: { answers: true },
          },
        },
      });
      return res.status(200).json({ isSuccess: true });
  }
}
