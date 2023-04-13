import { fireEvent, render } from "@testing-library/react";
import Button from "@/components/Button/Button";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";

it("renders button component", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Button onClick={() => {}}>Click me</Button>
    </ThemeProvider>
  );

  expect(container).toBeInTheDocument();
});

it("onClick function is called when clicking on the Button", () => {
  const onClickFunction = jest.fn();

  const { getByRole } = render(
    <ThemeProvider theme={theme}>
      <Button onClick={onClickFunction}>Click me</Button>
    </ThemeProvider>
  );

  fireEvent.click(getByRole("button"));

  expect(onClickFunction).toHaveBeenCalled();
});
