// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getRandomWrongAnswerIndex } from "@/utils/functions/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../../../prisma/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

type Response = {
  eliminatedAnswerIndexes: number[];
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

  switch (method) {
    case "GET":
      switch (type) {
        case "halving":
          const question = await prisma.question.findUnique({
            where: { id: id?.toString() },
            select: { correctAnswer: true },
          });

          const answerIndexes = new Array(4).fill(0).map((_, index) => index);
          answerIndexes.splice(Number(question?.correctAnswer), 1);

          const eliminatedAnswerIndexes = [
            getRandomWrongAnswerIndex(answerIndexes),
            getRandomWrongAnswerIndex(answerIndexes),
          ];

          if (!eliminatedAnswerIndexes) return res.status(404);

          const { examId } = await prisma.question.findUniqueOrThrow({
            where: { id: id?.toString() },
            select: { examId: true },
          });

          await prisma.examsOnUsers.update({
            where: {
              userId_examId: {
                userId: user.id,
                examId,
              },
            },
            data: {
              hasHalving: false,
            },
          });

          return res.status(200).json({ eliminatedAnswerIndexes });
      }
  }
}
