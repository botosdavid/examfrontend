import styled from "styled-components";

export const SidebarContainer = styled.div`
  min-height: 100vh;
  width: 25vw;
  background-color: ${(props) => props.theme.grey};
`;

export const SidebarContentContainer = styled.div`
  height: 100vh;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4rem;
`;

export const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Logo = styled.div`
  color: ${(props) => props.theme.fontColor};
  font-weight: bold;
  font-size: 1.5rem;
`;

export const LogoutButton = styled.div`
  button {
    background-color: white;
    border-radius: 3rem;
  }
`;
