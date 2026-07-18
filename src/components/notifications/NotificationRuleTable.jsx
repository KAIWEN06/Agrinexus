import {
  Edit,
  Copy,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";

import Card from "../ui/Card";
import Table from "../ui/Table";
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

export default function NotificationRuleTable({
  rules = [],
  loading = false,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}) {
  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Memuat aturan notifikasi...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Nama Aturan</Table.Head>

            <Table.Head>Trigger</Table.Head>

            <Table.Head>Kondisi</Table.Head>

            <Table.Head>Prioritas</Table.Head>

            <Table.Head>Status</Table.Head>

            <Table.Head className="text-right">
              Aksi
            </Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
                  {rules.length > 0 ? (
            rules.map((rule) => (
              <Table.Row key={rule.id}>
                {/* ========================= */}
                {/* Nama Aturan */}
                {/* ========================= */}

                <Table.Cell>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {rule.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-2">
                      {rule.template}
                    </p>
                  </div>
                </Table.Cell>

                {/* ========================= */}
                {/* Trigger */}
                {/* ========================= */}

                <Table.Cell>
                  {SENSOR_LABEL[rule.sensor] ??
                    rule.sensor}
                </Table.Cell>

                {/* ========================= */}
                {/* Kondisi */}
                {/* ========================= */}

                <Table.Cell>
                  <span className="font-medium">
                    {rule.operator} {rule.value}
                  </span>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Durasi {rule.duration} menit
                  </p>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Cooldown {rule.cooldown} menit
                  </p>
                </Table.Cell>

                {/* ========================= */}
                {/* Prioritas */}
                {/* ========================= */}

                <Table.Cell>
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
                </Table.Cell>

                {/* ========================= */}
                {/* Status */}
                {/* ========================= */}

                <Table.Cell>
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
                </Table.Cell>

                {/* ========================= */}
                {/* Aksi */}
                {/* ========================= */}

                <Table.Cell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Edit"
                      onClick={() =>
                        onEdit?.(rule)
                      }
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      title="Duplikat"
                      onClick={() =>
                        onDuplicate?.(
                          rule.id
                        )
                      }
                    >
                      <Copy size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      title={
                        rule.enabled
                          ? "Nonaktifkan"
                          : "Aktifkan"
                      }
                      onClick={() =>
                        onToggle?.(
                          rule.id
                        )
                      }
                    >
                      {rule.enabled ? (
                        <PowerOff
                          size={16}
                        />
                      ) : (
                        <Power size={16} />
                      )}
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      title="Hapus"
                      className="text-red-600 hover:text-red-700"
                      onClick={() =>
                        onDelete?.(
                          rule.id
                        )
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (            <Table.Row>
              <Table.Cell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-[var(--muted)] p-4">
                    <PowerOff
                      size={28}
                      className="text-[var(--text-secondary)]"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    Belum Ada Aturan Notifikasi
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                    Tambahkan aturan notifikasi agar sistem dapat
                    mengirimkan peringatan otomatis ketika kondisi
                    tertentu terpenuhi.
                  </p>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
}