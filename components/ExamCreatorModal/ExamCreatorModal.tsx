import { ChangeEvent, useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import CustomInput from "../CustomInput/CustomInput";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  notifyCreatedSuccessfully,
  notifyDeletedSuccessfully,
  notifyUpdatedSuccessfully,
} from "../../utils/toast/toastify";
import Button from "../Button/Button";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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
import { uploadImages } from "@/utils/firebase/upload";
import Image from "next/image";
import { examCreateSchema } from "@/utils/validation/schema";
import { ZodFormattedError } from "zod";
import FormHelperText from "@mui/material/FormHelperText";
import type { examCreateSchemaType } from "../../utils/validation/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../Loading/Loading";
import { deleteExam } from "@/utils/api/delete";
import ExamDeletion from "../ExamDeletion/ExamDeletion";

const defaultAnswerCount = 4;

interface ExamCreatorModalProps {
  exam?: Exam;
  onClose: () => void;
}

const ExamCreatorModal = ({ onClose, exam }: ExamCreatorModalProps) => {
  const [name, setName] = useState(exam?.name || "");
  const [date, setDate] = useState<Moment | null>(
    moment.utc(exam?.date).local()
  );
  const [questions, setQuestions] = useState<CreateQuestion[]>([]);
  const [levels, setLevels] = useState<number[]>([]);
  const [ip, setIp] = useState("");
  const [errors, setErrors] =
    useState<ZodFormattedError<examCreateSchemaType>>();

  const [animationParent] = useAutoAnimate();

  const levelsMinCount = Math.min(
    questions.filter(({ group }) => group === Group.A).length,
    questions.filter(({ group }) => group === Group.B).length
  );
  useEffect(() => {
    if (levelsMinCount > levels.length) setLevels([...levels, 0]);
    if (levelsMinCount < levels.length) setLevels(levels.slice(0, -1));
  }, [levelsMinCount]);

  const { isLoading } = useQuery(
    [fullExam, exam?.code],
    () => getExam(exam!.code),
    {
      enabled: !!exam,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setQuestions(
          data.questions.map((question: CreateQuestion) => ({
            ...question,
            imageFile: new File([], ""),
          }))
        );
        setLevels(
          data?.levels.split(",").map((level: string) => Number(level))
        );
        setIp(data.ip);
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

  const uploadImagesMutation = useMutation(uploadImages, {
    onSuccess: (questions) =>
      !exam
        ? createExamMutation.mutate({
            name,
            date,
            questions,
            levels,
            ip,
          })
        : updateExamMutation.mutate({
            code: exam.code,
            questions,
            levels,
            name,
            date,
            ip,
          }),
  });

  const deleteExamMutation = useMutation(deleteExam, {
    onSuccess: () => {
      queryClient.invalidateQueries(createdExams);
      notifyDeletedSuccessfully();
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

  const handleLevelChange = (levelIndex: number) => {
    setLevels(
      levels.map((level, index) => {
        return index === levelIndex ? Number(!level) : level;
      })
    );
  };

  const handleSubmit = () => {
    const result = examCreateSchema.safeParse({
      name,
      date,
      levels,
      questions,
      ip,
    });
    if (!result.success) return setErrors(result.error.format());
    uploadImagesMutation.mutate(questions);
  };

  const title = (
    <>
      Exam Details
      <ExamDeletion onConfirm={() => deleteExamMutation.mutate(exam!.code)} />
    </>
  );

  return (
    <Modal title={title} width="60vw" height="90vh" onClose={onClose}>
      {isLoading ||
      uploadImagesMutation.isLoading ||
      createExamMutation.isLoading ||
      updateExamMutation.isLoading ? (
        <Loading />
      ) : (
        <>
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={handleDateChange}
            renderInput={(params) => <CustomInput {...params} />}
          />
          <TimePicker
            label="Time"
            value={date}
            onChange={handleDateChange}
            renderInput={(params) => <CustomInput {...params} />}
          />
          <CustomInput
            label="Exam Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors?.name?._errors?.[0]}
            helperText={errors?.name?._errors?.[0]}
          />
          <CustomInput
            label="Allowed IP address"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            error={!!errors?.ip?._errors?.[0]}
            helperText={errors?.ip?._errors?.[0]}
          />
          Select the right answer for every question by clicking on it.
          <div ref={animationParent}>
            {questions.map((question, index) => (
              <s.QuestionContainer key={index}>
                <s.QuestionEditContainer>
                  <div>
                    <b>A</b>
                    <CustomSwitch
                      checked={question.group === Group.B}
                      onChange={() => handleQuestionGroupChange(index)}
                    />
                    <b>B</b>
                  </div>
                  <Button
                    onClick={() => handleDeleteQuestion(index)}
                    secondary
                    small
                    danger
                  >
                    <DeleteRoundedIcon />
                  </Button>
                </s.QuestionEditContainer>
                <s.ImageWrapper>
                  {(question.imageFile?.name || question.image) && (
                    <Image
                      alt=""
                      width="400"
                      height="100"
                      unoptimized
                      src={
                        question.imageFile?.name
                          ? URL.createObjectURL(question.imageFile)
                          : question.image
                      }
                    />
                  )}
                </s.ImageWrapper>
                <CustomInput
                  label={`${index + 1}. Question`}
                  value={question.text}
                  onChange={(e) => handleQuestionChange(e, index)}
                  error={!!errors?.questions?.[index]?.text?._errors?.[0]}
                  helperText={errors?.questions?.[index]?.text?._errors?.[0]}
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
                    onClick={() =>
                      handleCorrectAnswerChange(index, answerIndex)
                    }
                    error={
                      !!errors?.questions?.[index]?.answers?.[answerIndex]?.text
                        ?._errors?.[0]
                    }
                    helperText={
                      errors?.questions?.[index]?.answers?.[answerIndex]?.text
                        ?._errors?.[0]
                    }
                  />
                ))}
              </s.QuestionContainer>
            ))}
          </div>
          <Button secondary onClick={handleAddQuestion}>
            <AddIcon />
            Add Question
          </Button>
          {errors?.questions?._errors?.[0] && (
            <FormHelperText error>
              {errors?.questions?._errors?.[0]}
            </FormHelperText>
          )}
          Where should the levels be?
          {levels.map((level, index) => (
            <div key={index}>
              {index + 1}
              <CustomSwitch
                checked={Boolean(level)}
                onChange={() => handleLevelChange(index)}
              />
            </div>
          ))}
          {errors?.levels?._errors?.[0] && (
            <FormHelperText error>
              {errors?.levels?._errors?.[0]}
            </FormHelperText>
          )}
          <Button onClick={handleSubmit}>{exam ? "Update" : "Create"}</Button>
        </>
      )}
    </Modal>
  );
};

export default ExamCreatorModal;
