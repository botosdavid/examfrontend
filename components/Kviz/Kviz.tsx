import { queryClient } from "@/pages/_app";
import { getExamQuestion, getQuestionHalving } from "@/utils/api/get";
import { createSelectedAnswer } from "@/utils/api/post";
import { currentQuestion, questionHalving } from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { Answer } from "@prisma/client";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import ExamResult from "../ExamResult/ExamResult";
import * as s from "./KvizAtom";

export const noSelectedAnswer = -1;

interface KvizProps {
  code: string;
  ip: string;
}

const Kviz = ({ code, ip }: KvizProps) => {
  const [isHalving, setIsHalving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] =
    useState<number>(noSelectedAnswer);

  const {
    data: exam,
    isLoading,
    isFetching,
  } = useQuery([currentQuestion, { code }], () => getExamQuestion(code), {
    onSuccess: (exam) => setIsFinished(!exam?.questions?.length),
  });

  const { data: eliminatedAnswerIndexes } = useQuery(
    [questionHalving],
    () => getQuestionHalving(exam.questions[0].id),
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!exam && isHalving,
      onSuccess: () =>
        queryClient.invalidateQueries([currentQuestion, { code }]),
    }
  );

  const selectAnswerMutation = useMutation(createSelectedAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries(currentQuestion);
      setSelectedAnswer(noSelectedAnswer);
    },
  });

  const handleGoToNextQuestion = () => {
    const questionId = exam.questions[0].id;
    selectAnswerMutation.mutate({ questionId, selectedAnswer });
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer === index) return setSelectedAnswer(noSelectedAnswer);
    setSelectedAnswer(index);
  };

  if (isLoading || isFetching) return <CircularProgress />;

  if (exam?.ip && exam?.ip !== ip)
    return <div>Cannot access exam from this IP address</div>;

  if (!exam?.subscribers?.length)
    return <div>You are not subscribed to this exam</div>;

  const { hasHalving, hasStatistics, hasBestAnswer } = exam.subscribers[0];

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
          <s.HelpersContainer>
            <Button disabled={!hasHalving} onClick={() => setIsHalving(true)}>
              Halving
            </Button>
            <Button disabled={!hasStatistics} onClick={() => {}}>
              Statistics
            </Button>
            <Button disabled={!hasBestAnswer} onClick={() => {}}>
              Best Answer
            </Button>
          </s.HelpersContainer>
          <s.Question>{exam.questions[0].text}</s.Question>
          <s.AnswerButtonsContainer>
            {exam.questions[0].answers.map((answer: Answer, index: number) => (
              <Button
                onClick={() => handleSelectAnswer(index)}
                key={index}
                secondary={index !== selectedAnswer}
                disabled={
                  eliminatedAnswerIndexes &&
                  eliminatedAnswerIndexes.eliminatedAnswerIndexes.includes(
                    index
                  )
                }
              >
                {answer.text}
              </Button>
            ))}
          </s.AnswerButtonsContainer>
          <s.NextButtonContainer>
            <Button onClick={handleGoToNextQuestion}>
              {selectedAnswer === noSelectedAnswer ? "Skip" : "Next"}
            </Button>
          </s.NextButtonContainer>
        </>
      )}
    </s.KvizContainer>
  );
};

export default Kviz;
