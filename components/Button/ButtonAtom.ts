import styled from "styled-components";

interface ButtonProps {
  disabled?: boolean;
  secondary?: boolean;
  small?: boolean;
}

export const ButtonContainer = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.secondary ? props.theme.grey : props.theme.main};
  color: ${(props) => (props.secondary ? props.theme.main : "white")};
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  border-radius: 0.5rem;
  border: none;
  padding: ${(props) => (props.small ? "0.5rem 0.6rem" : "0.5rem 3rem")};
  margin: 0.2rem 0;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-width: ${(props) => (!props.small ? "10rem" : "")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
`;
