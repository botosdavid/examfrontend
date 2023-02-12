import styled from "styled-components";

interface ButtonProps {
    disabled?: boolean;
    secondary?: boolean;
}

export const ButtonContainer = styled.button<ButtonProps>`
    background-color: ${props => props.secondary ? props.theme.grey : props.theme.main};
    color: ${props => props.secondary ? props.theme.fontColor : 'white'};
    opacity: ${props => props.disabled ? '0.5' : '1'};
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 3rem;
    margin: 0.2rem 0;
    cursor: pointer;
`