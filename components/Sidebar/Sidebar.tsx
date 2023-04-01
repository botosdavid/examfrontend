import { Role } from "@prisma/client";
import * as s from "./SidebarAtom";
import MenuItem from "../MenuItem/MenuItem";
import SchoolIcon from "@mui/icons-material/School";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "../Button/Button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

interface SidebarProps {
  usersession: UserSession;
  activeMenuItem?: MenuItem;
  onClick?: () => {};
}

const Sidebar = ({ usersession }: SidebarProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const canManageExams =
    usersession.user.role === Role.TEACHER ||
    usersession.user.role === Role.ADMIN;

  return (
    <s.SidebarContainer isMinimized={isMinimized}>
      <s.SidebarContentContainer>
        <Image src={"/eltelogo.png"} width={100} height={40} alt="logo" />
        <s.MinimizeButton onClick={() => setIsMinimized((prev) => !prev)}>
          {isMinimized ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
        </s.MinimizeButton>
        <s.MenuItemsContainer>
          <MenuItem label={"Exams"} link={"/"} Icon={<SchoolIcon />} />
          {canManageExams && (
            <MenuItem
              label={"Manage"}
              link={"/manage"}
              Icon={<WorkHistoryIcon />}
            />
          )}
        </s.MenuItemsContainer>

        <s.LogoutButton>
          <Button secondary onClick={signOut}>
            <LogoutIcon />
            <span>Logout</span>
          </Button>
        </s.LogoutButton>
      </s.SidebarContentContainer>
    </s.SidebarContainer>
  );
};

export default Sidebar;
