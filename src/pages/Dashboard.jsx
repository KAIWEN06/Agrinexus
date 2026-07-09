import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
} from "lucide-react";

import useDashboard from "../hooks/useDashboard";

import PageHeader from "../components/common/PageHeader";

import StatisticCard from "../components/cards/StatisticCard";
import SensorCard from "../components/cards/SensorCard";

import TemperatureChart from "../components/charts/TemperatureChart";
import HumidityChart from "../components/charts/HumidityChart";
import SoilMoistureChart from "../components/charts/SoilMoistureChart";
import LightChart from "../components/charts/LightChart";
import HealthScoreChart from "../components/charts/HealthScoreChart";
import RainStatusCard from "../components/cards/RainStatusCard";
import RainChart from "../components/charts/RainChart";

export default function Dashboard() {
  const {
    dashboard,
    loading,
    error,
  } = useDashboard();

  if (loading || !dashboard) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          Memuat beranda...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Gagal memuat data beranda.
      </div>
    );
  }

  const {
    statistics,
    health,
    charts,
    panel,
    sensorNodes,
  } = dashboard;

  const now = new Date();

  const currentDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* ======================================
          Header
      ====================================== */}

      <PageHeader
        title="Beranda"
        description="Memantau kondisi lingkungan perkebunan secara real-time."
        action={
          <div className="text-left md:text-right">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {currentDate}
            </p>

            <p className="text-xs text-[var(--text-secondary)]">
              Pukul {currentTime} WITA
            </p>
          </div>
        }
      />

      {/* ======================================
          Parameter Sensor
      ====================================== */}

      <section className="mt-8">
        <PageHeader
          title="Parameter Sensor"
          description="Monitoring parameter lingkungan yang dibaca oleh sensor."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatisticCard
            title="Suhu"
            value={statistics.temperature.value}
            unit="°C"
            icon={Thermometer}
            status={statistics.temperature.status}
            trend={statistics.temperature.trend}
            trendLabel={statistics.temperature.trendLabel}
          />

          <StatisticCard
            title="Kelembapan Udara"
            value={statistics.humidity.value}
            unit="%"
            icon={Droplets}
            status={statistics.humidity.status}
            trend={statistics.humidity.trend}
            trendLabel={statistics.humidity.trendLabel}
          />

          <StatisticCard
            title="Kelembapan Tanah"
            value={statistics.soil.value}
            unit="ADC"
            icon={Sprout}
            status={statistics.soil.status}
            trend={statistics.soil.trend}
            trendLabel={statistics.soil.trendLabel}
          />

          <StatisticCard
            title="Intensitas Cahaya"
            value={statistics.light.value}
            unit="Lux"
            icon={Sun}
            status={statistics.light.status}
            trend={statistics.light.trend}
            trendLabel={statistics.light.trendLabel}
          />

        </div>
      </section>

      {/* ======================================
          Panel Kontrol
      ====================================== */}

      <section className="mt-8">
        <PageHeader
          title="Panel Kontrol"
          description="Monitoring sensor hujan dan status panel kontrol."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

          <RainStatusCard
            status={panel.rain.status}
            intensity={panel.rain.intensity}
            updatedAt={panel.rain.updatedAt}
          />

        </div>
      </section>

      {/* ======================================
          Grafik Monitoring
      ====================================== */}

      <section className="mt-8">
        <PageHeader
          title="Grafik Monitoring"
          description="Visualisasi perubahan data sensor berdasarkan waktu."
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <HealthScoreChart
            score={health.score}
          />

          <TemperatureChart
            data={charts.temperature}
          />

          <HumidityChart
            data={charts.humidity}
          />

          <SoilMoistureChart
            data={charts.soil}
          />

          <LightChart
            data={charts.light}
          />

          <RainChart
            data={charts.rain}
          />

        </div>
      </section>

      {/* ======================================
          Daftar Node Sensor
      ====================================== */}

      <section className="mt-8">
        <PageHeader
          title="Daftar Node Sensor"
          description="Status seluruh node sensor yang terhubung ke sistem."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {sensorNodes.length > 0 ? (
            sensorNodes.map((node) => (
              <SensorCard
                key={node.id}
                {...node}
              />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-500">
              Belum ada node sensor yang tersedia.
            </div>
          )}

        </div>
      </section>
    </>
  );
}