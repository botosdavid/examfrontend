import { getExamResults } from "@/utils/api/get";
import { examResults } from "@/utils/querykeys/querykeys";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as s from "./ExamResultsAtom";
import Button from "../Button/Button";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { theme } from "@/styles/theme";

interface ExamResultsProps {
  code: string;
}

interface QuestionCorrectAnswers {
  index: number;
  correctAnswerCount: number;
  skippedAnswerCount: number;
  text: string;
}

const ExamResults = ({ code }: ExamResultsProps) => {
  const router = useRouter();

  const { data: examResult, isLoading } = useQuery(examResults, () =>
    getExamResults(code)
  );

  if (isLoading) return <CircularProgress />;

  const handleGoToExamResult = (code: string, userId: string) => {
    router.push(`/exam/${code}/results/${userId}`);
  };

  const options = {
    scales: {
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: (tooltipItem: any) =>
            examResult.questionsCorrectAnswers[tooltipItem[0].parsed.x].text,
        },
      },
    },
  };

  return (
    <div>
      Results of {code}
      <s.Chart>
        <Bar
          options={options}
          width={10}
          height={2}
          datasetIdKey="1"
          data={{
            labels: examResult.questionsCorrectAnswers.map(
              (question: QuestionCorrectAnswers) =>
                `Question ${question.index + 1}`
            ),
            datasets: [
              {
                label: "Correct answers for questions",
                data: examResult.questionsCorrectAnswers.map(
                  (question: QuestionCorrectAnswers) =>
                    question.correctAnswerCount
                ),
                backgroundColor: theme.chartBackgroundColor,
                borderColor: theme.chartBorderColor,
                borderWidth: 1,
              },
              {
                label: "Skipped answers for questions",
                data: examResult.questionsCorrectAnswers.map(
                  (question: QuestionCorrectAnswers) =>
                    question.skippedAnswerCount
                ),
                backgroundColor: theme.chartBackgroundColor,
                borderColor: theme.chartBorderColor,
                borderWidth: 1,
              },
            ],
          }}
        />
      </s.Chart>
      <br />
      <h2>Students subscribed</h2>
      <br />
      <s.SubscriberList>
        {examResult.exam.subscribers.map((subscriber: any, index: number) => (
          <s.Subscriber key={index}>
            <s.SubscriberInfo>
              <PersonIcon />
              {subscriber.user.neptun} - {subscriber.user.name}
            </s.SubscriberInfo>
            <Button
              secondary
              small
              onClick={() => handleGoToExamResult(code, subscriber.user.id)}
            >
              <VisibilityIcon />
            </Button>
          </s.Subscriber>
        ))}
      </s.SubscriberList>
    </div>
  );
};

export default ExamResults;
