import {
  Cpu,
  CircleCheck,
  CircleAlert,
  Clock3,
} from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

export default function SensorCard({
  name,
  location,
  status = "Tidak Aktif",
  value,
  unit = "",
  lastUpdate,
  className,
}) {
  const active = status === "Aktif";

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-[var(--primary)]/10
              text-[var(--primary)]
            "
          >
            <Cpu size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-[var(--foreground)]">
              {name}
            </h3>

            <p className="text-sm text-[var(--text-secondary)]">
              {location}
            </p>
          </div>
        </div>

        <Badge variant={active ? "success" : "danger"}>
          {status}
        </Badge>
      </div>

      {/* Value */}
      <div className="mt-6">
        <p className="text-sm text-[var(--text-secondary)]">
          Terakhir diperbarui
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
          {value}
          <span className="ml-1 text-lg font-medium">
            {unit}
          </span>
        </h2>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock3 size={16} />
          <span>{lastUpdate}</span>
        </div>

        {active ? (
          <CircleCheck
            size={18}
            className="text-green-600"
          />
        ) : (
          <CircleAlert
            size={18}
            className="text-red-600"
          />
        )}
      </div>
    </Card>
  );
}