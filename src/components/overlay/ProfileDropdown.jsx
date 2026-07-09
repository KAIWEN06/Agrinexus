import {
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

import useAuth from "../../hooks/useAuth";

import { ROUTES } from "../../constants/app/routes";

export default function ProfileDropdown({
  open,
  user,
  onClose,
}) {
  const navigate = useNavigate();

  const { logout } = useAuth();

  if (!open) return null;

  async function handleLogout() {
    try {
      await logout();

      navigate(ROUTES.LOGIN, {
        replace: true,
      });

      onClose();

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className="
        fixed

        top-20
        left-1/2
        -translate-x-1/2

        w-[calc(100vw-1rem)]
        max-w-[320px]

        sm:absolute
        sm:top-14
        sm:right-0
        sm:left-auto
        sm:translate-x-0
        sm:w-80

        z-[9999]

        rounded-2xl

        border
        border-[var(--border)]

        bg-white

        shadow-2xl
      "
    >
      {/* Header */}

      <div className="border-b border-[var(--border)] p-5">

        <div className="flex items-center gap-4">

          <Avatar
            src={user.avatar}
            name={user.fullName}
            size="lg"
          />

          <div className="min-w-0">

            <h3 className="truncate font-semibold">
              {user.fullName}
            </h3>

            <p className="truncate text-sm text-[var(--text-secondary)]">
              {user.email}
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="p-2">

        <button
          onClick={() => {
            navigate("/profile");
            onClose();
          }}
          className="
            flex
            w-full
            items-center
            justify-between

            rounded-xl

            px-4
            py-3

            transition

            hover:bg-[var(--muted)]
          "
        >

          <div className="flex items-center gap-3">

            <User size={20} />

            <span>Profil Saya</span>

          </div>

          <ChevronRight size={18} />

        </button>

        <button
          onClick={() => {
            navigate("/settings");
            onClose();
          }}
          className="
            mt-2

            flex
            w-full
            items-center
            justify-between

            rounded-xl

            px-4
            py-3

            transition

            hover:bg-[var(--muted)]
          "
        >

          <div className="flex items-center gap-3">

            <Settings size={20} />

            <span>Pengaturan</span>

          </div>

          <ChevronRight size={18} />

        </button>

      </div>

      {/* Footer */}

      <div className="border-t border-[var(--border)] p-4">

        <Button
          variant="danger"
          fullWidth
          startContent={<LogOut size={18} />}
          onClick={handleLogout}
        >
          Keluar
        </Button>

      </div>

    </div>
  );
}