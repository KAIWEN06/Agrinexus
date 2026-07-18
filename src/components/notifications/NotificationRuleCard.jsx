import {
  Edit,
  Copy,
  Trash2,
  Power,
  PowerOff,
  Clock3,
  TriangleAlert,
} from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const PRIORITY_VARIANT = {
  info: "info",
  warning: "warning",
  critical: "danger",
};

const PRIORITY_LABEL = {
  info: "Informasi",
  warning: "Peringatan",
  critical: "Kritis",
};

const SENSOR_LABEL = {
  temperature: "Suhu",
  humidity: "Kelembapan Udara",
  soil: "Kelembapan Tanah",
  light: "Intensitas Cahaya",
  rain: "Status Hujan",
  health: "Health Score",
  offline: "Node Offline",
};

export default function NotificationRuleCard({
  rule,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}) {
  if (!rule) return null;

  return (
    <Card className="p-5">
      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-[var(--foreground)]">
            {rule.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {rule.template}
          </p>
        </div>

        <Badge
          variant={
            rule.enabled
              ? "success"
              : "secondary"
          }
        >
          {rule.enabled
            ? "Aktif"
            : "Nonaktif"}
        </Badge>
      </div>

      {/* ====================================== */}
      {/* Informasi */}
      {/* ====================================== */}

      <div className="mt-6 space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            Trigger
          </span>

          <span className="font-medium">
            {SENSOR_LABEL[rule.sensor] ??
              rule.sensor}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            Kondisi
          </span>

          <span className="font-medium">
            {rule.operator} {rule.value}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            Prioritas
          </span>

          <Badge
            variant={
              PRIORITY_VARIANT[
                rule.priority
              ]
            }
          >
            {
              PRIORITY_LABEL[
                rule.priority
              ]
            }
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock3 size={16} />
            Durasi
          </span>

          <span>
            {rule.duration} menit
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <TriangleAlert size={16} />
            Cooldown
          </span>

          <span>
            {rule.cooldown} menit
          </span>
        </div>

      </div>

      {/* ====================================== */}
      {/* Tombol */}
      {/* ====================================== */}

      <div className="mt-6 grid grid-cols-2 gap-3">

        <Button
          variant="outline"
          startContent={<Edit size={16} />}
          onClick={() => onEdit?.(rule)}
        >
          Edit
        </Button>

        <Button
          variant="outline"
          startContent={<Copy size={16} />}
          onClick={() =>
            onDuplicate?.(rule.id)
          }
        >
          Salin
        </Button>

        <Button
          variant="outline"
          startContent={
            rule.enabled ? (
              <PowerOff size={16} />
            ) : (
              <Power size={16} />
            )
          }
          onClick={() =>
            onToggle?.(rule.id)
          }
        >
          {rule.enabled
            ? "Nonaktifkan"
            : "Aktifkan"}
        </Button>

        <Button
          variant="destructive"
          startContent={<Trash2 size={16} />}
          onClick={() =>
            onDelete?.(rule.id)
          }
        >
          Hapus
        </Button>

      </div>
    </Card>
  );
}