import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NotificationCard from "../cards/NotificationCard";
import Button from "../ui/Button";

export default function NotificationDropdown({
  open,
  notifications = [],
  unreadCount = 0,
  onClose,
  onMarkAllRead,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
<div
  className="
    fixed

    top-20

    left-1/2
    -translate-x-1/2

    w-[calc(100vw-1rem)]
    max-w-[380px]

    sm:absolute
    sm:left-auto
    sm:translate-x-0
    sm:right-0
    sm:top-14

    z-[9999]

    rounded-2xl
    border
    border-[var(--border)]
    bg-white
    shadow-2xl
  "
>
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between

          border-b
          border-[var(--border)]

          p-5
        "
      >
        <div className="flex items-center gap-3">
          <Bell
            size={20}
            className="text-[var(--primary)]"
          />

          <h3 className="text-xl font-bold">
            Notifikasi
          </h3>

          {unreadCount > 0 && (
            <span
              className="
                flex
                h-7
                min-w-7
                items-center
                justify-center

                rounded-full

                bg-red-500

                px-2

                text-xs
                font-semibold
                text-white
              "
            >
              {unreadCount}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          startContent={<CheckCheck size={16} />}
          onClick={onMarkAllRead}
        >
          Tandai Dibaca
        </Button>
      </div>

      {/* Body */}

      <div
        className="
          max-h-[450px]
          overflow-y-auto
          p-4
          space-y-4
        "
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              {...notification}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <Bell
              size={42}
              className="
                mx-auto
                mb-4
                text-gray-300
              "
            />

            <h3 className="font-semibold">
              Tidak ada notifikasi
            </h3>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Semua kondisi perkebunan berjalan normal.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}

      <div
        className="
          border-t
          border-[var(--border)]
          p-4
        "
      >
        <Button
          fullWidth
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
        >
          Lihat Semua Notifikasi
        </Button>
      </div>
    </div>
  );
}