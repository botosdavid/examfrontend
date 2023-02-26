import Kviz from "@/components/Kviz/Kviz";
import Layout from "@/components/Layout/Layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ExamPageProps {
  code: string;
  usersession: UserSession;
  ip: string;
}

const ExamPage = ({ code, usersession, ip }: ExamPageProps) => {
  return (
    <Layout usersession={usersession}>
      <Kviz code={code} ip={ip} />
    </Layout>
  );
};

export default ExamPage;

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const usersession = await getServerSession(req, res, authOptions);
  const ip = req.socket.remoteAddress;
  const { code } = query;
  return {
    props: {
      usersession,
      code,
      ip,
    },
  };
}
