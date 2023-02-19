import { getExam } from "@/utils/api/get";
import { fullExam } from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { Answer } from "@prisma/client";
import { useState } from "react";
import { useQuery } from "react-query";
import Button from "../Button/Button";
import * as s from "./KvizAtom";

interface KvizProps {
  code: string;
}

const Kviz = ({ code }: KvizProps) => {
  const { data: exam, isLoading } = useQuery([fullExam, { code }], () =>
    getExam(code)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  const handleGoToNextQuestion = () => {
    if (!selectedAnswerIndex) return;
    if (!hasNextQuestion) return;
    setQuestionIndex(questionIndex + 1);
    setSelectedAnswerIndex(null);
    // TODO: mutation saving users answer to this question
    // TODO: fetching next question from this exam (later)
  };

  if (isLoading) return <CircularProgress />;

  if (!exam.questions.length) return <div>No questions in this exam!</div>;

  const hasNextQuestion = exam.questions.length > questionIndex + 1;
  return (
    <s.KvizContainer>
      <s.Info>
        Exam: {exam.name}
        <br />
        Code: {code}
      </s.Info>
      <s.Question>{exam.questions[questionIndex].text}</s.Question>
      <s.AnswerButtonsContainer>
        {exam.questions[questionIndex].answers.map(
          (answer: Answer, index: number) => (
            <Button
              onClick={() => setSelectedAnswerIndex(index)}
              key={index}
              secondary={index !== selectedAnswerIndex}
            >
              {answer.text}
            </Button>
          )
        )}
      </s.AnswerButtonsContainer>
      <Button secondary onClick={handleGoToNextQuestion}>
        {hasNextQuestion ? "Next" : "Finish"}
      </Button>
    </s.KvizContainer>
  );
};

export default Kviz;
