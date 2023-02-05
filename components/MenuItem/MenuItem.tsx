import { ReactNode, useEffect, useState } from "react";
import * as s from "./MenuItemAtom";

interface MenuItemProps {
  label: string;
  link?: string;
  Icon?: ReactNode;
}

const MenuItem = ({ label, link = "", Icon }: MenuItemProps) => {
  const [isActivePage, setIsActivePage] = useState(false);

  useEffect(() => {
    const urlParam = window.location.pathname.split("/").pop();
    setIsActivePage(urlParam === link);
  }, []);

  return (
    <s.MenuItemContainer href={link} active={isActivePage}>
      {Icon}
      {label}
    </s.MenuItemContainer>
  );
};

export default MenuItem;
