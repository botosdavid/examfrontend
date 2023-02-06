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
  const handleSubscribeToExam = (code: string) => {};
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
      </s.ModalContainer>
    </s.ModalOuter>
  );
};

export default ExamSubscriber;
