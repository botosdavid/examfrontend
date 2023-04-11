import { ReactNode, useEffect } from "react";
import * as s from "./ModalAtom";
const escapeKey = "Escape";

interface ModalProps {
  title?: ReactNode;
  children: ReactNode;
  width?: string;
  height?: string;
  onClose: () => void;
}

const Modal = ({ children, width, height, title, onClose }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === escapeKey) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
