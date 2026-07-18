import { useEffect, useMemo, useState } from "react";
import { BellRing } from "lucide-react";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const DEFAULT_FORM = {
  name: "",
  sensor: "temperature",
  operator: ">",
  value: "",
  duration: 5,
  cooldown: 10,
  priority: "warning",
  enabled: true,
  template: "",
};

export default function NotificationRuleForm({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] =
    useState(DEFAULT_FORM);

  const [errors, setErrors] =
    useState({});

  /*
   * ===========================================
   * Edit Mode
   * ===========================================
   */

  useEffect(() => {
    if (initialData) {
      setForm({
        ...DEFAULT_FORM,
        ...initialData,
      });
    } else {
      setForm(DEFAULT_FORM);
    }

    setErrors({});
  }, [initialData]);

  /*
   * ===========================================
   * Helpers
   * ===========================================
   */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  /*
   * ===========================================
   * Validation
   * ===========================================
   */

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Nama aturan wajib diisi.";
    }

    if (
      form.value === "" ||
      form.value === null
    ) {
      nextErrors.value =
        "Nilai trigger wajib diisi.";
    }

    if (!form.template.trim()) {
      nextErrors.template =
        "Template pesan wajib diisi.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const isValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.template.trim() &&
      form.value !== ""
    );
  }, [form]);

  /*
   * ===========================================
   * Submit
   * ===========================================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit?.(form);
  };

  return (
    <Card className="border-0 shadow-none">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
            <BellRing size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {initialData
                ? "Edit Aturan Notifikasi"
                : "Tambah Aturan Notifikasi"}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Tentukan kondisi yang akan
              menghasilkan notifikasi
              otomatis.
            </p>
          </div>
        </div>

        <Badge
          variant={
            form.enabled
              ? "success"
              : "secondary"
          }
        >
          {form.enabled
            ? "Aktif"
            : "Nonaktif"}
        </Badge>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
                {/* =======================================
            Nama Aturan
        ======================================= */}

        <Input
          label="Nama Aturan"
          required
          placeholder="Contoh: Suhu Tinggi"
          value={form.name}
          error={errors.name}
          onChange={(e) =>
            handleChange("name", e.target.value)
          }
        />

        {/* =======================================
            Trigger & Operator
        ======================================= */}

        <div className="grid gap-5 md:grid-cols-2">
          <Select
            label="Trigger"
            value={form.sensor}
            onValueChange={(value) =>
              handleChange("sensor", value)
            }
          >
            <Select.Item value="temperature">
              Suhu
            </Select.Item>

            <Select.Item value="humidity">
              Kelembapan Udara
            </Select.Item>

            <Select.Item value="soil">
              Kelembapan Tanah
            </Select.Item>

            <Select.Item value="light">
              Intensitas Cahaya
            </Select.Item>

            <Select.Item value="rain">
              Status Hujan
            </Select.Item>

            <Select.Item value="health">
              Health Score
            </Select.Item>

            <Select.Item value="offline">
              Node Offline
            </Select.Item>
          </Select>

          <Select
            label="Operator"
            value={form.operator}
            onValueChange={(value) =>
              handleChange("operator", value)
            }
          >
            <Select.Item value=">">
              Lebih Besar (&gt;)
            </Select.Item>

            <Select.Item value=">=">
              Lebih Besar Sama Dengan (&ge;)
            </Select.Item>

            <Select.Item value="<">
              Lebih Kecil (&lt;)
            </Select.Item>

            <Select.Item value="<=">
              Lebih Kecil Sama Dengan (&le;)
            </Select.Item>

            <Select.Item value="=">
              Sama Dengan (=)
            </Select.Item>

            <Select.Item value="!=">
              Tidak Sama Dengan (≠)
            </Select.Item>
          </Select>
        </div>

        {/* =======================================
            Nilai Trigger
        ======================================= */}

        <div className="grid gap-5 md:grid-cols-3">
          <Input
            type="number"
            label="Nilai Trigger"
            required
            placeholder="35"
            value={form.value}
            error={errors.value}
            onChange={(e) =>
              handleChange(
                "value",
                e.target.value
              )
            }
          />

          <Input
            type="number"
            label="Durasi (menit)"
            value={form.duration}
            onChange={(e) =>
              handleChange(
                "duration",
                Number(e.target.value)
              )
            }
          />

          <Input
            type="number"
            label="Cooldown (menit)"
            value={form.cooldown}
            onChange={(e) =>
              handleChange(
                "cooldown",
                Number(e.target.value)
              )
            }
          />
        </div>

        {/* =======================================
            Prioritas
        ======================================= */}

        <Select
          label="Prioritas"
          value={form.priority}
          onValueChange={(value) =>
            handleChange("priority", value)
          }
        >
          <Select.Item value="info">
            Informasi
          </Select.Item>

          <Select.Item value="warning">
            Peringatan
          </Select.Item>

          <Select.Item value="critical">
            Kritis
          </Select.Item>
        </Select>

        {/* =======================================
            Template
        ======================================= */}

        <Textarea
          label="Template Pesan"
          rows={5}
          required
          placeholder={`Contoh:

Sensor pada {node}
mendeteksi suhu {value}°C
pada {time}.`}
          value={form.template}
          error={errors.template}
          onChange={(e) =>
            handleChange(
              "template",
              e.target.value
            )
          }
        />

        {/* =======================================
            Preview
        ======================================= */}

        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-5">
          <p className="mb-2 text-sm font-medium">
            Preview Template
          </p>

          <p className="whitespace-pre-line text-sm leading-6 text-[var(--text-secondary)]">
            {form.template ||
              "Template notifikasi akan ditampilkan di sini."}
          </p>
        </div>
                {/* =======================================
            Status Aturan
        ======================================= */}

        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-5">
          <div>
            <h3 className="font-medium text-[var(--foreground)]">
              Status Aturan
            </h3>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Aturan yang dinonaktifkan tidak akan
              menghasilkan notifikasi.
            </p>
          </div>

          <Button
            type="button"
            variant={
              form.enabled
                ? "success"
                : "secondary"
            }
            onClick={() =>
              handleChange(
                "enabled",
                !form.enabled
              )
            }
          >
            {form.enabled
              ? "Aktif"
              : "Nonaktif"}
          </Button>
        </div>

        {/* =======================================
            Tombol Aksi
        ======================================= */}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={
              !isValid || loading
            }
          >
            {loading
              ? "Menyimpan..."
              : initialData
              ? "Simpan Perubahan"
              : "Tambah Aturan"}
          </Button>
        </div>

      </form>   
    </Card>
  );
}