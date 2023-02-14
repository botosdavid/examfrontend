import * as s from "./ExamSubscriberAtom";
import { useState } from "react";
import AuthCode from "react-auth-code-input";
import Modal from "../Modal/Modal";
import { notifySubscribedSuccessfully } from "@/utils/toast/toastify";
import { subscribeToExam } from "@/utils/api/requests";
import Button from "../Button/Button";
import { useMutation } from "react-query";
import { queryClient } from "@/pages/_app";

const ExamSubscriber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Add Exam</Button>
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
    onSuccess: () => {
      queryClient.invalidateQueries("exams");
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
