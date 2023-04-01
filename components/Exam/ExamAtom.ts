import styled from "styled-components";

export const ExamContainer = styled.div`
  background-color: ${(props) => props.theme.main};
  color: white;
  border-radius: 1rem;
  padding: 1rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0.4rem 0;
  &:nth-child(even) {
    background-color: ${(props) => props.theme.lightMain};
  }

  @media ${(props) => props.theme.device.mobile} {
    padding: 1rem;
    button {
      padding: 0.2rem;
    }
  }
`;

export const ExamName = styled.div`
  font-weight: bold;
  font-size: 1rem;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  width: 30%;
`;

export const ExamDate = styled.div`
  font-stretch: expanded;
  width: 30%;
  text-align: right;
  @media ${(props) => props.theme.device.mobile} {
    font-size: 80%;
  }
`;

export const ExamInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 50%;
  gap: 1rem;
  @media ${(props) => props.theme.device.mobile} {
    gap: 0.4rem;
  }
`;

export const QuestionCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 3rem;
  gap: 0.5rem;
`;
