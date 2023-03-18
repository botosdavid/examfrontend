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

type ExtendedQuestion = Question & {
  selectedAnswers: SelectedAnswer[];
  answers: Answer[];
};

const ExamResult = ({ code }: ExamResultProps) => {
  const { data: examResult, isLoading } = useQuery([resultExam, { code }], () =>
    getExamCorrectAnswers(code)
  );

  useEffect(() => {
    getExamCorrectAnswers(code).then(console.log);
  }, []);

  if (isLoading) return <CircularProgress />;

  const correctAnswersCount = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: SelectedAnswer[] }) =>
      sum +
      Number(curr.correctAnswer === curr?.selectedAnswers[0]?.selectedAnswer),
    0
  );

  const points = examResult?.exam?.questions?.reduce(
    (sum: number, curr: Question & { selectedAnswers: SelectedAnswer[] }) => {
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

  const isInPhaseOne = (question: Question) =>
    question.group === examResult.exam.subscribers[0].group;
  const isInPhaseTwo = (question: Question) =>
    question.group !== examResult.exam.subscribers[0].group;

  const phaseTwoIndex = examResult.exam.questions.findIndex(isInPhaseTwo);

  const phaseOnePoints = examResult.exam.questions
    .filter(isInPhaseOne)
    .reduce(
      (sum: number, curr: Question & { selectedAnswers: SelectedAnswer[] }) => {
        const selectedAnswer = curr.selectedAnswers[0]?.selectedAnswer;
        const correct = curr.correctAnswer === selectedAnswer;
        const skipped = selectedAnswer === noSelectedAnswer;
        return sum + (correct ? 1 : skipped ? 0 : -1);
      },
      0
    );

  const wasPhaseTwoMistake = examResult.exam.questions
    .filter(isInPhaseTwo)
    .some(
      (question: ExtendedQuestion) =>
        question.selectedAnswers.length &&
        question.correctAnswer !== question.selectedAnswers[0].selectedAnswer
    );

  const correctAnswersInPhaseTwo = examResult.exam.questions
    .filter(isInPhaseTwo)
    .reduce(
      (acc: number, curr: ExtendedQuestion) =>
        acc +
        Number(
          curr.selectedAnswers.length &&
            curr.correctAnswer === curr.selectedAnswers[0].selectedAnswer
        ),
      0
    );

  const getLastReachedLevelIndex = examResult.exam.levels
    .split(",")
    .reduce(
      (acc: number, curr: string, index: number) =>
        curr && index < correctAnswersInPhaseTwo ? index : acc,
      0
    );

  const phaseTwoPoints = wasPhaseTwoMistake
    ? getLastReachedLevelIndex
    : correctAnswersInPhaseTwo;

  return (
    <s.ExamResultContainer>
      <div>
        <s.Title>
          Correct answers: {correctAnswersCount} / {totalAnswersCount}
        </s.Title>
        <s.Title>Percentage: {percentage}%</s.Title>
        <s.Title>Points: {points}</s.Title>
        <s.Title>Phase #1: {phaseOnePoints}</s.Title>
        <s.Title>Phase #2: {phaseTwoPoints}</s.Title>
      </div>
      <hr />
      <s.PhaseTitle>Phase #1</s.PhaseTitle>
      {examResult.exam.questions.map(
        (question: ExtendedQuestion, index: number) => (
          <div key={index}>
            {index === phaseTwoIndex && <s.PhaseTitle>Phase #2</s.PhaseTitle>}
            <s.QuestionContainer>
              <s.Points>
                {question.selectedAnswers[0]?.selectedAnswer ===
                question.correctAnswer
                  ? "+ 1"
                  : question.selectedAnswers[0]?.selectedAnswer ===
                    noSelectedAnswer
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
          </div>
        )
      )}
    </s.ExamResultContainer>
  );
};

export default ExamResult;
