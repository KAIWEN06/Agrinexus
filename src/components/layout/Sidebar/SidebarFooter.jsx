import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import SidebarProfile from "./SidebarProfile";

import useAuth from "../../../hooks/useAuth";

import { APP_VERSION } from "../../../config/app";
import { ROUTES } from "../../../constants/app/routes";

export default function SidebarFooter({
  collapsed,
}) {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      navigate(ROUTES.LOGIN, {
        replace: true,
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <footer
      className={
        collapsed
          ? `
              mt-auto
              flex
              flex-col
              items-center
              gap-3
              border-t
              border-[var(--border)]
              py-4
            `
          : `
              mt-auto
              space-y-4
              border-t
              border-[var(--border)]
              p-4
            `
      }
    >

      <SidebarProfile
        collapsed={collapsed}
      />

    {collapsed ? (
      <button
        onClick={handleLogout}
        className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100"
      >
        <LogOut size={18} className="text-black" />
      </button>
    ) : (
      <Button
        variant="outline"
        fullWidth
        startContent={<LogOut size={18} />}
        onClick={handleLogout}
      >
        Keluar
      </Button>
    )}

      {!collapsed && (
        <p className="text-center text-xs text-[var(--text-secondary)]">
          Version {APP_VERSION}
        </p>
      )}

    </footer>
  );
}