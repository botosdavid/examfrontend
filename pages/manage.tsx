import Exam from "@/components/Exam/Exam";
import ExamCreator from "@/components/ExamCreator/ExamCreator";
import Layout from "@/components/Layout/Layout";
import { getCreatedExams } from "@/utils/api/get";
import { createdExams } from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next/types";
import { useQuery } from "react-query";
import { authOptions } from "./api/auth/[...nextauth]";

interface ManagePageProps {
  usersession: UserSession;
}

const ManagePage = ({ usersession }: ManagePageProps) => {
  const { data: exams, isLoading } = useQuery(createdExams, getCreatedExams);

  if (isLoading) return <CircularProgress />;
  return (
    <Layout usersession={usersession}>
      <h1>Manage your exams</h1>
      <br />
      <ExamCreator />
      <br />
      {exams.map((exam: ExamListItem, index: number) => (
        <Exam exam={exam} key={index} />
      ))}
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
