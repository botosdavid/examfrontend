import { CountdownCircleTimer } from "react-countdown-circle-timer";
import * as s from "./PauseScreenAtom";

interface PauseScreenProps {
  waitTime: number;
  onComplete: () => void;
}

const PauseScreen = ({ waitTime, onComplete }: PauseScreenProps) => {
  return (
    <s.PauseScreenContainer>
      <s.PauseCountdownContainer>
        <CountdownCircleTimer
          size={300}
          key={1}
          isPlaying
          duration={Math.max(waitTime, 60)}
          colors={["#008e00", "#d5b500", "#A30000"]}
          colorsTime={[60, 30, 0]}
          strokeWidth={30}
          onComplete={onComplete}
          initialRemainingTime={waitTime}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </s.PauseCountdownContainer>
    </s.PauseScreenContainer>
  );
};

export default PauseScreen;
