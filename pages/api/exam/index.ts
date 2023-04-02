// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { Exam, Group, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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
    body: { name, code, questions, date, levels, ip },
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
          levels,
          ip,
          questions: {
            create: formatedQuestions,
          },
        },
      });
      return res.status(200).json({ isSuccess: true });

    case "PATCH":
      const examToSubscribe = await prisma.exam.findUnique({
        where: { code },
        select: {
          id: true,
          _count: {
            select: {
              subscribers: true,
            },
          },
        },
      });
      if (!examToSubscribe) return res.status(404);

      const group = examToSubscribe._count.subscribers % 2 ? Group.A : Group.B;

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
          image: question.image,
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
          ip,
          name,
          date,
          levels,
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
