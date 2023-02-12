import * as s from "./ExamCreatorAtom";
import { ChangeEvent, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";
import { notifyCreatedSuccessfully } from "../../utils/toast/toastify";
import Button from "../Button/Button";

const defaultAnserCount = 4;

const ExamCreator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <s.ExamCreatorButton onClick={() => setIsModalOpen(true)}>
        Create new exam
      </s.ExamCreatorButton>
      {isModalOpen && (
        <ExamCreatorModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

interface ExamCreatorModalProps {
  onClose: () => void;
}

interface Exam {
  name: string;
}

interface Question {
  text: string;
  answers: Answer[];
}

interface Answer {
  text: string;
}

const ExamCreatorModal = ({ onClose }: ExamCreatorModalProps) => {
  const [examName, setExamName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleCreateExam = async () => {
    const response = await fetch("/api/exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: examName, questions }),
    });
    if (response.status !== 200) return;
    notifyCreatedSuccessfully();
    onClose();
  };

  const handleAddQuestion = () =>
    setQuestions([
      ...questions,
      { text: "", answers: Array(defaultAnserCount).fill({ text: "" }) },
    ]);

  const handleQuestionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number
  ) => {
    setQuestions(
      questions.map((question, index) =>
        index === questionIndex
          ? { ...question, text: e.target.value }
          : question
      )
    );
  };

  const handleAnswerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
    answerIndex: number
  ) => {
    setQuestions(
      questions.map((question, index) => {
        if (index !== questionIndex) return question;
        const answers = question.answers.map((answer, index) =>
          index === answerIndex ? { text: e.target.value } : answer
        );
        return { ...question, answers };
      })
    );
  };

  return (
    <Modal
      title="Enter New Exam Details"
      width="60vw"
      height="80vh"
      onClose={onClose}
    >
      <CustomInput
        label="Exam Name"
        value={examName}
        onChange={(e) => setExamName(e.target.value)}
      />
      {questions.map((question: Question, index) => (
        <div key={index}>
          <CustomInput
            label={`${index + 1}. Question`}
            value={question.text}
            onChange={(e) => handleQuestionChange(e, index)}
          />
          {question.answers.map((answer, answerIndex) => (
            <input
              key={answerIndex}
              placeholder={`${answerIndex + 1}. Answer`}
              value={answer.text}
              onChange={(e) => handleAnswerChange(e, index, answerIndex)}
            />
          ))}
        </div>
      ))}
      <Button secondary onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Button onClick={handleCreateExam}>Create</Button>
    </Modal>
  );
};

export default ExamCreator;
