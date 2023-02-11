import { ReactNode } from "react";
import * as s from "./ModalAtom";

interface ModalProps {
  title?: string;
  children: ReactNode;
  width?: string;
  height?: string;
}

const Modal = ({ children, width, height, title }: ModalProps) => {
  return (
    <s.ModalOuter>
      <s.ModalContainer width={width} height={height}>
        {title && <s.ModalTitle>{title}</s.ModalTitle>}
        {children}
      </s.ModalContainer>
    </s.ModalOuter>
  );
};

export default Modal;
