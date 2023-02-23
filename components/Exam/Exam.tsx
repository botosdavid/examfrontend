import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Exam as IExam } from "@prisma/client";
import { useRouter } from "next/router";
import Button from "../Button/Button";
import * as s from "./ExamAtom";
import { useState } from "react";

interface ExamProps {
  exam: IExam;
  canEdit?: boolean;
}

const Exam = ({ exam, canEdit }: ExamProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentDate = new Date().toISOString().slice(0.1);
  const examDate = exam.date.toString().slice(0, 10);
  const hasStarted = currentDate > examDate;
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/exam/${exam.code}`);
  };

  const handleEditExam = () => {
    setIsEditModalOpen(true);
  };

  return (
    <s.ExamContainer>
      <s.ExamName>{exam.name}</s.ExamName>
      <s.ExamInfoContainer>
        {canEdit && (
          <Button secondary onClick={handleEditExam}>
            <EditRoundedIcon />
          </Button>
        )}
        {hasStarted && (
          <Button secondary onClick={handleStartExam}>
            <PlayCircleFilledRoundedIcon />
          </Button>
        )}
        <s.ExamDate>{examDate}</s.ExamDate>
      </s.ExamInfoContainer>
    </s.ExamContainer>
  );
};

export default Exam;
