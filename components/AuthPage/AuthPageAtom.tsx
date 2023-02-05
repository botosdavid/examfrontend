import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aa98b5;
`;

export const CredentialsContainer = styled.div`
  width: 30vw;
  height: 60vh;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-color: white;
`;

export const CredentialsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const ConfirmButton = styled.button`
  padding: 0.5rem 2rem;
  background-color: purple;
  color: white;
  border-radius: 0.5rem;
  border: none;
`;

export const Title = styled.h1`
  font-weight: bold;
`;
