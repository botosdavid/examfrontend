import styled from 'styled-components';

export const ExamSubscriberContainer = styled.div`
    background-color: ${props => props.theme.lightGrey};
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
`;

export const ModalOuter = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
`;

export const ModalContainer = styled.div`
    width: 30vw;
    height: 30vh;
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    
    background-color: ${props => props.theme.grey};
    color: white;
`;

export const ModalTitle = styled.h3`
    color: ${props => props.theme.fontColor};
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