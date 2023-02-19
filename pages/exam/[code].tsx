import Kviz from "@/components/Kviz/Kviz";
import Layout from "@/components/Layout/Layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

interface ExamPageProps {
  code: string;
  usersession: UserSession;
}

const ExamPage = ({ code, usersession }: ExamPageProps) => {
  return (
    <Layout usersession={usersession}>
      <Kviz code={code} />
    </Layout>
  );
};

export default ExamPage;

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const { code } = query;
  const usersession = await getServerSession(req, res, authOptions);
  return {
    props: {
      usersession,
      code,
    },
  };
}
