import Head from "next/head";
import { GetServerSideProps } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Layout from "../components/Layout/Layout";
import ExamSubscriber from "@/components/ExamSubscriber/ExamSubscriber";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import Exam from "@/components/Exam/Exam";
import { getSubscribedExams } from "@/utils/api/get";
import { subscribedExams } from "@/utils/querykeys/querykeys";

interface HomePageProps {
  usersession: UserSession;
}

const Home = ({ usersession }: HomePageProps) => {
  const { data: exams, isLoading } = useQuery(
    subscribedExams,
    getSubscribedExams
  );

  if (isLoading) return <CircularProgress />;
  return (
    <>
      <Head>
        <title>Exam</title>
        <meta name="description" content="Exams subscribed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout usersession={usersession}>
        <h1>Welcome {usersession.user.neptun}</h1>
        <h2>You are a {usersession.user.role}</h2>
        <br />
        <ExamSubscriber />
        <br />
        {exams.map((exam: ExamListItem, index: number) => (
          <Exam exam={exam} isSubscribed key={index} />
        ))}
      </Layout>
    </>
  );
};

export default Home;

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
