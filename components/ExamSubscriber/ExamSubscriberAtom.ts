import styled from 'styled-components';

export const ExamSubscriberContainer = styled.div`
    background-color: ${props => props.theme.lightGrey};
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
`;

interface ButtonProps {
    disabled: boolean;
}

export const Button = styled.button<ButtonProps>`
    background-color: ${props => props.theme.main};
    color: white;
    padding: 0.5rem 3rem;
    border-radius: 0.5rem;
    border: none;
    opacity: ${props => props.disabled ? '0.5': '1'}
`