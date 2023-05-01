import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";
import Sidebar from "./Sidebar";
import { Role } from "@prisma/client";

const wrapper = (role: Role) => {
  const session = {
    user: { id: "userId", role, neptun: "neptun" },
    expires: "expireDate",
  };
  return (
    <ThemeProvider theme={theme}>
      <Sidebar usersession={session} />
    </ThemeProvider>
  );
};

it("renders sidebar screen component", () => {
  const { container } = render(wrapper(Role.STUDENT));

  expect(container).toBeInTheDocument();
});

it("renders only 1 sidebar menuitems when user is a student", () => {
  const { queryAllByRole } = render(wrapper(Role.STUDENT));

  const menuItems = queryAllByRole("link");

  expect(menuItems).toHaveLength(1);
});

it("renders only 2 sidebar menuitems when user is a teacher", () => {
  const { queryAllByRole } = render(wrapper(Role.TEACHER));

  const menuItems = queryAllByRole("link");

  expect(menuItems).toHaveLength(2);
});
