import styled from "styled-components";

export const KvizContainer = styled.div`
  background-color: ${(props) => props.theme.lightGrey};
  border-radius: 2rem;
  height: 100%;
  padding: 2rem;
  box-shadow: ${(props) => props.theme.boxShadow};
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 3rem;
  position: relative;

  button {
    height: 2.5rem;
    width: 20%;
  }
`;

export const AnswerButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  button {
    height: 3rem;
    width: 100%;
    transition: all 0.1s ease-in;
    &:hover {
      font-size: 0.9rem;
    }
  }
`;

export const Question = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

export const Info = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
`;

export const HelpersContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const NextButtonContainer = styled.div`
  width: 50%;
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
`;

export const CountdownContainer = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;
`;
