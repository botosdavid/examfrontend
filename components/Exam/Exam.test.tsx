import { render, fireEvent } from "@testing-library/react";
import Exam from "@/components/Exam/Exam";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";

const exam: ExamListItem = {
  id: "1",
  name: "exam",
  authorId: "userId",
  date: new Date(),
  code: "123456",
  levels: "0,1",
  ip: "",
  createdAt: new Date(),
  _count: {
    questions: 4,
  },
};

it("renders exam component", () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={exam} />
    </ThemeProvider>
  );

  expect(container).toBeInTheDocument();
});

it("exam can be started when date is reached", () => {
  const { queryByTestId } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={exam} isSubscribed />
    </ThemeProvider>
  );

  const startButton = queryByTestId("PlayCircleFilledRoundedIcon");

  expect(startButton).toBeInTheDocument();
});

it("exam cannot be started when date is not reached", () => {
  exam.date.setHours(exam.date.getHours() + 4);

  const { queryByTestId } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={exam} isSubscribed />
    </ThemeProvider>
  );

  const startButton = queryByTestId("PlayCircleFilledRoundedIcon");

  expect(startButton).not.toBeInTheDocument();
});

it("exam can be edited if user is the author", () => {
  const { queryByTestId } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={exam} isSubscribed />
    </ThemeProvider>
  );

  const editButton = queryByTestId("EditRoundedIcon");

  expect(editButton).toBeInTheDocument();
});

it("exam cannot be edited if user is not the author", () => {
  const examDifferentAuthor = { ...exam, authorId: "anotherId" };

  const { queryByTestId } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={examDifferentAuthor} isSubscribed />
    </ThemeProvider>
  );

  const editButton = queryByTestId("EditRoundedIcon");

  expect(editButton).not.toBeInTheDocument();
});

it("exam shows qrcode if the button is clicked", () => {
  const { queryByTestId } = render(
    <ThemeProvider theme={theme}>
      <Exam exam={exam} isSubscribed />
    </ThemeProvider>
  );

  const qrButton = queryByTestId("QrCodeScannerIcon");
  fireEvent.click(qrButton!);

  const qrCode = queryByTestId("QrCode");

  expect(qrCode).toBeInTheDocument();
});
