import * as s from "../styles/shared";
import CustomInput from "@/components/CustomInput/CustomInput";
import SearchIcon from "@mui/icons-material/Search";
import Exam from "@/components/Exam/Exam";
import ExamCreator from "@/components/ExamCreator/ExamCreator";
import Layout from "@/components/Layout/Layout";
import { getCreatedExams } from "@/utils/api/get";
import { createdExams } from "@/utils/querykeys/querykeys";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CircularProgress, InputAdornment } from "@mui/material";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { useQuery } from "react-query";
import { authOptions } from "./api/auth/[...nextauth]";
import { search } from "@/utils/functions/functions";

interface ManagePageProps {
  usersession: UserSession;
}

const ManagePage = ({ usersession }: ManagePageProps) => {
  const [animationParent] = useAutoAnimate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: exams, isLoading } = useQuery(createdExams, getCreatedExams);

  if (isLoading) return <CircularProgress />;
  return (
    <Layout usersession={usersession}>
      <h1>Manage your exams</h1>
      <br />
      <s.Bar>
        <ExamCreator />
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
      <div ref={animationParent}>
        {search(exams, searchQuery).map((exam: ExamListItem, index: number) => (
          <Exam exam={exam} key={index} />
        ))}
      </div>
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
