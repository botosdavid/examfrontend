import Button from "../Button/Button";
import * as s from "./ExamAtom";

const Exam = ({ exam }: any) => {
  const currentDate = new Date().toISOString().slice(0.1);
  const examDate = exam.date.slice(0, 10);
  const hasStarted = currentDate > examDate;

  return (
    <s.ExamContainer>
      <s.ExamName>{exam.name}</s.ExamName>
      <s.ExamInfoContainer>
        {hasStarted && (
          <Button secondary onClick={() => {}}>
            Start Exam
          </Button>
        )}
        <s.ExamDate> {exam.date.slice(0, 10)}</s.ExamDate>
      </s.ExamInfoContainer>
    </s.ExamContainer>
  );
};

export default Exam;
