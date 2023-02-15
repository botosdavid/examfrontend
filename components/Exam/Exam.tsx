import { Exam as IExam } from "@prisma/client";
import { useRouter } from "next/router";
import Button from "../Button/Button";
import * as s from "./ExamAtom";

interface ExamProps {
  exam: IExam;
}

const Exam = ({ exam }: ExamProps) => {
  const currentDate = new Date().toISOString().slice(0.1);
  const examDate = exam.date.toString().slice(0, 10);
  const hasStarted = currentDate > examDate;
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/exam/${exam.code}`)
  }

  return (
    <s.ExamContainer>
      <s.ExamName>{exam.name}</s.ExamName>
      <s.ExamInfoContainer>
        {hasStarted && (
          <Button secondary onClick={handleStartExam}>
            Start Exam
          </Button>
        )}
        <s.ExamDate>{examDate}</s.ExamDate>
      </s.ExamInfoContainer>
    </s.ExamContainer>
  );
};

export default Exam;
