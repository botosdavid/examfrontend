import { fireEvent, render } from "@testing-library/react";
import AuthPage from "./AuthPage";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import { ReactNode } from "react";

const wrapper = (
  title: string,
  disableButton: boolean,
  confirmButtonLabel: string,
  confirmButtonOnClick: () => void,
  children: ReactNode
) => (
  <ThemeProvider theme={theme}>
    <AuthPage
      title={title}
      confirmButtonLabel={confirmButtonLabel}
      confirmButtonOnClick={confirmButtonOnClick}
      disableButton={disableButton}
    >
      {children}
    </AuthPage>
  </ThemeProvider>
);

it("renders auth page component", () => {
  const { container } = render(
    wrapper("Title", false, "Submit", () => {}, "content")
  );

  expect(container).toBeInTheDocument();
});

it("calls auth page function when click on button", () => {
  const onConfirmButtonClick = jest.fn();

  const { getByRole } = render(
    wrapper("Title", false, "Submit", onConfirmButtonClick, "content")
  );

  const button = getByRole("button");

  fireEvent.click(button);

  expect(onConfirmButtonClick).toBeCalled();
});

it("calls auth page function when enter is pressed", () => {
  const onConfirmButtonClick = jest.fn();

  const { container } = render(
    wrapper("Title", false, "Submit", onConfirmButtonClick, "content")
  );

  fireEvent.keyDown(container, { key: "Enter" });

  expect(onConfirmButtonClick).toBeCalled();
});

it("title is set correctly", () => {
  const { getByText } = render(
    wrapper("Title", false, "Submit", () => {}, "content")
  );

  const title = getByText("Title");

  expect(title).toBeDefined();
});

it("button label is set correctly", () => {
  const buttonLabel = "Submit";

  const { getByRole } = render(
    wrapper("Title", false, buttonLabel, () => {}, "content")
  );

  const button = getByRole("button");

  expect(button.textContent).toBe(buttonLabel);
});

it("children is set correctly", () => {
  const children = <div>children</div>;

  const { getByText } = render(
    wrapper("Title", false, "Submit", () => {}, children)
  );

  const childrenElement = getByText("children");

  expect(childrenElement.textContent).toBe("children");
});

it("button disabled works correctly", () => {
  const { getByRole } = render(
    wrapper("Title", true, "Submit", () => {}, "children")
  );

  const button = getByRole("button");

  expect(button).toBeDisabled();
});

it("button not to be disabled works correctly", () => {
  const { getByRole } = render(
    wrapper("Title", false, "Submit", () => {}, "children")
  );

  const button = getByRole("button");

  expect(button).not.toBeDisabled();
});
