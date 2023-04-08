import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExamCreatorModal from "./ExamCreatorModal";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Exam } from "@prisma/client";
import { exam } from "../../__mocks__/react-query";

const wrapper = (onClose: () => void, exam?: Exam) => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ExamCreatorModal onClose={onClose} exam={exam}></ExamCreatorModal>
    </LocalizationProvider>
  </ThemeProvider>
);

it("renders modal component without exam", () => {
  const { queryByTestId, getAllByRole } = render(wrapper(() => {}));

  const deleteIcon = queryByTestId("DeleteRoundedIcon");
  const submitButton = getAllByRole("button").pop();

  expect(deleteIcon).not.toBeInTheDocument();
  expect(submitButton).toHaveTextContent("Create");
});

it("renders modal component with exam", () => {
  const { getAllByRole } = render(wrapper(() => {}, exam));

  const submitButton = getAllByRole("button").pop();

  expect(submitButton).toHaveTextContent("Update");
});

it("exam name input is populated correctly", () => {
  const { getByLabelText } = render(wrapper(() => {}, exam));

  const nameInput = getByLabelText("Exam Name") as HTMLInputElement;

  expect(nameInput.value).toBe(exam.name);
});

it("exam ip input is populated correctly", () => {
  const { getByLabelText } = render(wrapper(() => {}, exam));

  const ipInput = getByLabelText("Allowed IP address") as HTMLInputElement;

  expect(ipInput.value).toBe(exam.ip);
});
