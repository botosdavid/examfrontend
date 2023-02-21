import { queryClient } from "@/pages/_app";
import { getExam, getExamCorrectAnswers } from "@/utils/api/get";
import { createSelectedAnswer } from "@/utils/api/post";
import { fullExam, resultExam } from "@/utils/querykeys/querykeys";
import { notifyExamFinished, notifySelectAnswer } from "@/utils/toast/toastify";
import { CircularProgress } from "@mui/material";
import { Answer, Question } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import * as s from "./KvizAtom";

interface KvizProps {
  code: string;
}

const Kviz = ({ code }: KvizProps) => {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { data: exam, isLoading } = useQuery([fullExam, { code }], () =>
    getExam(code)
  );
  const selectAnswerMutation = useMutation(createSelectedAnswer, {
    onSuccess: () => {
      if (!hasNextQuestion) {
        queryClient.invalidateQueries(examResult);
        notifyExamFinished();
        setIsFinished(true);
        return;
      }
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
    },
  });
  const { data: examResult, isLoading: isLoadingResult } = useQuery(
    [resultExam, { code }],
    () => getExamCorrectAnswers(code)
  );
  useEffect(() => {
    getExamCorrectAnswers(code).then(console.log);
  }, []);

  const handleGoToNextQuestion = () => {
    if (!selectedAnswer) return notifySelectAnswer();
    const questionId = exam.questions[questionIndex].id;
    selectAnswerMutation.mutate({ questionId, selectedAnswer });
    // TODO: fetching only one question at a time for safety
  };

  if (isLoading || isLoadingResult) return <CircularProgress />;

  if (!exam.questions.length) return <div>No questions in this exam!</div>;

  const hasNextQuestion = exam.questions.length > questionIndex + 1;
  const countCorrectAnswers = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: any }) =>
      sum +
      Number(curr.correctAnswer === curr.selectedAnswers[0].selectedAnswer),
    0
  );
  return (
    <s.KvizContainer>
      <s.Info>
        Exam: {exam.name}
        <br />
        Code: {code}
      </s.Info>
      {isFinished ? (
        <h1>Correct answers: {countCorrectAnswers}</h1>
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
