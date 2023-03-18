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

export const Points = styled.p`
  text-align: end;
  color: ${(props) => props.theme.main};
`;

export const QuestionText = styled.h3`
  padding-bottom: 1rem;
  box-sizing: border-box;
`;

export const QuestionContainer = styled.div`
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: ${(props) => props.theme.boxShadow};
`;

interface AnswerProps {
  correct: boolean;
  wrong: boolean;
  right: boolean;
}

export const Answer = styled.div<AnswerProps>`
  min-width: 20rem;
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

export const PhaseTitle = styled.div`
  padding-bottom: 2rem;
  font-size: 1.2rem;
`;
