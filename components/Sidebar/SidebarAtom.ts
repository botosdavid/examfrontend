import styled from "styled-components";

interface SidebarContainerProps {
  isMinimized: boolean;
}

export const SidebarContainer = styled.div<SidebarContainerProps>`
  position: relative;
  min-height: 100vh;
  width: ${(props) => (props.isMinimized ? "5vw" : "25vw")};
  background-color: ${(props) => props.theme.grey};
  transition: all 0.3s ease-in-out;

  div {
    div,
    img {
      visibility: ${(props) => (props.isMinimized ? "hidden" : "visible")};
    }
  }

  @media ${(props) => props.theme.device.mobile} {
    min-height: 5vh;
    width: 100vw;

    div {
      div,
      img {
        visibility: visible;
      }
    }
  }
`;

export const SidebarContentContainer = styled.div`
  height: 100vh;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;

  @media ${(props) => props.theme.device.mobile} {
    flex-direction: row;
    height: 5vh;
    gap: 2rem;
    padding: 2.5rem;
  }
`;

export const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media ${(props) => props.theme.device.mobile} {
    flex-direction: row;
    gap: 0.5rem;
  }
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
    @media ${(props) => props.theme.device.tablet} {
      min-width: 1rem;
      padding: 1.3rem;
      width: 1rem;
      height: 1rem;
    }
  }
  span {
    @media ${(props) => props.theme.device.tablet} {
      display: none;
    }
  }
`;

export const MinimizeButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.lightMain};
  z-index: 1;
  position: absolute;
  top: 20px;
  right: -15px;
  cursor: pointer;

  @media ${(props) => props.theme.device.mobile} {
    display: none;
  }
`;
