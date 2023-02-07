import * as s from "./ExamCreatorAtom";

const ExamCreator = () => {
  const examMockData = {
    name: "examname",
    questions: [],
    code: "123456",
  };

  const handleCreateExam = async () => {
    const response = await fetch("/api/exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examMockData),
    });
    if (response.status !== 200) return;
  };

  return (
    <s.ExamCreatorButton onClick={handleCreateExam}>
      Create new exam
    </s.ExamCreatorButton>
  );
};

export default ExamCreator;
