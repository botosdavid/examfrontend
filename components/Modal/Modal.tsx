import { ReactNode, useEffect } from "react";
import * as s from "./ModalAtom";
const escKeyCode = 27;

interface ModalProps {
  title?: string;
  children: ReactNode;
  width?: string;
  height?: string;
  onClose: () => void;
}

const Modal = ({ children, width, height, title, onClose }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (ev: any) => {
      if (ev.keyCode === escKeyCode) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    throw new Error("hups");
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
