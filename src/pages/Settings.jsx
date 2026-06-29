import { Save } from "lucide-react";

import PageHeader from "../components/common/PageHeader";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Kelola preferensi aplikasi dan konfigurasi sistem monitoring."
      />

      <div className="space-y-6">

        {/* ======================================
            System Settings
        ====================================== */}

        <Card className="p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Pengaturan Sistem
          </h2>

          <div className="grid gap-5 md:grid-cols-3">

            <Select
              label="Interval Refresh"
              options={[
                { label: "5 Detik", value: 5 },
                { label: "10 Detik", value: 10 },
                { label: "30 Detik", value: 30 },
                { label: "60 Detik", value: 60 },
              ]}
            />

            <Select
              label="Bahasa"
              options={[
                {
                  label: "Indonesia",
                  value: "id",
                },
                {
                  label: "English",
                  value: "en",
                },
              ]}
            />

            <Select
              label="Zona Waktu"
              options={[
                {
                  label: "Asia/Makassar",
                  value: "Asia/Makassar",
                },
                {
                  label: "Asia/Jakarta",
                  value: "Asia/Jakarta",
                },
              ]}
            />

          </div>

        </Card>

        {/* ======================================
            Sensor Threshold
        ====================================== */}

        <Card className="p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Threshold Sensor
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Temperature Minimum (°C)"
              defaultValue="24"
            />

            <Input
              label="Temperature Maximum (°C)"
              defaultValue="32"
            />

            <Input
              label="Humidity Minimum (%)"
              defaultValue="70"
            />

            <Input
              label="Humidity Maximum (%)"
              defaultValue="90"
            />

            <Input
              label="Soil Moisture Minimum (%)"
              defaultValue="45"
            />

            <Input
              label="Soil Moisture Maximum (%)"
              defaultValue="80"
            />

            <Input
              label="Light Minimum (Lux)"
              defaultValue="8000"
            />

            <Input
              label="Light Maximum (Lux)"
              defaultValue="25000"
            />

          </div>

        </Card>

        {/* ======================================
            Notification
        ====================================== */}

        <Card className="p-6">

          <h2 className="mb-6 text-xl font-semibold">
            Notifikasi
          </h2>

          <div className="grid gap-5 md:grid-cols-3">

            <Select
              label="Email Notification"
              options={[
                {
                  label: "Enabled",
                  value: true,
                },
                {
                  label: "Disabled",
                  value: false,
                },
              ]}
            />

            <Select
              label="Push Notification"
              options={[
                {
                  label: "Enabled",
                  value: true,
                },
                {
                  label: "Disabled",
                  value: false,
                },
              ]}
            />

            <Select
              label="Critical Alert"
              options={[
                {
                  label: "Enabled",
                  value: true,
                },
                {
                  label: "Disabled",
                  value: false,
                },
              ]}
            />

          </div>

        </Card>

        {/* ======================================
            Save
        ====================================== */}

        <div className="flex justify-end">

          <Button
            startContent={<Save size={18} />}
          >
            Simpan Perubahan
          </Button>

        </div>

      </div>

    </>
  );
}