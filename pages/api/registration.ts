// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/lib/prismadb';
import bcrypt from 'bcrypt';

const salt = 10;

type Data = {
  isSuccess: boolean,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body: { name, neptun }, method } = req;

  switch (method){
    case 'POST':
      const password = await bcrypt.hash(req.body.password, salt);
      await prisma.user.create({
        data: {
          name,
          neptun,
          password,
        },
      })
      res.status(200).json({ isSuccess: true })
  }
}
