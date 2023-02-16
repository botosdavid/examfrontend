import * as s from "./ExamCreatorAtom";
import { ChangeEvent, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";
import { notifyCreatedSuccessfully } from "../../utils/toast/toastify";
import Button from "../Button/Button";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";
import moment, { Moment } from "moment";
import { queryClient } from "@/pages/_app";
import { useMutation } from "react-query";
import { createExam } from "@/utils/api/post";
import { createdExams } from "@/utils/querykeys/querykeys";

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

const ExamCreatorModal = ({ onClose }: ExamCreatorModalProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Moment | null>(moment());
  const [questions, setQuestions] = useState<CreateQuestion[]>([]);

  const createExamMutation = useMutation(createExam, {
    onSuccess: () => {
      queryClient.invalidateQueries(createdExams);
      notifyCreatedSuccessfully();
      onClose();
    },
  });

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

  const handleDateChange = (date: Moment | null) => setDate(date);

  const handleCorrectAnswerChange = (
    questionIndex: number,
    correctAnswer: number
  ) => {
    setQuestions(
      questions.map((question, index) => {
        if (index !== questionIndex) return question;
        return { ...question, correctAnswer };
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
      <DesktopDatePicker
        label="Date desktop"
        inputFormat="MM/DD/YYYY"
        value={date}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
      <TimePicker
        label="Time"
        value={date}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
      <CustomInput
        label="Exam Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {questions.map((question, index) => (
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
              onClick={() => handleCorrectAnswerChange(index, answerIndex)}
            />
          ))}
        </div>
      ))}
      <Button secondary onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Button
        onClick={() => createExamMutation.mutate({ name, date, questions })}
      >
        Create
      </Button>
    </Modal>
  );
};

export default ExamCreator;
