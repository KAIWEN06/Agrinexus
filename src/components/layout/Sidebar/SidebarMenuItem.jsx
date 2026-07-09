import { NavLink } from "react-router-dom";
import { cn } from "../../../utils/cn";

export default function SidebarMenuItem({
  item,
  collapsed,
  onClose,
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end
      onClick={() => {
        if (window.innerWidth < 1024) {
          onClose?.();
        }
      }}
      className={({ isActive }) =>
        cn(
          `
            group
            flex
            items-center
            rounded-xl
            py-3
            text-sm
            font-medium
            transition-all
            duration-200
          `,

          collapsed
            ? "justify-center px-2"
            : "gap-3 px-4",

          isActive
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={2}
            className={cn(
              "shrink-0 transition-colors duration-200",
              isActive
                ? "text-white"
                : "text-[var(--text-secondary)] group-hover:text-[var(--primary)]"
            )}
          />

          {!collapsed && (
            <span className="truncate">
              {item.title}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}