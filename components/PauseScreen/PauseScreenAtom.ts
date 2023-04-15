import styled from "styled-components";

export const PauseScreenContainer = styled.div`
  font-size: 3.5rem;
  width: 100%;
  height: 80vh;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PauseCountdownContainer = styled.div`
  box-shadow: ${(props) => props.theme.boxShadow};
  border-radius: 50%;
  padding: 1rem;
`;
