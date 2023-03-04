import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Exam as IExam, Role } from "@prisma/client";
import { useRouter } from "next/router";
import Button from "../Button/Button";
import * as s from "./ExamAtom";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ExamCreatorModal from "../ExamCreatorModal/ExamCreatorModal";
import moment from "moment";

interface ExamProps {
  exam: IExam;
}

const Exam = ({ exam }: ExamProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentDate = new Date().toISOString().slice(0.1);
  const examDate = exam.date.toString();
  const hasStarted = currentDate > examDate;
  const router = useRouter();
  const session: AuthSession = useSession();
  const canEdit =
    session.data?.user.id === exam.authorId ||
    session.data?.user.role === Role.ADMIN;

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
          <Button small secondary onClick={handleEditExam}>
            <EditRoundedIcon />
          </Button>
        )}
        {hasStarted && (
          <Button small secondary onClick={handleStartExam}>
            <PlayCircleFilledRoundedIcon />
          </Button>
        )}
        <s.ExamDate>{moment(examDate).format("YY/MM/DD HH:mm")}</s.ExamDate>
      </s.ExamInfoContainer>
      {isEditModalOpen && (
        <ExamCreatorModal
          exam={exam}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </s.ExamContainer>
  );
};

export default Exam;
