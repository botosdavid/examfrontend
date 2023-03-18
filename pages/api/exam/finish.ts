// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Response = {
  isSuccess: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const {
    user: { id: userId },
  } = await getServerSession(req, res, authOptions);
  const {
    body: { examId },
    method,
  } = req;

  switch (method) {
    case "PATCH":
      await prisma.examsOnUsers.update({
        where: { userId_examId: { userId, examId } },
        data: { hasFinished: true },
      });
      return res.status(200).json({ isSuccess: true });
  }
}
