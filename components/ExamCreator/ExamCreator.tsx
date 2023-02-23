import * as s from "./ExamCreatorAtom";
import { useState } from "react";
import ExamCreatorModal from "../ExamCreatorModal/ExamCreatorModal";
import Button from "../Button/Button";

const ExamCreator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button secondary onClick={() => setIsModalOpen(true)}>
        Create new exam
      </Button>
      {isModalOpen && (
        <ExamCreatorModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default ExamCreator;
