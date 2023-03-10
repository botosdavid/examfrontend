import styled from "styled-components";

export const ExamContainer = styled.div`
    background-color: ${props => props.theme.main};
    color: white;
    border-radius: 1rem;
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.4rem 0;
`;

export const ExamName = styled.div`
    font-weight: bold;
    font-size: 1rem;
`;

export const ExamDate = styled.div`
    font-stretch: expanded;
    width: 30%;
`;

export const ExamInfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 40%;
    gap: 1rem;
`;