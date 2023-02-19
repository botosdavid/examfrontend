// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Exam } from "@prisma/client";

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
      const user = await prisma.user.findMany({
        include: { [`${filter}`]: true },
        where: { id },
      });
      if (!user) return res.status(404);
      const exams = user[0][`${filter}`];

      return res.json(exams);
  }
}
