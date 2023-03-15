// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { shuffleQuestions } from "@/utils/functions/functions";

type Response = {
  isSuccess: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const {
    body: { code },
    method,
  } = req;

  switch (method) {
    case "PATCH":
      const exam = await prisma.exam.findUnique({
        where: { code },
        select: {
          id: true,
          questions: true,
          subscribers: {
            where: {
              userId: session.user.id,
            },
          },
        },
      });

      if (!exam) return res.status(404);
      if (exam.subscribers[0].questionsOrder)
        return res.json({ isSuccess: true });

      const questionsIndexGroups = exam.questions.reduce(
        (sum, curr, index) => ({
          ...sum,
          [curr.group]: [...sum[curr.group], index],
        }),
        { A: [], B: [] }
      );

      const questionsOrder = shuffleQuestions(
        questionsIndexGroups[exam.subscribers[0].group]
      ).join(",");

      await prisma.examsOnUsers.update({
        where: {
          userId_examId: {
            userId: session.user.id,
            examId: exam.id,
          },
        },
        data: {
          questionsOrder,
        },
      });
      return res.status(200).json({ isSuccess: true });
  }
}
