import { useState } from "react";
import Button from "../Button/Button";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Modal from "../Modal/Modal";
import * as s from "./ExamDeletionAtom";

interface ExamDeletionProps {
  onConfirm: () => void;
}

const ExamDeletion = ({ onConfirm }: ExamDeletionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button danger secondary small onClick={() => setIsModalOpen(true)}>
        <DeleteRoundedIcon />
      </Button>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          title="Are you sure you want to permanently delete this exam?"
        >
          <s.ModalContentContainer>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button danger onClick={onConfirm}>
              Confirm
            </Button>
          </s.ModalContentContainer>
        </Modal>
      )}
    </>
  );
};

export default ExamDeletion;
