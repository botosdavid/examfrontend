import { queryClient } from "@/pages/_app";
import {
  getExamQuestion,
  getQuestionHalving,
  getQuestionStatistics,
  getBestAnswer,
} from "@/utils/api/get";
import { createSelectedAnswer } from "@/utils/api/post";
import {
  currentQuestion,
  questionBestAnswer,
  questionHalving,
  questionStatistics,
} from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { Answer } from "@prisma/client";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import ExamResult from "../ExamResult/ExamResult";
import * as s from "./KvizAtom";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import BarChartIcon from "@mui/icons-material/BarChart";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";

export const noSelectedAnswer = -1;

interface KvizProps {
  code: string;
  ip: string;
}

const Kviz = ({ code, ip }: KvizProps) => {
  const [showHalving, setShowHalving] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showBestAnswer, setShowBestAnswer] = useState(false);
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
    [questionHalving, { code }],
    () => getQuestionHalving(exam.questions[0].id),
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!exam && showHalving,
      onSuccess: () =>
        queryClient.invalidateQueries([currentQuestion, { code }]),
    }
  );

  const { data: statistics } = useQuery(
    [questionStatistics, { code }],
    () => getQuestionStatistics(exam.questions[0].id),
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!exam && showStatistics,
      onSuccess: () =>
        queryClient.invalidateQueries([currentQuestion, { code }]),
    }
  );

  const { data: bestAnswer } = useQuery(
    [questionBestAnswer, { code }],
    () => getBestAnswer(exam.questions[0].id),
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!exam && showBestAnswer,
      onSuccess: (data) =>
        queryClient.invalidateQueries([currentQuestion, { code }]),
    }
  );

  const selectAnswerMutation = useMutation(createSelectedAnswer, {
    onSuccess: () => {
      queryClient.invalidateQueries(currentQuestion);
      setSelectedAnswer(noSelectedAnswer);
      setShowHalving(false);
      setShowStatistics(false);
      setShowBestAnswer(false);
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
  const isInSecondPhase =
    exam.questions[0]?.group !== exam.subscribers[0]?.group;
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
          {isInSecondPhase && (
            <s.HelpersContainer>
              <Button
                disabled={!hasHalving}
                onClick={() => setShowHalving(true)}
              >
                Halving
                <SplitscreenIcon fontSize="small" />
              </Button>
              <Button
                disabled={!hasStatistics}
                onClick={() => setShowStatistics(true)}
              >
                Statistics
                <BarChartIcon fontSize="small" />
              </Button>
              <Button
                disabled={!hasBestAnswer}
                onClick={() => setShowBestAnswer(true)}
              >
                Best Answer
                <StarIcon fontSize="small" />
              </Button>
            </s.HelpersContainer>
          )}
          {exam.questions[0].image && (
            <Image
              alt=""
              width="300"
              height="200"
              style={{ objectFit: "cover", alignSelf: "center" }}
              unoptimized
              src={exam.questions[0].image}
            />
          )}
          <s.Question>{exam.questions[0].text}</s.Question>
          <s.AnswerButtonsContainer>
            {exam.questions[0].answers.map((answer: Answer, index: number) => (
              <div key={index}>
                <p>{showStatistics && statistics?.statistics[index]}</p>
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
                  selected={showBestAnswer && bestAnswer?.bestAnswer === index}
                >
                  {answer.text}
                </Button>
              </div>
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
