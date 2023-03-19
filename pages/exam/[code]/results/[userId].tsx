import ExamResult from "@/components/ExamResult/ExamResult";
import Layout from "@/components/Layout/Layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

interface ExamResultPageProps {
  code: string;
  userId: string;
  usersession: UserSession;
}

const ExamResultPage = ({ code, userId, usersession }: ExamResultPageProps) => {
  return (
    <Layout usersession={usersession}>
      <ExamResult code={code} userId={userId} />
    </Layout>
  );
};

export default ExamResultPage;

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const usersession = await getServerSession(req, res, authOptions);
  const { code, userId } = query;

  if (!usersession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      usersession,
      code,
      userId,
    },
  };
}
