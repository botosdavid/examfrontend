import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import * as s from "./MenuItemAtom";

interface MenuItemProps {
  label: string;
  link?: string;
  Icon?: ReactNode;
}

const MenuItem = ({ label, link = "/", Icon }: MenuItemProps) => {
  const [isActivePage, setIsActivePage] = useState(false);

  useEffect(() => {
    const urlParam = window.location.pathname.split("/").pop();
    setIsActivePage(`/${urlParam}` === link);
  }, [link]);

  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <s.MenuItemContainer active={isActivePage}>
        {Icon}
        <s.Label>{label}</s.Label>
      </s.MenuItemContainer>
    </Link>
  );
};

export default MenuItem;
