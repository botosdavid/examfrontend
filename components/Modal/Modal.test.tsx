import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";

const wrapper = (onClose: () => void) => (
  <ThemeProvider theme={theme}>
    <Modal onClose={onClose}>Modal</Modal>
  </ThemeProvider>
);

it("renders modal component", () => {
  const { container } = render(wrapper(() => {}));

  expect(container).toBeInTheDocument();
});

it("click on the exit icon calls the onClose function", () => {
  const onCloseFunction = jest.fn();

  const { getByTestId } = render(wrapper(onCloseFunction));

  const closeIcon = getByTestId("CloseIcon");
  fireEvent.click(closeIcon);

  expect(onCloseFunction).toHaveBeenCalled();
});

it("escape pressed calls the onClose function", () => {
  const onCloseFunction = jest.fn();

  const { container } = render(wrapper(onCloseFunction));

  fireEvent.keyDown(container, { key: "Escape", keyCode: "27" });

  expect(onCloseFunction).toHaveBeenCalled();
});
