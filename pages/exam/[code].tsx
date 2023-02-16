import Button from "@/components/Button/Button";
import { getExam } from "@/utils/api/get";
import { CircularProgress } from "@mui/material";
import { Answer } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import { fullExam } from "../../utils/querykeys/querykeys";

interface ExamPageProps {
  code: string;
}

const ExamPage = ({ code }: ExamPageProps) => {
  const { data: exam, isLoading } = useQuery([fullExam, { code }], () =>
    getExam(code)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  const handleGoToNextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
    setSelectedAnswerIndex(null);
    // TODO: mutation saving users answer to this question
    // TODO: fetching next question from this exam (later)
  };

  if (isLoading) return <CircularProgress />;

  const hasNextQuestion = exam.questions.length > questionIndex + 1;

  return (
    <div>
      <h1>Exam with code: {code}</h1>
      <h3>{exam.questions[questionIndex].text}</h3>
      {exam.questions[questionIndex].answers.map(
        (answer: Answer, index: number) => (
          <Button
            onClick={() => setSelectedAnswerIndex(index)}
            key={index}
            secondary={index === selectedAnswerIndex}
          >
            {answer.text}
          </Button>
        )
      )}
      {hasNextQuestion && (
        <Button secondary onClick={handleGoToNextQuestion}>
          Next
        </Button>
      )}
    </div>
  );
};

export default ExamPage;

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { code } = query;
  return {
    props: {
      code,
    },
  };
}
