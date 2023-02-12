import { ReactNode } from "react";
import * as s from "./ButtonAtom";

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  secondary?: boolean;
  onClick: () => void;
}

const Button = ({
  children,
  secondary = false,
  disabled = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <s.ButtonContainer
      onClick={onClick}
      secondary={secondary}
      disabled={disabled}
    >
      {children}
    </s.ButtonContainer>
  );
};

export default Button;
