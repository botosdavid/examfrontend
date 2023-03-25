import styled from "styled-components";

export const Subscriber = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.grey};

  button {
    padding: 0;
  }
`;

export const SubscriberList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const SubscriberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Chart = styled.div`
  position: relative;
  margin: auto;
  height: 30vh;
  width: 100%;
`;
