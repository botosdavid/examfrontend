import * as s from "./ExamSubscriberAtom";
import { useState } from "react";
import AuthCode from "react-auth-code-input";

const ExamSubscriber = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <s.ExamSubscriberContainer onClick={() => setIsModalOpen(true)}>
        Add Exam
      </s.ExamSubscriberContainer>
      {isModalOpen && <Modal />}
    </>
  );
};

const Modal = () => {
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
  };

  return (
    <s.ModalOuter>
      <s.ModalContainer>
        <s.ModalTitle>Enter Exam Code</s.ModalTitle>
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
      </s.ModalContainer>
    </s.ModalOuter>
  );
};

export default ExamSubscriber;
