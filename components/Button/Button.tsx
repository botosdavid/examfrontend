import { ReactNode } from "react";
import * as s from "./ButtonAtom";

export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  secondary?: boolean;
  small?: boolean;
  selected?: boolean;
  danger?: boolean;
  onClick: () => void;
}

const Button = ({
  children,
  secondary = false,
  disabled = false,
  small = false,
  selected = false,
  danger = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <s.ButtonContainer
      onClick={onClick}
      secondary={secondary}
      disabled={disabled}
      small={small}
      selected={selected}
      danger={danger}
    >
      {children}
    </s.ButtonContainer>
  );
};

export default Button;
