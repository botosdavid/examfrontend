import { Session } from "next-auth";
import { ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import * as s from "./LayoutAtoms";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <s.LayoutContainer>
      <Sidebar />
      <s.Content>{children}</s.Content>
    </s.LayoutContainer>
  );
};

export default Layout;
