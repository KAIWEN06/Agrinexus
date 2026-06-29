import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40

        flex
        h-screen
        w-[280px]
        flex-col

        border-r
        border-[var(--border)]

        bg-white
      "
    >
      {/* Logo */}
      <SidebarLogo />

      {/* Menu */}
      <div
        className="
          flex-1

          overflow-y-auto

          px-4

          py-6
        "
      >
        <SidebarMenu />
      </div>

      {/* Footer */}
      <SidebarFooter />
    </aside>
  );
}