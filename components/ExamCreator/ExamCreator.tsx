import * as s from "./ExamCreatorAtom";
import { ChangeEvent, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";

const examMockData = {
  name: "examname",
  questions: [],
  code: "123456",
};

const ExamCreator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <s.ExamCreatorButton onClick={() => setIsModalOpen(true)}>
        Create new exam
      </s.ExamCreatorButton>
      {isModalOpen && <ExamCreatorModal />}
    </>
  );
};

const ExamCreatorModal = () => {
  const [examName, setExamName] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

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

  const handleAddQuestion = () => setQuestions([...questions, ""]);

  const handleQuestionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    setQuestions(
      questions.map((question, questionIndex) =>
        index === questionIndex ? e.target.value : question
      )
    );
  };

  return (
    <Modal title="Enter New Exam Details" width="60vw" height="60vh">
      <CustomInput
        label="Exam Name"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
      />
      {questions.map((question, index) => (
        <div key={index}>
          <CustomInput
            label={`${index + 1}. Question`}
            value={questions[index]}
            onChange={(e) => handleQuestionChange(e, index)}
          />
          {[...Array(4)].map((_, index) => (
            <input key={index} placeholder={`${index + 1}. Answer`} />
          ))}
        </div>
      ))}
      <button onClick={handleAddQuestion}>Add Question</button>
    </Modal>
  );
};

export default ExamCreator;
