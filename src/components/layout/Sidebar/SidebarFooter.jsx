import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/Button";
import SidebarProfile from "./SidebarProfile";

import useAuth from "../../../hooks/useAuth";

import { APP_VERSION } from "../../../config/app";
import { ROUTES } from "../../../constants/app/routes";

export default function SidebarFooter() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <footer
      className="
        mt-auto
        border-t
        border-[var(--border)]
        p-4
        space-y-4
      "
    >
      <SidebarProfile />

      <Button
        variant="outline"
        fullWidth
        startContent={<LogOut size={18} />}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <p
        className="
          text-center
          text-xs
          text-[var(--text-secondary)]
        "
      >
        Version {APP_VERSION}
      </p>
    </footer>
  );
}