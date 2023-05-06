import * as s from "./ExamSubscriberAtom";
import { useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AuthCode from "react-auth-code-input";
import Modal from "../Modal/Modal";
import {
  notifySubscribedNotFound,
  notifySubscribedSuccessfully,
} from "@/utils/toast/toastify";
import { subscribeToExam } from "@/utils/api/patch";
import Button from "../Button/Button";
import { useMutation } from "react-query";
import { queryClient } from "@/pages/_app";
import { subscribedExams } from "@/utils/querykeys/querykeys";

const ExamSubscriber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <NotificationsNoneIcon />
        Add Exam
      </Button>
      {isModalOpen && (
        <ExamSubscriberModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

interface ExamSubscriberModalProps {
  onClose: () => void;
}

const ExamSubscriberModal = ({ onClose }: ExamSubscriberModalProps) => {
  const [code, setCode] = useState("");
  const isValidCode = code.length === 6;

  const subscribeToExamMutation = useMutation(subscribeToExam, {
    onSuccess: (response) => {
      if (response.status === 404) {
        notifySubscribedNotFound();
        return;
      }
      queryClient.invalidateQueries(subscribedExams);
      notifySubscribedSuccessfully();
      onClose();
    },
  });

  return (
    <Modal title="Enter Exam Code" onClose={onClose}>
      <AuthCode
        onChange={(e) => setCode(e)}
        allowedCharacters="numeric"
        inputClassName="code-input"
        autoFocus
      />
      <Button
        onClick={() => subscribeToExamMutation.mutate(code)}
        disabled={!isValidCode}
      >
        Subscribe
      </Button>
    </Modal>
  );
};

export default ExamSubscriber;
