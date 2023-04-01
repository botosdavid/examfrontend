import { notifyCopiedToClipboard } from "@/utils/toast/toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Exam } from "@prisma/client";
import QRCode from "react-qr-code";
import Modal from "../Modal/Modal";
import * as s from "./ExamIndoModalAtom";

interface ExamInfoModal {
  exam: Exam;
  onClose: () => void;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  notifyCopiedToClipboard();
};

const ExamInfoModal = ({ exam, onClose }: ExamInfoModal) => {
  return (
    <Modal height="60vh" width="50vw" onClose={onClose}>
      <s.Code onClick={() => copyToClipboard(exam.code)}>
        {exam.code}
        <ContentCopyIcon />
      </s.Code>
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
