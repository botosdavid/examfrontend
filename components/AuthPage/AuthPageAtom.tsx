import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.grey};
`;

export const CredentialsContainer = styled.div`
  width: 30vw;
  height: 80vh;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-color: white;

  @media ${(props) => props.theme.device.mobile} {
    width: 90vw;
  }
`;

export const CredentialsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
  font-weight: bold;
`;
