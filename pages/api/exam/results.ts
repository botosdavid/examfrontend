// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Response = {
  exam: any;
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
    query: { code },
    method,
  } = req;

  switch (method) {
    case "GET":
      const examResults = await prisma.exam.findUnique({
        where: { code: code!.toString() },
        select: {
          subscribers: { select: { user: true } },
        },
      });
      return res.status(200).json({ exam: examResults, isSuccess: true });
  }
}
