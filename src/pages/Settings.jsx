import { useState } from "react";
import { Save } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

export default function Settings() {
  /* ======================================
     Konfigurasi Monitoring
  ====================================== */
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [sendInterval, setSendInterval] = useState("30");
  const [monitoringMode, setMonitoringMode] = useState("realtime");

  /* ======================================
     Bobot Health Score
  ====================================== */
  const [weights, setWeights] = useState({
    temperature: 25,
    humidity: 25,
    soil: 30,
    light: 20,
  });

  /* ======================================
     Rentang Ideal Sensor
  ====================================== */
  const [ranges, setRanges] = useState({
    temperature: {
      min: 20,
      idealMin: 24,
      idealMax: 30,
      max: 35,
    },
    humidity: {
      min: 60,
      idealMin: 70,
      idealMax: 90,
      max: 95,
    },
    soil: {
      min: 35,
      idealMin: 45,
      idealMax: 80,
      max: 90,
    },
    light: {
      min: 5000,
      idealMin: 8000,
      idealMax: 18000,
      max: 25000,
    },
  });

  /* ======================================
     Pengaturan Notifikasi
  ====================================== */
  const [notification, setNotification] = useState({
    dashboard: true,
    email: false,
    critical: true,
    healthLimit: 80,
  });

  /* ======================================
     Node & Gateway
  ====================================== */
  const [nodeTimeout, setNodeTimeout] = useState("30");
  const [minimumRSSI, setMinimumRSSI] = useState("-90");
  
  // Perbaikan: Menambahkan state batteryLimit yang sebelumnya belum ada
  const [batteryLimit, setBatteryLimit] = useState("20");

  /* ======================================
     Render
  ====================================== */
  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Kelola konfigurasi sistem monitoring, parameter kesehatan tanaman, notifikasi, serta pengaturan node dan gateway."
      />

      <div className="space-y-6">
        {/* ======================================
            Konfigurasi Monitoring
        ====================================== */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Konfigurasi Monitoring
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Atur cara sistem melakukan pembacaan sensor, pengiriman data, dan mode operasi perangkat.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Interval Pembacaan Sensor"
              value={refreshInterval}
              onValueChange={setRefreshInterval}
              helperText="Seberapa sering sensor melakukan pembacaan data."
            >
              <Select.Item value="5">5 Detik</Select.Item>
              <Select.Item value="10">10 Detik</Select.Item>
              <Select.Item value="30">30 Detik</Select.Item>
              <Select.Item value="60">60 Detik</Select.Item>
            </Select>

            <Select
              label="Interval Pengiriman Data"
              value={sendInterval}
              onValueChange={setSendInterval}
              helperText="Interval pengiriman data dari gateway ke server."
            >
              <Select.Item value="30">30 Detik</Select.Item>
              <Select.Item value="60">1 Menit</Select.Item>
              <Select.Item value="300">5 Menit</Select.Item>
              <Select.Item value="600">10 Menit</Select.Item>
            </Select>

            <Select
              label="Mode Monitoring"
              value={monitoringMode}
              onValueChange={setMonitoringMode}
              helperText="Mode operasi sistem monitoring."
            >
              <Select.Item value="realtime">Real-time</Select.Item>
              <Select.Item value="power">Hemat Daya</Select.Item>
            </Select>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5">
            <h3 className="mb-3 text-sm font-semibold">Informasi</h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>• Interval pembacaan menentukan seberapa sering sensor mengambil data dari lingkungan.</li>
              <li>• Interval pengiriman menentukan seberapa sering gateway mengirim data ke server.</li>
              <li>• Mode <strong>Real-time</strong> memberikan pembaruan data lebih cepat namun menggunakan daya lebih besar.</li>
              <li>• Mode <strong>Hemat Daya</strong> mengurangi frekuensi pembacaan dan pengiriman data untuk menghemat konsumsi energi perangkat.</li>
            </ul>
          </div>
        </Card>

        {/* ======================================
            Parameter Kesehatan Kebun
        ====================================== */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Parameter Kesehatan Kebun
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Tentukan bobot setiap parameter sensor yang digunakan untuk menghitung Health Score kebun.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Bobot Suhu (%)"
              type="number"
              min="0"
              max="100"
              value={weights.temperature}
              onChange={(e) => setWeights({ ...weights, temperature: Number(e.target.value) })}
            />
            <Input
              label="Bobot Kelembapan Udara (%)"
              type="number"
              min="0"
              max="100"
              value={weights.humidity}
              onChange={(e) => setWeights({ ...weights, humidity: Number(e.target.value) })}
            />
            <Input
              label="Bobot Kelembapan Tanah (%)"
              type="number"
              min="0"
              max="100"
              value={weights.soil}
              onChange={(e) => setWeights({ ...weights, soil: Number(e.target.value) })}
            />
            <Input
              label="Bobot Intensitas Cahaya (%)"
              type="number"
              min="0"
              max="100"
              value={weights.light}
              onChange={(e) => setWeights({ ...weights, light: Number(e.target.value) })}
            />
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Bobot</span>
              <span
                className={`text-lg font-bold ${
                  weights.temperature + weights.humidity + weights.soil + weights.light === 100
                    ? "text-[var(--success)]"
                    : "text-[var(--destructive)]"
                }`}
              >
                {weights.temperature + weights.humidity + weights.soil + weights.light}%
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Total bobot seluruh parameter harus bernilai <strong>100%</strong>. Health Score dihitung menggunakan rata-rata berbobot dari skor setiap sensor.
            </p>

            <div className="mt-5 rounded-lg bg-[var(--background)] p-4 text-sm">
              <p className="font-medium">Rumus Health Score</p>
              <p className="mt-2 font-mono text-[var(--muted-foreground)] break-all">
                (Skor Suhu × Bobot Suhu) + (Skor Kelembapan Udara × Bobot Kelembapan Udara) + (Skor Kelembapan Tanah × Bobot Kelembapan Tanah) + (Skor Intensitas Cahaya × Bobot Intensitas Cahaya)
              </p>
            </div>
          </div>
        </Card>

        {/* ======================================
            Rentang Ideal Sensor
        ====================================== */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Rentang Ideal Sensor</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Tentukan batas minimum, rentang ideal, dan batas maksimum untuk setiap parameter sensor. Nilai ini digunakan sebagai acuan dalam perhitungan Health Score.
            </p>
          </div>

          <div className="space-y-8">
            {/* Suhu */}
            <div>
              <h3 className="mb-4 font-semibold">Suhu Udara (°C)</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Minimum" type="number" value={ranges.temperature.min} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, min: Number(e.target.value) } })} />
                <Input label="Ideal Minimum" type="number" value={ranges.temperature.idealMin} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, idealMin: Number(e.target.value) } })} />
                <Input label="Ideal Maksimum" type="number" value={ranges.temperature.idealMax} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, idealMax: Number(e.target.value) } })} />
                <Input label="Maksimum" type="number" value={ranges.temperature.max} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, max: Number(e.target.value) } })} />
              </div>
            </div>

            {/* Kelembapan Udara */}
            <div>
              <h3 className="mb-4 font-semibold">Kelembapan Udara (%)</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Minimum" type="number" value={ranges.humidity.min} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, min: Number(e.target.value) } })} />
                <Input label="Ideal Minimum" type="number" value={ranges.humidity.idealMin} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, idealMin: Number(e.target.value) } })} />
                <Input label="Ideal Maksimum" type="number" value={ranges.humidity.idealMax} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, idealMax: Number(e.target.value) } })} />
                <Input label="Maksimum" type="number" value={ranges.humidity.max} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, max: Number(e.target.value) } })} />
              </div>
            </div>

            {/* Kelembapan Tanah */}
            <div>
              <h3 className="mb-4 font-semibold">Kelembapan Tanah (%)</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Minimum" type="number" value={ranges.soil.min} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, min: Number(e.target.value) } })} />
                <Input label="Ideal Minimum" type="number" value={ranges.soil.idealMin} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, idealMin: Number(e.target.value) } })} />
                <Input label="Ideal Maksimum" type="number" value={ranges.soil.idealMax} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, idealMax: Number(e.target.value) } })} />
                <Input label="Maksimum" type="number" value={ranges.soil.max} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, max: Number(e.target.value) } })} />
              </div>
            </div>

            {/* Intensitas Cahaya */}
            <div>
              <h3 className="mb-4 font-semibold">Intensitas Cahaya (lux)</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Input label="Minimum" type="number" value={ranges.light.min} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, min: Number(e.target.value) } })} />
                <Input label="Ideal Minimum" type="number" value={ranges.light.idealMin} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, idealMin: Number(e.target.value) } })} />
                <Input label="Ideal Maksimum" type="number" value={ranges.light.idealMax} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, idealMax: Number(e.target.value) } })} />
                <Input label="Maksimum" type="number" value={ranges.light.max} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, max: Number(e.target.value) } })} />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5">
            <h3 className="font-semibold">Cara Kerja</h3>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Nilai sensor yang berada pada rentang <strong>Ideal Minimum</strong> hingga <strong>Ideal Maksimum</strong> akan memperoleh skor tertinggi. Semakin jauh nilai sensor dari rentang ideal menuju batas minimum atau maksimum, maka skor parameter akan menurun secara bertahap hingga mendekati 0.
            </p>
          </div>
        </Card>

        {/* ======================================
            Pengaturan Notifikasi
        ====================================== */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Pengaturan Notifikasi</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Atur kondisi yang memicu notifikasi agar sistem hanya mengirimkan peringatan ketika benar-benar diperlukan.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Select label="Notifikasi Dashboard" value={notification.dashboard ? "on" : "off"} onValueChange={(value) => setNotification({ ...notification, dashboard: value === "on" })}>
              <Select.Item value="on">Aktif</Select.Item>
              <Select.Item value="off">Nonaktif</Select.Item>
            </Select>

            <Select label="Email Notifikasi" value={notification.email ? "on" : "off"} onValueChange={(value) => setNotification({ ...notification, email: value === "on" })}>
              <Select.Item value="on">Aktif</Select.Item>
              <Select.Item value="off">Nonaktif</Select.Item>
            </Select>

            <Select label="Peringatan Kritis" value={notification.critical ? "on" : "off"} onValueChange={(value) => setNotification({ ...notification, critical: value === "on" })}>
              <Select.Item value="on">Aktif</Select.Item>
              <Select.Item value="off">Nonaktif</Select.Item>
            </Select>

            <Input
              label="Ambang Health Score"
              type="number"
              min="0"
              max="100"
              value={notification.healthLimit}
              onChange={(e) => setNotification({ ...notification, healthLimit: Number(e.target.value) })}
              helperText="Notifikasi dikirim jika Health Score di bawah nilai ini."
            />
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">Parameter Alert</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <Select label="Suhu Melebihi Batas Selama" defaultValue="5">
                <Select.Item value="1">1 Menit</Select.Item>
                <Select.Item value="3">3 Menit</Select.Item>
                <Select.Item value="5">5 Menit</Select.Item>
                <Select.Item value="10">10 Menit</Select.Item>
              </Select>

              <Select label="Kelembapan Tanah di Luar Batas Selama" defaultValue="10">
                <Select.Item value="1">1 Menit</Select.Item>
                <Select.Item value="5">5 Menit</Select.Item>
                <Select.Item value="10">10 Menit</Select.Item>
                <Select.Item value="15">15 Menit</Select.Item>
              </Select>

              <Select label="Kelembapan Udara di Luar Batas Selama" defaultValue="10">
                <Select.Item value="1">1 Menit</Select.Item>
                <Select.Item value="5">5 Menit</Select.Item>
                <Select.Item value="10">10 Menit</Select.Item>
                <Select.Item value="15">15 Menit</Select.Item>
              </Select>

              
              <Select label="Intensitas Cahaya di Luar Batas Selama" defaultValue="10">
                <Select.Item value="1">1 Menit</Select.Item>
                <Select.Item value="5">5 Menit</Select.Item>
                <Select.Item value="10">10 Menit</Select.Item>
                <Select.Item value="15">15 Menit</Select.Item>
              </Select>

            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5">
            <h3 className="font-semibold">Cara Kerja Notifikasi</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>• Notifikasi Dashboard akan muncul pada halaman dashboard ketika terjadi kondisi abnormal.</li>
              <li>• Email Notifikasi dikirim kepada administrator apabila kondisi penting terdeteksi.</li>
              <li>• Peringatan Kritis hanya dikirim ketika nilai sensor tetap berada di luar rentang ideal sesuai durasi yang ditentukan.</li>
              <li>• Health Score di bawah ambang batas akan menghasilkan notifikasi prioritas tinggi.</li>
            </ul>
          </div>
        </Card>

        {/* ======================================
            Konfigurasi Node & Gateway
        ====================================== */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Konfigurasi Node & Gateway</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Atur parameter komunikasi perangkat untuk menentukan status node, kualitas sinyal, dan kondisi baterai.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Timeout Node (detik)"
              type="number"
              min="5"
              value={nodeTimeout}
              onChange={(e) => setNodeTimeout(e.target.value)}
              helperText="Node dianggap Offline jika tidak mengirim data dalam waktu ini."
            />
            <Input
              label="RSSI Minimum (dBm)"
              type="number"
              value={minimumRSSI}
              onChange={(e) => setMinimumRSSI(e.target.value)}
              helperText="Sinyal di bawah nilai ini akan dianggap lemah."
            />
            <Input
              label="Daya Minimum (volts)"
              type="number"
              min="0"
              max="100"
              value={batteryLimit}
              onChange={(e) => setBatteryLimit(e.target.value)}
              helperText="Notifikasi dikirim jika baterai berada di bawah nilai ini."
            />
          </div>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5">
            <h3 className="font-semibold">Cara Kerja</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>• Node akan berubah menjadi <strong>Offline</strong> apabila tidak mengirim data melebihi waktu timeout.</li>
              <li>• RSSI di bawah batas minimum akan ditampilkan sebagai <strong>Sinyal Lemah</strong>.</li>
              <li>• Jika daya berada di bawah batas minimum, sistem akan mengirim notifikasi kepada administrator.</li>
            </ul>
          </div>
        </Card>

        {/* ======================================
            Tombol Aksi
        ====================================== */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline">
            Kembalikan Pengaturan Default
          </Button>
          <Button startContent={<Save size={18} />}>
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </>
  );
}