import { Link } from "react-router-dom";

import logo from "../../../assets/logo/logo.png";
import { APP_NAME } from "../../../config/app";

export default function SidebarLogo() {
  return (
    <Link
      to="/dashboard"
      className="
        flex
        items-center
        gap-3
        border-b
        border-[var(--border)]
        px-6
        py-6
      "
    >
      <img
        src={logo}
        alt={APP_NAME}
        className="h-11 w-11 object-contain"
      />

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
    </Link>
  );
}