import { Exam } from "@prisma/client";
import QRCode from "react-qr-code";
import Modal from "../Modal/Modal";

interface ExamInfoModal {
  exam: Exam;
  onClose: () => void;
}

const ExamInfoModal = ({ exam, onClose }: ExamInfoModal) => {
  return (
    <Modal height="60vh" onClose={onClose}>
      <h2>{exam.code}</h2>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "70%" }}
        value={exam.code}
        viewBox={`0 0 256 256`}
      />
    </Modal>
  );
};

export default ExamInfoModal;
