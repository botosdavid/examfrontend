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

  @media ${(props) => props.theme.device.mobile} {
    padding: 0.3rem 0.6rem;
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  margin: auto;
  height: 30vh;
  width: 95%;

  @media ${(props) => props.theme.device.mobile} {
    flex-direction: column;
    height: auto;
  }
`;

export const Highlights = styled.div`
  width: 30%;
  height: 80%;
  color: white;
  background-color: ${(props) => props.theme.main};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 2rem;
  box-shadow: ${(props) => props.theme.boxShadow};

  @media ${(props) => props.theme.device.mobile} {
    width: 100%;
    padding: 1rem;
  }
`;

export const HighlightValue = styled.span`
  font-weight: bold;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const HighlightElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
`;
