import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import PauseScreen from "./PauseScreen";

const waitTime = 1;

const wrapper = (onComplete: () => void) => (
  <ThemeProvider theme={theme}>
    <PauseScreen waitTime={waitTime} onComplete={onComplete} />
  </ThemeProvider>
);

it("renders pause screen component", () => {
  const { container } = render(wrapper(() => {}));

  expect(container).toBeInTheDocument();
});

it("calls onComplete function after wait", async () => {
  const onCompleteFunction = jest.fn();

  render(wrapper(onCompleteFunction));

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  expect(onCompleteFunction).toBeCalled();
});

it("displays the remaining time in the countdown timer", () => {
  const { getByText } = render(wrapper(() => {}));
  const countdownTimer = getByText(waitTime);

  expect(countdownTimer).toBeInTheDocument();
});

it("after some time the timer is updating correctly", async () => {
  const onCompleteFunction = jest.fn();

  const { getByText } = render(wrapper(onCompleteFunction));

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  const countdownTimer = getByText(0);

  expect(onCompleteFunction).toBeCalled();
});
