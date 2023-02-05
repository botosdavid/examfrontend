import { Role } from "@prisma/client";
import * as s from "./SidebarAtom";
import MenuItem from "../MenuItem/MenuItem";
import SchoolIcon from "@mui/icons-material/School";
import GradeIcon from "@mui/icons-material/Grade";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";

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
      <s.Logo>Logo</s.Logo>
      <s.MenuItemsContainer>
        <MenuItem label={"Exams"} link={""} Icon={<SchoolIcon />} />
        <MenuItem label={"Grades"} link={"/grades"} Icon={<GradeIcon />} />
        {canManageExams && (
          <MenuItem
            label={"Manage"}
            link={"/manage"}
            Icon={<WorkHistoryIcon />}
          />
        )}
      </s.MenuItemsContainer>
    </s.SidebarContainer>
  );
};

export default Sidebar;
