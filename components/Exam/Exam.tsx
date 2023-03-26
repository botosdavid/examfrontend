import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import Button from "../Button/Button";
import * as s from "./ExamAtom";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ExamCreatorModal from "../ExamCreatorModal/ExamCreatorModal";
import moment from "moment";
import ExamInfoModal from "../ExamInfoModal/ExamInfoModal";
import { useMutation } from "react-query";
import { startExam } from "@/utils/api/patch";

interface ExamProps {
  exam: ExamListItem;
  isSubscribed?: boolean;
}

const Exam = ({ exam, isSubscribed }: ExamProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const currentDate = moment.utc(new Date()).startOf("minute");
  const examDate = moment.utc(exam.date).startOf("minute");
  const hasStarted = currentDate >= examDate;
  const router = useRouter();
  const session: AuthSession = useSession();
  const canEdit =
    session.data?.user.id === exam.authorId ||
    session.data?.user.role === Role.ADMIN;

  const startExamMutation = useMutation(startExam, {
    onSuccess: () => router.push(`/exam/${exam.code}`),
  });

  const handleEditExam = () => {
    setIsEditModalOpen(true);
  };

  const handleGoToExamResults = () => {
    router.push(`/exam/${exam.code}/results`);
  };

  return (
    <s.ExamContainer>
      <s.ExamName>{exam.name}</s.ExamName>
      <s.ExamInfoContainer>
        {exam?._count?.questions && (
          <s.QuestionCount>
            {exam._count.questions}
            <HelpOutlineIcon />
          </s.QuestionCount>
        )}
        {canEdit && (
          <Button small secondary onClick={handleGoToExamResults}>
            <BarChartIcon />
          </Button>
        )}
        <Button small secondary onClick={() => setIsInfoModalOpen(true)}>
          <QrCodeScannerIcon />
        </Button>
        {canEdit && (
          <Button small secondary onClick={handleEditExam}>
            <EditRoundedIcon />
          </Button>
        )}
        {isSubscribed && hasStarted && (
          <Button
            small
            secondary
            onClick={() => startExamMutation.mutate(exam.code)}
          >
            <PlayCircleFilledRoundedIcon />
          </Button>
        )}
        <s.ExamDate>{examDate.local().format("YY/MM/DD HH:mm")}</s.ExamDate>
        <ScheduleIcon />
      </s.ExamInfoContainer>
      {isEditModalOpen && (
        <ExamCreatorModal
          exam={exam}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isInfoModalOpen && (
        <ExamInfoModal exam={exam} onClose={() => setIsInfoModalOpen(false)} />
      )}
    </s.ExamContainer>
  );
};

export default Exam;
