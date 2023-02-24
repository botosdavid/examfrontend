import { getExam } from "@/utils/api/get";
import { createSelectedAnswer } from "@/utils/api/post";
import { fullExam } from "@/utils/querykeys/querykeys";
import { notifyExamFinished, notifySelectAnswer } from "@/utils/toast/toastify";
import { CircularProgress } from "@mui/material";
import { Answer } from "@prisma/client";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import ExamResult from "../ExamResult/ExamResult";
import * as s from "./KvizAtom";

interface KvizProps {
  code: string;
}

const Kviz = ({ code }: KvizProps) => {
  const [isFinished, setIsFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { data: exam, isLoading } = useQuery([fullExam, { code }], () =>
    getExam(code)
  );
  const selectAnswerMutation = useMutation(createSelectedAnswer, {
    onSuccess: () => {
      if (!hasNextQuestion) {
        notifyExamFinished();
        setIsFinished(true);
        return;
      }
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
    },
  });

  const handleGoToNextQuestion = () => {
    if (selectedAnswer === null) return notifySelectAnswer();
    const questionId = exam.questions[questionIndex].id;
    selectAnswerMutation.mutate({ questionId, selectedAnswer });
    // TODO: fetching only one question at a time for safety
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
      {isFinished ? (
        <ExamResult code={code} />
      ) : (
        <>
          <s.Question>{exam.questions[questionIndex].text}</s.Question>
          <s.AnswerButtonsContainer>
            {exam.questions[questionIndex].answers.map(
              (answer: Answer, index: number) => (
                <Button
                  onClick={() => setSelectedAnswer(index)}
                  key={index}
                  secondary={index !== selectedAnswer}
                >
                  {answer.text}
                </Button>
              )
            )}
          </s.AnswerButtonsContainer>
          <Button secondary onClick={handleGoToNextQuestion}>
            {hasNextQuestion ? "Next" : "Finish"}
          </Button>
        </>
      )}
    </s.KvizContainer>
  );
};

export default Kviz;