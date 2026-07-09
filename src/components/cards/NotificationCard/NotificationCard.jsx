import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  MapPin,
  Cpu,
  Clock,
} from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

const notificationConfig = {
  info: {
    icon: Info,
    badge: "info",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  success: {
    icon: CheckCircle2,
    badge: "success",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  warning: {
    icon: AlertTriangle,
    badge: "warning",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  danger: {
    icon: AlertCircle,
    badge: "danger",
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

// Objek pemetaan teks tipe ke Bahasa Indonesia
const typeLabels = {
  info: "Info",
  success: "Sukses",
  warning: "Peringatan",
  danger: "Bahaya",
};

export default function NotificationCard({
  title,
  message,
  type = "info",
  status,
  node,
  location,
  time,
  unread = false,
  compact = false,
  className,
}) {
  const config =
    notificationConfig[type] || notificationConfig.info;

  const Icon = config.icon;

  return (
    <Card
      className={cn(
        compact
          ? "rounded-none border-x-0 border-t-0 p-4 shadow-none transition-colors hover:bg-slate-50"
          : "mx-1 my-1 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="flex gap-4">

        {/* Icon */}
        <div
          className={cn(
            compact
              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              : "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            config.bg,
            config.color
          )}
        >
          <Icon size={compact ? 20 : 24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <div className="flex items-center gap-2">
                {unread && (
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                )}
                <h3 className="truncate font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
              </div>

              {!compact && (node || location) && (
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)]">
                  {node && (
                    <span className="flex items-center gap-1">
                      <Cpu size={14} />
                      {node}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {location}
                    </span>
                  )}
                </div>
              )}

            </div>

            {/* Bagian Badge Tipe yang diubah ke Bahasa Indonesia */}
            {!compact && (
              <Badge variant={config.badge}>
                {typeLabels[type] || type}
              </Badge>
            )}

          </div>

          {/* Message */}
          <p
            className={cn(
              compact
                ? "mt-2 text-sm text-[var(--text-secondary)] line-clamp-2"
                : "mt-4 text-sm leading-6 text-[var(--text-secondary)]"
            )}
          >
            {message}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">

            {!compact ? (
              status ? (
                <Badge
                  variant={
                    status === "Belum Dibaca"
                      ? "warning"
                      : "success"
                  }
                >
                  {status}
                </Badge>
              ) : (
                <div />
              )
            ) : (
              <div />
            )}

            {time && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <Clock size={14} />
                {time}
              </span>
            )}

          </div>

        </div>

      </div>
    </Card>
  );
}