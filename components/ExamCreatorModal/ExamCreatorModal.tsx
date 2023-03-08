import { ChangeEvent, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  notifyCreatedSuccessfully,
  notifyUpdatedSuccessfully,
} from "../../utils/toast/toastify";
import Button from "../Button/Button";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { CircularProgress, TextField } from "@mui/material";
import moment, { Moment } from "moment";
import { queryClient } from "@/pages/_app";
import { useMutation, useQuery } from "react-query";
import { createExam } from "@/utils/api/post";
import { createdExams, fullExam } from "@/utils/querykeys/querykeys";
import { Exam, Group } from "@prisma/client";
import { getExam } from "@/utils/api/get";
import { updateExam } from "@/utils/api/put";
import * as s from "./ExamCreatorModalAtom";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import { uploadImage } from "@/utils/firebase/upload";

const defaultAnswerCount = 4;

interface ExamCreatorModalProps {
  exam?: Exam;
  onClose: () => void;
}

const ExamCreatorModal = ({ onClose, exam }: ExamCreatorModalProps) => {
  const [name, setName] = useState(exam?.name || "");
  const [date, setDate] = useState<Moment | null>(moment(exam?.date));
  const [questions, setQuestions] = useState<CreateQuestion[]>([]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const { isLoading } = useQuery(
    [fullExam, exam?.code],
    () => getExam(exam!.code),
    {
      enabled: !!exam,
      onSuccess: (data) => {
        setQuestions(data.questions);
      },
    }
  );

  const updateExamMutation = useMutation(updateExam, {
    onSuccess: () => {
      queryClient.invalidateQueries(createdExams);
      notifyUpdatedSuccessfully();
      onClose();
    },
  });

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
        group: Group.A,
        answers: Array(defaultAnswerCount).fill({ text: "" }),
        image: "",
        imageFile: new File([], ""),
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

  const handleQuestionGroupChange = (questionIndex: number) => {
    setQuestions(
      questions.map((question, index) => {
        if (index != questionIndex) return question;
        return {
          ...question,
          group: question.group === Group.A ? Group.B : Group.A,
        };
      })
    );
  };

  const handleImageChange = (questionIndex: number, e: ChangeEvent<any>) => {
    setQuestions(
      questions.map((question, index) => {
        if (index !== questionIndex) return question;
        return { ...question, imageFile: e.target.files[0] };
      })
    );
  };

  // TODO: refactor
  const handleSave = async () => {
    const imageUrls: string[] = [];
    for (const question of questions) {
      if (!question.imageFile?.name) {
        imageUrls.push("");
      } else {
        const imageUrl = await uploadImage(question.imageFile);
        imageUrls.push(imageUrl);
      }
    }
    const questionsToSave = questions
      .map((question, index) => {
        if (!imageUrls[index]) return question;
        return { ...question, image: imageUrls[index] };
      })
      .map(({ imageFile, ...other }) => other);

    createExamMutation.mutate({ name, date, questions: questionsToSave });
  };

  if (isLoading) return <CircularProgress />;

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
        <s.QuestionContainer key={index}>
          <img
            style={{ gridColumn: "span 2", width: "100%" }}
            src={question.image}
          />
          <s.QuestionEditContainer>
            <b>A</b>
            <CustomSwitch
              checked={question.group === Group.B}
              onChange={() => handleQuestionGroupChange(index)}
            />
            <b>B</b>
            <Button onClick={() => handleDeleteQuestion(index)} secondary>
              <DeleteRoundedIcon />
            </Button>
          </s.QuestionEditContainer>
          <br />
          <CustomInput
            label={`${index + 1}. Question`}
            value={question.text}
            onChange={(e) => handleQuestionChange(e, index)}
          />
          <CustomInput
            type="file"
            onChange={(e) => handleImageChange(index, e)}
          />
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
        </s.QuestionContainer>
      ))}
      <Button secondary onClick={handleAddQuestion}>
        Add Question
      </Button>
      <Button
        onClick={() =>
          exam
            ? updateExamMutation.mutate({
                code: exam.code,
                questions,
                name,
                date,
              })
            : handleSave()
        }
      >
        {exam ? "Update" : "Create"}
      </Button>
    </Modal>
  );
};

export default ExamCreatorModal;
