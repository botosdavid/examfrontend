import { getExamCorrectAnswers } from "@/utils/api/get";
import { resultExam } from "@/utils/querykeys/querykeys";
import { CircularProgress } from "@mui/material";
import { Answer, Question } from "@prisma/client";
import { useEffect } from "react";
import { useQuery } from "react-query";
import * as s from "./ExamResultAtom";
import { noSelectedAnswer } from "../Kviz/Kviz";

interface ExamResultProps {
  code: string;
}

const ExamResult = ({ code }: ExamResultProps) => {
  const { data: examResult, isLoading } = useQuery([resultExam, { code }], () =>
    getExamCorrectAnswers(code)
  );

  useEffect(() => {
    getExamCorrectAnswers(code).then(console.log);
  }, []);

  if (isLoading) return <CircularProgress />;

  const correctAnswersCount = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: any }) =>
      sum +
      Number(curr.correctAnswer === curr?.selectedAnswers[0]?.selectedAnswer),
    0
  );

  const points = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: any }) => {
      const selectedAnswer = curr.selectedAnswers[0]?.selectedAnswer;
      const correct = curr.correctAnswer === selectedAnswer;
      const skipped = selectedAnswer === noSelectedAnswer;
      return sum + (correct ? 1 : skipped ? 0 : -1);
    },
    0
  );

  const totalAnswersCount = examResult?.exam.questions.length;
  const percentage = Math.round(
    (correctAnswersCount / totalAnswersCount) * 100
  );

  return (
    <s.ExamResultContainer>
      <div>
        <s.Title>
          Correct answers: {correctAnswersCount} / {totalAnswersCount}
        </s.Title>
        <s.Title>Percentage: {percentage}%</s.Title>
        <s.Title>Points: {points}</s.Title>
      </div>
      {examResult.exam.questions.map((question: any, index: number) => (
        <s.QuestionContainer key={index}>
          <s.Points>
            {question.selectedAnswers[0]?.selectedAnswer ===
            question.correctAnswer
              ? "+ 1"
              : question.selectedAnswers[0]?.selectedAnswer === noSelectedAnswer
              ? "+ 0"
              : "- 1"}
          </s.Points>
          <s.QuestionText>
            {index + 1}.- {question.text}
          </s.QuestionText>
          {question.answers.map((answer: Answer, index: number) => (
            <s.Answer
              correct={index === question.correctAnswer}
              wrong={
                question.selectedAnswers[0]?.selectedAnswer === index &&
                index !== question.correctAnswer
              }
              right={
                question.selectedAnswers[0]?.selectedAnswer === index &&
                index === question.correctAnswer
              }
              key={index}
            >
              {answer.text}
            </s.Answer>
          ))}
        </s.QuestionContainer>
      ))}
    </s.ExamResultContainer>
  );
};

export default ExamResult;
