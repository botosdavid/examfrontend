import { getExamResults } from "@/utils/api/get";
import { examResults } from "@/utils/querykeys/querykeys";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as s from "./ExamResultsAtom";
import Button from "../Button/Button";
import { Bar, Doughnut, getElementAtEvent } from "react-chartjs-2";
import "chart.js/auto";
import { theme } from "@/styles/theme";
import { useRef, useState } from "react";

interface ExamResultsProps {
  code: string;
}

const ExamResults = ({ code }: ExamResultsProps) => {
  const router = useRouter();
  const barChartRef = useRef();
  const [questionIndex, setQuestionIndex] = useState(0);

  const { data: examResult, isLoading } = useQuery(examResults, () =>
    getExamResults(code)
  );

  if (isLoading) return <CircularProgress />;

  const handleGoToExamResult = (code: string, userId: string) => {
    router.push(`/exam/${code}/results/${userId}`);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
  const doughnutChartOptions: any = {
    plugins: {
      legend: { position: "right" },
      tooltip: {
        callbacks: {
          footer: (tooltipItem: any) =>
            examResult.questionsCorrectAnswers[questionIndex].answers[
              tooltipItem[0].dataIndex
            ].text,
        },
      },
    },
  };

  const handleBarChartClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!getElementAtEvent(barChartRef.current!, e).length) return;
    setQuestionIndex(getElementAtEvent(barChartRef.current!, e)[0].index);
  };

  return (
    <>
      Results of {code}
      <s.BarChart>
        <Bar
          ref={barChartRef}
          onClick={handleBarChartClick}
          options={options}
          width={10}
          height={2}
          datasetIdKey="1"
          data={{
            labels: examResult.questionsCorrectAnswers.map(
              (question: QuestionStatistics) => `Question ${question.index + 1}`
            ),
            datasets: [
              {
                label: "Correct answers for questions",
                data: examResult.questionsCorrectAnswers.map(
                  (question: QuestionStatistics) => question.correctAnswerCount
                ),
                backgroundColor: theme.greenChart.color,
                borderColor: theme.greenChart.border,
                borderWidth: 1,
              },
              {
                label: "Skipped answers for questions",
                data: examResult.questionsCorrectAnswers.map(
                  (question: QuestionStatistics) => question.skippedAnswerCount
                ),
                backgroundColor: theme.yellowChart.color,
                borderColor: theme.yellowChart.border,
                borderWidth: 1,
              },
              {
                label: "Wrong answers for questions",
                data: examResult.questionsCorrectAnswers.map(
                  (question: QuestionStatistics) => question.wrongAnswerCount
                ),
                backgroundColor: theme.redChart.color,
                borderColor: theme.redChart.border,
                borderWidth: 1,
              },
            ],
          }}
        />
      </s.BarChart>
      <s.DetailsContainer>
        <s.DoughnutChart>
          <Doughnut
            options={doughnutChartOptions}
            data={{
              labels: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
              datasets: [
                {
                  data: examResult.allQuestionStatistics[questionIndex],
                  backgroundColor: [
                    theme.redChart.color,
                    theme.yellowChart.color,
                    theme.greenChart.color,
                    theme.orangeChart.color,
                  ],
                  borderColor: [
                    theme.redChart.border,
                    theme.yellowChart.border,
                    theme.greenChart.border,
                    theme.orangeChart.border,
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </s.DoughnutChart>
        <s.Highlights>
          <s.HighlightElement>
            Highest:
            <s.HighlightValue>
              {examResult.correctAnswersHighlight.highest}
              <CheckIcon />
            </s.HighlightValue>
          </s.HighlightElement>
          <s.HighlightElement>
            Average:
            <s.HighlightValue>
              {(
                examResult.correctAnswersHighlight.sum /
                (examResult.correctAnswersHighlight.count || 1)
              ).toFixed(2)}
              <CheckIcon />
            </s.HighlightValue>
          </s.HighlightElement>
          <s.HighlightElement>
            Lowerst:
            <s.HighlightValue>
              {examResult.correctAnswersHighlight.lowest}
              <CheckIcon />
            </s.HighlightValue>
          </s.HighlightElement>
        </s.Highlights>
      </s.DetailsContainer>
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
    </>
  );
};

export default ExamResults;
