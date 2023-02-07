import ExamCreator from "@/components/ExamCreator/ExamCreator";
import Layout from "@/components/Layout/Layout";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";

interface ManagePageProps {
  usersession: UserSession;
}

const ManagePage = ({ usersession }: ManagePageProps) => {
  return (
    <Layout usersession={usersession}>
      <ExamCreator />
    </Layout>
  );
};

export default ManagePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const usersession = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

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
    },
  };
};
