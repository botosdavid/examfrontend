import styled from "styled-components";

export const QuestionEditContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: space-between;
  padding: 0 1rem;
`;

export const QuestionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  padding: 1rem 0;

  @media ${(props) => props.theme.device.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const ImageWrapper = styled.div`
  overflow: hidden;

  img {
    object-fit: cover;
    border-radius: 0.4rem;
  }
`;

export const LevelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
