import styled from "styled-components";
import { ButtonProps } from "./Button";

type ButtonContainerProps = Omit<ButtonProps, "children" | "onClick">;

export const ButtonContainer = styled.button<ButtonContainerProps>`
  background-color: ${(props) =>
    props.secondary
      ? props.theme.grey
      : props.danger
      ? props.theme.red
      : props.theme.main};
  color: ${(props) =>
    props.secondary
      ? props.danger
        ? props.theme.red
        : props.theme.main
      : "white"};
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  border-radius: 0.5rem;
  border: ${(props) =>
    props.selected ? `1px solid ${props.theme.main}` : "none"};
  padding: ${(props) => (props.small ? "0.5rem 0.6rem" : "0.5rem 3rem")};
  margin: 0.2rem 0;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-width: ${(props) => (!props.small ? "10rem" : "")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  @media ${(props) => props.theme.device.mobile} {
    border-radius: 0.3rem;
  }
`;
