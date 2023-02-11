import { ReactNode } from "react";
import * as s from "./ModalAtom";

interface ModalProps {
  title?: string;
  children: ReactNode;
  width?: string;
  height?: string;
  onClose: () => void;
}

const Modal = ({ children, width, height, title, onClose }: ModalProps) => {
  return (
    <s.ModalOuter>
      <s.ModalContainer width={width} height={height}>
        {title && <s.ModalTitle>{title}</s.ModalTitle>}
        <s.Close onClick={onClose} />
        {children}
      </s.ModalContainer>
    </s.ModalOuter>
  );
};

export default Modal;
