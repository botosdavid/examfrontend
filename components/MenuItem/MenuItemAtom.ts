import styled from 'styled-components';

interface MenuItemContainerProps {
    active: boolean;
}

export const MenuItemContainer = styled.a<MenuItemContainerProps>`
    padding: 0.5rem 2rem;
    border-radius: 2rem;
    background-color: ${props => props.theme.lightGrey};
    color: ${props => props.active ? props.theme.fontColor: 'grey'}; /* blue colors for links too */
    display: flex;
    align-items: center;
    text-decoration: inherit;
    gap: 0.7rem;
`