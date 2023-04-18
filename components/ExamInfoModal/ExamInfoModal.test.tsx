import { fireEvent, queryByText, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import ExamInfoModal from "./ExamInfoModal";
import { Exam } from "@prisma/client";
import { exam } from "../../__mocks__/react-query";

const wrapper = (exam: Exam, onClose: () => void) => (
  <ThemeProvider theme={theme}>
    <ExamInfoModal exam={exam} onClose={onClose} />
  </ThemeProvider>
);

it("renders exam info modal component", () => {
  const { container } = render(wrapper(exam, () => {}));

  expect(container).toBeInTheDocument();
});

it("displays given exam code", () => {
  const { getByText } = render(wrapper(exam, () => {}));

  const code = getByText(exam.code);

  expect(code).toBeDefined();
});

it("displays given exam qr code", () => {
  const { getByTestId } = render(wrapper(exam, () => {}));

  const qrCode = getByTestId("QrCode");

  expect(qrCode).toBeInTheDocument();
});

it("calls onClose function", () => {
  const onCloseButtonClick = jest.fn();

  const { getByTestId } = render(wrapper(exam, onCloseButtonClick));

  const closeButton = getByTestId("CloseIcon");

  fireEvent.click(closeButton);

  expect(onCloseButtonClick).toBeCalled();
});
