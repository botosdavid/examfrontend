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
  gap: 4rem;
`;

export const AnswerButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  button {
    height: 3rem;
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
