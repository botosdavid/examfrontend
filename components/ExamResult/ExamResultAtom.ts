import styled from "styled-components";

export const ExamResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
`;

export const Title = styled.h2`
  font-weight: bold;
`;

interface AnswerProps {
  correct: boolean;
  wrong: boolean;
  right: boolean;
}

export const Answer = styled.div<AnswerProps>`
  min-width: 5rem;
  padding: 0.5rem;
  border-radius: 0.3rem;
  background-color: ${(props) =>
    props.right
      ? "green"
      : props.wrong
      ? "coral"
      : props.correct
      ? "lightgreen"
      : props.theme.grey};
`;
