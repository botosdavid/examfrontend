import { Role } from "@prisma/client";
import * as s from "./SidebarAtom";
import MenuItem from "../MenuItem/MenuItem";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "../Button/Button";
import { signOut } from "next-auth/react";

interface SidebarProps {
  usersession: UserSession;
  activeMenuItem?: MenuItem;
  onClick?: () => {};
}

const Sidebar = ({ usersession }: SidebarProps) => {
  const canManageExams =
    usersession.user.role === Role.TEACHER ||
    usersession.user.role === Role.ADMIN;

  return (
    <s.SidebarContainer>
      <s.SidebarContentContainer>
        <s.Logo>Logo</s.Logo>
        <s.MenuItemsContainer>
          <MenuItem label={"Exams"} link={"/"} Icon={<SchoolIcon />} />
          <MenuItem label={"Grades"} link={"/grades"} Icon={<GradeIcon />} />
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
            <LogoutIcon /> Logout
          </Button>
        </s.LogoutButton>
      </s.SidebarContentContainer>
    </s.SidebarContainer>
  );
};

export default Sidebar;
