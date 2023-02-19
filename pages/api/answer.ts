// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Response = {
  isSuccess: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const {
    body: { questionId, selectedAnswer },
    method,
  } = req;

  switch (method) {
    case "POST":
      const session = await getServerSession(req, res, authOptions);
      const {
        user: { id: userId },
      } = session;

      await prisma.questionsOnUsers.create({
        data: {
          userId,
          questionId,
          selectedAnswer,
        },
      });
      res.status(200).json({ isSuccess: true });
  }
}
