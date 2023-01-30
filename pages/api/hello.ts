// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/lib/prismadb';

type Data = {
  isSuccess: boolean,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await prisma.user.create({
    data: {
      name: 'Bence',
      neptun: 'eizaya',
      password: 'topsecret',
    },
  })
  res.status(200).json({ isSuccess: true })
}
