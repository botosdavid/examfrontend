import styled from "styled-components";

export const Code = styled.h2`
  cursor: pointer;
  background-color: ${(props) => props.theme.grey};
  padding: 0.5rem 2rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    color: ${(props) => props.theme.main};
  }
`;
