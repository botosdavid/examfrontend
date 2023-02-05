import { Session } from "next-auth";
import { ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import * as s from "./LayoutAtoms";

interface LayoutProps {
  children: ReactNode;
  usersession: UserSession;
}

const Layout = ({ children, usersession }: LayoutProps) => {
  return (
    <s.LayoutContainer>
      <Sidebar usersession={usersession} />
      <s.Content>{children}</s.Content>
    </s.LayoutContainer>
  );
};

export default Layout;
