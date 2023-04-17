import { fireEvent, queryByText, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import ExamDeletion from "./ExamDeletion";

const wrapper = (onConfirm: () => void) => (
  <ThemeProvider theme={theme}>
    <ExamDeletion onConfirm={onConfirm} />
  </ThemeProvider>
);

it("renders exam deletion component", () => {
  const { container } = render(wrapper(() => {}));

  expect(container).toBeInTheDocument();
});

it("displays confirm modal when delete button is clicked", () => {
  const confirmModalTextPrompt =
    "Are you sure you want to permanently delete this exam?";
  const { getByText, getByRole, container } = render(wrapper(() => {}));

  const confirmModalText = queryByText(container, confirmModalTextPrompt);

  expect(confirmModalText).not.toBeInTheDocument();

  const deleteButton = getByRole("button");

  fireEvent.click(deleteButton);

  const confirmModalTextAfterClick = queryByText(
    container,
    confirmModalTextPrompt
  );

  expect(confirmModalTextAfterClick).toBeInTheDocument();
});

it("calls function on confirm click", () => {
  const onConfirmButtonClick = jest.fn();

  const { getByRole, getByText } = render(wrapper(onConfirmButtonClick));

  const deleteButton = getByRole("button");

  fireEvent.click(deleteButton);

  const confirmButton = getByText("Confirm");

  fireEvent.click(confirmButton);

  expect(onConfirmButtonClick).toBeCalled();
});
