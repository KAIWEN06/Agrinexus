import { menu } from "../../../constants/app/menu";
import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarMenu({
  collapsed,
  onClose,
}) {
  return (
    <nav className="flex flex-1 flex-col gap-2">
      {menu.map((item) => (
        <SidebarMenuItem
          key={item.path}
          item={item}
          collapsed={collapsed}
          onClose={onClose}
        />
      ))}
    </nav>
  );
}