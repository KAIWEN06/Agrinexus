import {
  CloudRain,
  CloudDrizzle,
  CloudOff,
  Clock3,
} from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";

export default function RainStatusCard({
  status = "Tidak Hujan",
  intensity = "-",
  updatedAt = "--:--:--",
}) {
  const isRaining = status.toLowerCase() === "hujan";

  const getIcon = () => {
    if (!isRaining) return CloudOff;

    switch (intensity.toLowerCase()) {
      case "ringan":
        return CloudDrizzle;

      case "sedang":
      case "lebat":
        return CloudRain;

      default:
        return CloudRain;
    }
  };

  const Icon = getIcon();

  return (
    <Card className="flex h-full flex-col justify-between p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Status Hujan
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            {status}
          </h3>
        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[var(--primary)]/10
            text-[var(--primary)]
          "
        >
          <Icon size={28} />
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            Intensitas
          </span>

          <Badge variant={isRaining ? "info" : "neutral"}>
            {intensity}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock3 size={16} />
            Update Terakhir
          </span>

          <span className="text-sm font-medium text-[var(--foreground)]">
            {updatedAt}
          </span>
        </div>
      </div>
    </Card>
  );
}