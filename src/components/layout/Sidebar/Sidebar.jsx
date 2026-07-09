import { X } from "lucide-react";

import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar({
  open,
  collapsed,
  onClose,
}) {
  return (
    <>
      {/* Overlay (Mobile Only) */}
      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          transition-opacity
          duration-300
          lg:hidden

          ${
            open
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          flex-col

          border-r
          border-[var(--border)]

          bg-white

          transition-all
          duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          ${
            collapsed
              ? "lg:w-20"
              : "lg:w-[280px]"
          }

          w-[280px]
          lg:translate-x-0
        `}
      >
        {/* Close button (Mobile) */}
        <button
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            rounded-lg
            p-2
            transition
            hover:bg-slate-100
            lg:hidden
          "
        >
          <X size={20} />
        </button>

        <SidebarLogo
          collapsed={collapsed}
        />

        <div
          className={`
            flex-1
            overflow-y-auto
            py-6

            ${
              collapsed
                ? "px-2"
                : "px-4"
            }
          `}
        >
          <SidebarMenu
            collapsed={collapsed}
            onClose={onClose}
          />
        </div>

        <SidebarFooter
          collapsed={collapsed}
        />
      </aside>
    </>
  );
}