import styled from "styled-components";

interface MenuItemContainerProps {
  active: boolean;
}

export const MenuItemContainer = styled.div<MenuItemContainerProps>`
  padding: 0.5rem 2rem;
  border-radius: 2rem;
  background-color: ${(props) => props.theme.lightGrey};
  color: ${(props) => (props.active ? props.theme.fontColor : "grey")};
  display: flex;
  align-items: center;
  gap: 0.7rem;

  @media ${(props) => props.theme.device.mobile} {
    padding: 0.7rem;
  }
`;

export const Label = styled.div`
  @media ${(props) => props.theme.device.tablet} {
    display: none;
  }
`;
