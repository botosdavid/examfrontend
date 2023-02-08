// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/lib/prismadb';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

type Response = {
  isSuccess: boolean,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const { body: { name, code }, method } = req;
  const { user: {id, role}} = session;

  switch (method){
    case 'POST':
      if (role === Role.STUDENT) return res.status(401);
      await prisma.exam.create({
        data: {
          name,
          authorId: id,
          date: new Date(),
          code,
        },
      })
      res.status(200).json({ isSuccess: true });
      
    case 'PATCH':
      const updatedExam = await prisma.exam.update({
        where: {
          code
        },
        data: {
          subscribers: {
            connect: {
              id: session.user.id,
            }
          },
        },
      })
      res.status(200).json({ isSuccess: true });
  }
}
