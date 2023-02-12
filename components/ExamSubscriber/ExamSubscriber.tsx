import * as s from "./ExamSubscriberAtom";
import { useState } from "react";
import AuthCode from "react-auth-code-input";
import Modal from "../Modal/Modal";
import { notifySubscribedSuccessfully } from "@/utils/toast/toastify";
import Button from "../Button/Button";

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

  const handleSubscribeToExam = async (code: string) => {
    const response = await fetch("/api/exam", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (response.status !== 200) return;
    notifySubscribedSuccessfully();
    onClose();
  };

  return (
    <Modal title="Enter Exam Code" onClose={onClose}>
      <AuthCode
        onChange={(e) => setCode(e)}
        allowedCharacters="numeric"
        inputClassName="code-input"
        autoFocus
      />
      <Button
        onClick={() => handleSubscribeToExam(code)}
        disabled={!isValidCode}
      >
        Subscribe
      </Button>
    </Modal>
  );
};

export default ExamSubscriber;
