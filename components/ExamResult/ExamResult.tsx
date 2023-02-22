import { getExamCorrectAnswers } from "@/utils/api/get";
import { resultExam } from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { Answer, Question } from "@prisma/client";
import { useEffect } from "react";
import { useQuery } from "react-query";
import * as s from "./ExamResultAtom";

interface ExamResultProps {
  code: string;
}

const ExamResult = ({ code }: ExamResultProps) => {
  const { data: examResult, isLoading } = useQuery([resultExam, { code }], () =>
    getExamCorrectAnswers(code)
  );

  const correctAnswersCount = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: any }) =>
      sum +
      Number(curr.correctAnswer === curr.selectedAnswers[0].selectedAnswer),
    0
  );

  const totalAnswersCount = examResult?.exam.questions.length;
  const percentage = Math.round(
    (correctAnswersCount / totalAnswersCount) * 100
  );

  useEffect(() => {
    getExamCorrectAnswers(code).then(console.log);
  }, []);

  if (isLoading) return <CircularProgress />;

  return (
    <s.ExamResultContainer>
      <div>
        <s.Title>
          Correct answers: {correctAnswersCount} / {totalAnswersCount}
        </s.Title>
        <s.Title>Percentage: {percentage}%</s.Title>
      </div>
      {examResult.exam.questions.map((question: any, index: number) => (
        <div key={index}>
          {index + 1}.- {question.text}
          {question.answers.map((answer: Answer, index: number) => (
            <s.Answer
              correct={index === question.correctAnswer}
              wrong={
                question.selectedAnswers[0].selectedAnswer === index &&
                index !== question.correctAnswer
              }
              right={
                question.selectedAnswers[0].selectedAnswer === index &&
                index === question.correctAnswer
              }
              key={index}
            >
              {answer.text}
            </s.Answer>
          ))}
        </div>
      ))}
    </s.ExamResultContainer>
  );
};

export default ExamResult;
