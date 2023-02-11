// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/lib/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Response = {
  isSuccess?: boolean,
  exams?: any[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
    const session = await getServerSession(req, res, authOptions);
    const { user: { id }} = session;
    const { method } = req;

    switch (method){
      case 'GET':      
        const exams = await prisma.user.findMany({ 
          include: { examsSubscribed: true },
          where: { id },
        })
        return res.json({isSuccess: true, exams});
    }
}
