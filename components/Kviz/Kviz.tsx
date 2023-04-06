import { queryClient } from "@/pages/_app";
import {
  getExamQuestion,
  getQuestionHalving,
  getQuestionStatistics,
  getBestAnswer,
  getIpAddress,
} from "@/utils/api/get";
import { createSelectedAnswer } from "@/utils/api/post";
import {
  currentQuestion,
  ipAddress,
  questionBestAnswer,
  questionHalving,
  questionStatistics,
} from "@/utils/querykeys/querykeys";
import { Answer } from "@prisma/client";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Button from "../Button/Button";
import ExamResult from "../ExamResult/ExamResult";
import * as s from "./KvizAtom";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import BarChartIcon from "@mui/icons-material/BarChart";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
import { finishExam } from "@/utils/api/patch";
import Loading from "../Loading/Loading";

export const noSelectedAnswer = -1;

interface KvizProps {
  code: string;
  userId: string;
}

const Kviz = ({ code, userId }: KvizProps) => {
  const [showHalving, setShowHalving] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showBestAnswer, setShowBestAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] =
    useState<number>(noSelectedAnswer);

  const ipQuery = useQuery(ipAddress, getIpAddress);

  const {
    data: exam,
    isLoading,
    isFetching,
  } = useQuery([currentQuestion, { code }], () => getExamQuestion(code), {
    onSuccess: (exam) =>
      setIsFinished(
        exam.subscribers?.[0]?.hasFinished || !exam.questions?.length
      ),
    refetchOnWindowFocus: false,
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
    const questionId = exam?.questions[0]?.id;
    selectAnswerMutation.mutate({ questionId, selectedAnswer });
  };

  const finishExamMutation = useMutation(finishExam, {
    onSuccess: () => queryClient.invalidateQueries(currentQuestion),
  });

  const handleFinishExam = () => finishExamMutation.mutate(exam.id);

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer === index) return setSelectedAnswer(noSelectedAnswer);
    setSelectedAnswer(index);
  };

  const countdownDuration = useMemo(
    () =>
      moment
        .utc(exam?.date)
        .startOf("minute")
        .add(exam?.currentQuestionIndex + 1, "minutes")
        .diff(moment.utc(new Date()), "seconds"),
    [exam]
  );

  if (isLoading || isFetching || ipQuery.isLoading) return <Loading />;

  if (!isFinished && exam?.ip && exam?.ip !== ipQuery?.data?.ip)
    return <div>Cannot access exam from this IP address</div>;

  if (!exam.isSuccess) return <div>No exam found</div>;

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
        <ExamResult code={code} userId={userId} />
      ) : (
        <>
          <s.CountdownContainer>
            <CountdownCircleTimer
              size={45}
              key={0}
              isPlaying
              duration={60}
              colors={["#008e00", "#d5b500", "#A30000"]}
              colorsTime={[60, 30, 0]}
              strokeWidth={6}
              onComplete={handleGoToNextQuestion}
              initialRemainingTime={
                countdownDuration >= 0 ? countdownDuration : 0
              }
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </s.CountdownContainer>
          {isInSecondPhase && (
            <>
              <s.Levels levels={exam.levels}>
                {exam.levels.split(",").map((level: string, index: number) => (
                  <s.Dot
                    isLevel={level === "1"}
                    isCurrent={
                      index === exam?.currentQuestionIndexInSecondPhase
                    }
                    key={index}
                  ></s.Dot>
                ))}
              </s.Levels>
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
            </>
          )}
          {exam.questions[0]?.image && (
            <Image
              alt=""
              width="300"
              height="200"
              style={{
                objectFit: "cover",
                alignSelf: "center",
                borderRadius: "0.5rem",
              }}
              unoptimized
              src={exam.questions[0].image}
            />
          )}
          <s.Question>{exam.questions[0]?.text}</s.Question>
          <s.AnswerButtonsContainer>
            {exam.questions[0]?.answers.map((answer: Answer, index: number) => (
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
            {isInSecondPhase && (
              <Button danger onClick={handleFinishExam}>
                Finish Exam
              </Button>
            )}
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
