import { NavLink } from "react-router-dom";
import { cn } from "../../../utils/cn";

export default function SidebarMenuItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",

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
              "transition-colors duration-200",
              isActive
                ? "text-white"
                : "text-[var(--text-secondary)] group-hover:text-[var(--primary)]"
            )}
          />

          <span className="truncate">
            {item.title}
          </span>
        </>
      )}
    </NavLink>
  );
}