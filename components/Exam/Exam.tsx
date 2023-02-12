import * as s from "./ExamAtom";

const Exam = ({ exam }: any) => {
  return (
    <s.ExamContainer>
      <s.ExamName>{exam.name}</s.ExamName>
      <s.ExamDate> {exam.date.slice(0, 10)}</s.ExamDate>
    </s.ExamContainer>
  );
};

export default Exam;
