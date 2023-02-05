// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/lib/prismadb';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

const salt = 10;

type Response = {
  isSuccess: boolean,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { body: { name, neptun, isTeacher }, method } = req;

  switch (method){
    case 'POST':
      const password = await bcrypt.hash(req.body.password, salt);
      const role = isTeacher ? Role.TEACHER : Role.STUDENT;
      const user = await prisma.user.findFirst({where: {neptun}});
      if(user) return res.status(401);
      
      await prisma.user.create({
        data: {
          name,
          neptun,
          password,
          role,
        },
      })
      res.status(200).json({ isSuccess: true })
  }
}
