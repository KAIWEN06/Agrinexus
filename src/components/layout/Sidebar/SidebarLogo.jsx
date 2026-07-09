import { Link } from "react-router-dom";

import logo from "../../../assets/logo/logo.png";
import { APP_NAME } from "../../../config/app";

export default function SidebarLogo({ collapsed }) {
  return (
    <Link
      to="/dashboard"
      className={`
        flex
        items-center
        border-b
        border-[var(--border)]
        transition-all
        duration-300

        ${
          collapsed
            ? "justify-center px-2 py-6"
            : "gap-3 px-6 py-6"
        }
      `}
    >
      <img
        src={logo}
        alt={APP_NAME}
        className="h-11 w-11 object-contain shrink-0"
      />

      {!collapsed && (
        <div className="min-w-0">
          <h1
            className="
              truncate
              text-lg
              font-bold
              text-[var(--foreground)]
            "
          >
            {APP_NAME}
          </h1>

          <p
            className="
              text-xs
              text-[var(--text-secondary)]
            "
          >
            Smart Plantation Monitoring
          </p>
        </div>
      )}
    </Link>
  );
}