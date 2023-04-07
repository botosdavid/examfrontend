import { fireEvent, render } from "@testing-library/react";
import Button from "@/components/Button/Button";
import "@testing-library/jest-dom";

it("renders button component", () => {
  const { container } = render(<Button onClick={() => {}}>Click me</Button>);

  expect(container).toBeInTheDocument();
});

it("onClick function is called when clicking on the Button", () => {
  const onClickFunction = jest.fn();

  const { getByRole } = render(
    <Button onClick={onClickFunction}>Click me</Button>
  );

  fireEvent.click(getByRole("button"));

  expect(onClickFunction).toHaveBeenCalled();
});
