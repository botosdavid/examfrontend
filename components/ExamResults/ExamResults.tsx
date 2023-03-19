import { getExamResults } from "@/utils/api/get";
import { examResults } from "@/utils/querykeys/querykeys";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as s from "./ExamResultsAtom";
import Button from "../Button/Button";

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
