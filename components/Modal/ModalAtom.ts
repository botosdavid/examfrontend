import styled from "styled-components";

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

interface ModalContainerProps {
    width?: string;
    height?: string;
}

export const ModalContainer = styled.div<ModalContainerProps>`
    width: ${props => props.width ?? '30vw'};
    height: ${props => props.height ?? '30vh'};
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    
    background-color: ${props => props.theme.grey};
    color: ${props => props.theme.fontColor};
    overflow: scroll;
`;

export const ModalTitle = styled.h3`
    font-weight: bold;
`