import { getExamResults } from "@/utils/api/get";
import { examResults } from "@/utils/querykeys/querykeys";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

interface ExamResultsProps {
  code: string;
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

  return (
    <div>
      Results of {code}
      <h2>Students subscribed</h2>
      {examResult.exam.subscribers.map((subscriber: any, index: number) => (
        <div
          key={index}
          onClick={() => handleGoToExamResult(code, subscriber.user.id)}
        >
          {subscriber.user.neptun} - {subscriber.user.name}
        </div>
      ))}
    </div>
  );
};

export default ExamResults;
