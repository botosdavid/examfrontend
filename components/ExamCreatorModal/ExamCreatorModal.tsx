import { ChangeEvent, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
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
import { Exam } from "@prisma/client";

const defaultAnswerCount = 4;

interface ExamCreatorModalProps {
  exam?: Exam;
  onClose: () => void;
}

const ExamCreatorModal = ({ onClose, exam }: ExamCreatorModalProps) => {
  const [name, setName] = useState(exam?.name || "");
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
      {
        text: "",
        correctAnswer: 0,
        answers: Array(defaultAnswerCount).fill({ text: "" }),
      },
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

  const handleDeleteQuestion = (questionIndex: number) => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
  };

  return (
    <Modal
      title="Enter New Exam Details"
      width="60vw"
      height="90vh"
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
      Select the right answer for every question by clicking on it.
      {questions.map((question, index) => (
        <div key={index}>
          <CustomInput
            label={`${index + 1}. Question`}
            value={question.text}
            onChange={(e) => handleQuestionChange(e, index)}
          />
          <Button onClick={() => handleDeleteQuestion(index)} secondary>
            <DeleteRoundedIcon />
          </Button>
          <br />
          {question.answers.map((answer, answerIndex) => (
            <CustomInput
              selected={answerIndex === question.correctAnswer}
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

export default ExamCreatorModal;
