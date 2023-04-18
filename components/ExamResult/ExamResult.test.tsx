import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import ExamResult from "./ExamResult";

const wrapper = (
  <ThemeProvider theme={theme}>
    <ExamResult code="code" userId="userId" />
  </ThemeProvider>
);

it("renders exam result component", () => {
  const { container, debug } = render(wrapper);

  expect(container).toBeInTheDocument();
});

it("calculates exam result percentage correctly", () => {
  const { getByText } = render(wrapper);

  const percentage = getByText("100 %");

  expect(percentage).toBeDefined();
});

it("calculates exam result ratio correctly", () => {
  const { getByText } = render(wrapper);

  const ratio = getByText("1 / 1");

  expect(ratio).toBeDefined();
});

it("calculates exam result phase points correctly", () => {
  const { getByText } = render(wrapper);

  const phaseOnePoints = getByText("1 pts");
  const phaseTwoPoints = getByText("0 pts");

  expect(phaseOnePoints).toBeDefined();
  expect(phaseTwoPoints).toBeDefined();
});
