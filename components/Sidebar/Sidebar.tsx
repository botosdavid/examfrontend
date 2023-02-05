import * as s from "./SidebarAtom";

interface SidebarProps {
  activeMenuItem: MenuItem;
  onClick: () => {};
}

const Sidebar = () => {
  return (
    <s.SidebarContainer>
      <s.Logo>Logo</s.Logo>
      <s.MenuItemsContainer>
        <div>Exams</div>
        <div>Manage</div>
        <div>Grades</div>
      </s.MenuItemsContainer>
    </s.SidebarContainer>
  );
};

export default Sidebar;
