import Head from "next/head";
import * as s from "../styles/shared";
import { GetServerSideProps } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Layout from "../components/Layout/Layout";
import ExamSubscriber from "@/components/ExamSubscriber/ExamSubscriber";
import { useQuery } from "react-query";
import Loading from "@/components/Loading/Loading";
import SearchIcon from "@mui/icons-material/Search";
import Exam from "@/components/Exam/Exam";
import { getSubscribedExams } from "@/utils/api/get";
import { subscribedExams } from "@/utils/querykeys/querykeys";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import CustomInput from "@/components/CustomInput/CustomInput";
import { search } from "@/utils/functions/functions";

interface HomePageProps {
  usersession: UserSession;
}

const Home = ({ usersession }: HomePageProps) => {
  const [animationParent] = useAutoAnimate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: exams, isLoading } = useQuery(
    subscribedExams,
    getSubscribedExams
  );

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
        <s.Bar>
          <ExamSubscriber />
          <CustomInput
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </s.Bar>
        <br />
        {isLoading ? (
          <Loading />
        ) : (
          <div ref={animationParent}>
            {search(exams, searchQuery).map(
              (exam: ExamListItem, index: number) => (
                <Exam exam={exam} isSubscribed key={index} />
              )
            )}
          </div>
        )}
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
