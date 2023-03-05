import { ReactNode } from "react";
import * as s from "./ButtonAtom";

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  secondary?: boolean;
  small?: boolean;
  selected?: boolean;
  onClick: () => void;
}

const Button = ({
  children,
  secondary = false,
  disabled = false,
  small = false,
  selected = false,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <s.ButtonContainer
      onClick={onClick}
      secondary={secondary}
      disabled={disabled}
      small={small}
      selected={selected}
    >
      {children}
    </s.ButtonContainer>
  );
};

export default Button;
