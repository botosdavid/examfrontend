import * as s from "./ExamSubscriberAtom";
import { useState } from "react";
import AuthCode from "react-auth-code-input";
import Modal from "../Modal/Modal";
import { notifySubscribedSuccessfully } from "@/utils/toast/toastify";

const ExamSubscriber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <s.ExamSubscriberContainer onClick={() => setIsModalOpen(true)}>
        Add Exam
      </s.ExamSubscriberContainer>
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
      <s.Button
        onClick={() => handleSubscribeToExam(code)}
        disabled={!isValidCode}
      >
        Subscribe
      </s.Button>
    </Modal>
  );
};

export default ExamSubscriber;
