// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Exam, ExamsOnUsers } from "@prisma/client";

type Response = Exam[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const {
    user: { id },
  } = session;
  const {
    method,
    query: { filter },
  } = req;

  switch (method) {
    case "GET":
      switch (filter) {
        case "examsSubscribed":
          const user = await prisma.user.findMany({
            include: {
              [`${filter}`]: {
                select: {
                  exam: {
                    include: {
                      _count: { select: { questions: true } },
                    },
                  },
                },
              },
            },
            where: { id },
          });
          if (!user) return res.status(404).json([]);
          const exams = user[0][`${filter}`];
          const formatExams = [...exams].map(
            ({ exam }: ExamsOnUsers & { exam: Exam }) => exam
          );
          return res.json(formatExams);

        case "examsCreated":
          const createdByUser = await prisma.user.findMany({
            include: { [`${filter}`]: true },
            where: { id },
          });
          if (!createdByUser) return res.status(404);
          const examsCreatedByUser = createdByUser[0][`${filter}`];
          return res.json(examsCreatedByUser);
      }
  }
}
