import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;

  @media ${(props) => props.theme.device.mobile} {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  padding: 3rem;
  width: 100%;
`;
