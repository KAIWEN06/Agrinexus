import { useState, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Radio,
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

// Import Agronomic Reasoning Engine dari folder services
import { generateAgronomicReasoning } from "../services/agriReasoningEngine";

/* ==========================================
   Helper Functions
========================================== */

const getStatus = (value, min, max) => {
  if (value === null || value === undefined) return "Tidak Ada Data";
  if (value < min) return "Rendah";
  if (value > max) return "Tinggi";
  return "Normal";
};

const median = (values) => {
  if (!values || values.length === 0) return 0;
  const sorted = values.map(Number).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

const calculateTrend = (current, previous) => {
  if (
    previous === null ||
    previous === undefined ||
    Number(previous) === 0 ||
    current === null ||
    current === undefined
  ) {
    return 0;
  }
  const change = ((Number(current) - Number(previous)) / Number(previous)) * 100;
  return Number(change.toFixed(1));
};

export default function Dashboard() {
  const { dashboard, loading, error } = useDashboard();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const {
    rawReadings = [],
    settings = {},
    charts,
    panel,
    sensorNodes = [],
  } = dashboard || {};

  const limits = useMemo(() => ({
    tempMin: Number(settings.temperature_ideal_min ?? settings.temperature_min ?? 24),
    tempMax: Number(settings.temperature_ideal_max ?? settings.temperature_max ?? 32),
    humMin: Number(settings.humidity_ideal_min ?? settings.humidity_min ?? 70),
    humMax: Number(settings.humidity_ideal_max ?? settings.humidity_max ?? 90),
    soilMin: Number(settings.soil_ideal_min ?? settings.soil_min ?? 45),
    soilMax: Number(settings.soil_ideal_max ?? settings.soil_max ?? 80),
    lightMin: Number(settings.light_ideal_min ?? settings.light_min ?? 8000),
    lightMax: Number(settings.light_ideal_max ?? settings.light_max ?? 25000),
    healthLimit: Number(settings.health_limit ?? 80),
  }), [settings]);

  const activeNodeData = useMemo(() => {
    if (!rawReadings || rawReadings.length === 0) {
      return {
        statistics: {
          temperature: { value: 0, status: "-", trend: 0 },
          humidity: { value: 0, status: "-", trend: 0 },
          soil: { value: 0, status: "-", trend: 0 },
          light: { value: 0, status: "-", trend: 0 },
        },
        health: {
          score: 0,
          status: "Tidak Diketahui",
          description: "-",
          insights: [],
          reasoning: null,
        },
      };
    }

    // Ambil histori panel_logs jika tersedia dari dashboard
    const panelLogs = dashboard?.panelLogs || charts?.rain || [];

    if (selectedNodeId === null) {
      // SEMUA NODE (Menggunakan Median)
      const latest = rawReadings[0];
      const previous = rawReadings[1];

      const medTemp = median(rawReadings.map((r) => r.temperature));
      const medHum = median(rawReadings.map((r) => r.humidity));
      const medSoil = median(rawReadings.map((r) => r.soil_moisture));
      const medLight = median(rawReadings.map((r) => r.light_intensity));
      const medHealth = median(rawReadings.map((r) => r.health_score));

      const statistics = {
        temperature: {
          value: Number(medTemp.toFixed(1)),
          status: getStatus(medTemp, limits.tempMin, limits.tempMax),
          trend: calculateTrend(latest?.temperature, previous?.temperature),
          trendLabel: "dibandingkan sebelumnya",
        },
        humidity: {
          value: Number(medHum.toFixed(1)),
          status: getStatus(medHum, limits.humMin, limits.humMax),
          trend: calculateTrend(latest?.humidity, previous?.humidity),
          trendLabel: "dibandingkan sebelumnya",
        },
        soil: {
          value: Number(medSoil.toFixed(1)),
          status: getStatus(medSoil, limits.soilMin, limits.soilMax),
          trend: calculateTrend(latest?.soil_moisture, previous?.soil_moisture),
          trendLabel: "dibandingkan sebelumnya",
        },
        light: {
          value: Number(medLight.toFixed(0)),
          status: getStatus(medLight, limits.lightMin, limits.lightMax),
          trend: calculateTrend(latest?.light_intensity, previous?.light_intensity),
          trendLabel: "dibandingkan sebelumnya",
        },
      };

      // Jalankan Reasoning Engine Agronomis untuk Semua Node
      const reasoning = generateAgronomicReasoning(
        statistics,
        settings,
        panelLogs,
        rawReadings,
        Number(medHealth.toFixed(1))
      );

      return {
        statistics,
        health: {
          score: reasoning.health_score,
          status: reasoning.overall_status,
          severity: reasoning.severity,
          description: "Nilai agregat median dari seluruh node perkebunan.",
          reasoning: reasoning, // Penyimpanan objek JSON reasoning lengkap
        },
      };
    } else {
      // PER NODE (Filter spesifik device_id)
      const nodeReadings = rawReadings.filter(
        (r) => Number(r.device_id) === Number(selectedNodeId)
      );
      
      const latest = nodeReadings[0] || {};
      const previous = nodeReadings[1] || {};

      const temp = Number(latest.temperature ?? 0);
      const hum = Number(latest.humidity ?? 0);
      const soil = Number(latest.soil_moisture ?? 0);
      const light = Number(latest.light_intensity ?? 0);
      const healthScore = Number(latest.health_score ?? 0);

      const selectedNodeObj = sensorNodes.find((n) => Number(n.id) === Number(selectedNodeId));

      const statistics = {
        temperature: {
          value: temp,
          status: getStatus(temp, limits.tempMin, limits.tempMax),
          trend: calculateTrend(latest?.temperature, previous?.temperature),
          trendLabel: "dibandingkan sebelumnya",
        },
        humidity: {
          value: hum,
          status: getStatus(hum, limits.humMin, limits.humMax),
          trend: calculateTrend(latest?.humidity, previous?.humidity),
          trendLabel: "dibandingkan sebelumnya",
        },
        soil: {
          value: soil,
          status: getStatus(soil, limits.soilMin, limits.soilMax),
          trend: calculateTrend(latest?.soil_moisture, previous?.soil_moisture),
          trendLabel: "dibandingkan sebelumnya",
        },
        light: {
          value: light,
          status: getStatus(light, limits.lightMin, limits.lightMax),
          trend: calculateTrend(latest?.light_intensity, previous?.light_intensity),
          trendLabel: "dibandingkan sebelumnya",
        },
      };

      // Jalankan Reasoning Engine Agronomis untuk Node Terpilih
      const reasoning = generateAgronomicReasoning(
        statistics,
        settings,
        panelLogs,
        nodeReadings,
        healthScore
      );

      return {
        statistics,
        health: {
          score: reasoning.health_score,
          status: reasoning.overall_status,
          severity: reasoning.severity,
          description: `Kondisi node khusus: ${selectedNodeObj?.name || `Node ${selectedNodeId}`}.`,
          reasoning: reasoning, // Penyimpanan objek JSON reasoning lengkap
        },
      };
    }
  }, [rawReadings, selectedNodeId, sensorNodes, limits, settings, dashboard, charts]);

  const filteredCharts = useMemo(() => {
    if (!charts) return {};
    if (selectedNodeId === null) return charts;

    const filterByNode = (dataList = []) =>
      dataList.filter((item) => Number(item.device_id) === Number(selectedNodeId));

    return {
      temperature: filterByNode(charts.temperature),
      humidity: filterByNode(charts.humidity),
      soil: filterByNode(charts.soil),
      light: filterByNode(charts.light),
      health: filterByNode(charts.health),
      rain: charts.rain,
    };
  }, [charts, selectedNodeId]);

  if (loading || !dashboard) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Memuat beranda...</p>
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

      {/* Selector Tab Node */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedNodeId(null)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            selectedNodeId === null
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          <Radio className="h-4 w-4" />
          Semua Node
        </button>

        {sensorNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => setSelectedNodeId(node.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedNodeId === node.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                node.status === "Aktif" ? "bg-green-400" : "bg-gray-400"
              }`}
            />
            {node.name}
          </button>
        ))}
      </div>

      {/* Parameter Sensor */}
      <section className="mt-6">
        <PageHeader
          title="Parameter Sensor"
          description={
            selectedNodeId === null
              ? "Menampilkan ringkasan median dari seluruh node."
              : "Menampilkan data parameter terbaru dari node terpilih."
          }
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatisticCard
            title="Suhu"
            value={activeNodeData.statistics.temperature.value}
            unit="°C"
            icon={Thermometer}
            status={activeNodeData.statistics.temperature.status}
            trend={activeNodeData.statistics.temperature.trend}
            trendLabel={activeNodeData.statistics.temperature.trendLabel}
          />

          <StatisticCard
            title="Kelembapan Udara"
            value={activeNodeData.statistics.humidity.value}
            unit="%"
            icon={Droplets}
            status={activeNodeData.statistics.humidity.status}
            trend={activeNodeData.statistics.humidity.trend}
            trendLabel={activeNodeData.statistics.humidity.trendLabel}
          />

          <StatisticCard
            title="Kelembapan Tanah"
            value={activeNodeData.statistics.soil.value}
            unit="ADC"
            icon={Sprout}
            status={activeNodeData.statistics.soil.status}
            trend={activeNodeData.statistics.soil.trend}
            trendLabel={activeNodeData.statistics.soil.trendLabel}
          />

          <StatisticCard
            title="Intensitas Cahaya"
            value={activeNodeData.statistics.light.value}
            unit="Lux"
            icon={Sun}
            status={activeNodeData.statistics.light.status}
            trend={activeNodeData.statistics.light.trend}
            trendLabel={activeNodeData.statistics.light.trendLabel}
          />
        </div>
      </section>

      {/* Panel Kontrol - Hujan */}
      <section className="mt-8">
        <PageHeader
          title="Panel Kontrol Terpusat"
          description="Monitoring sensor hujan dan status stasiun panel utama."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <RainStatusCard
            status={panel?.rain?.status}
            intensity={panel?.rain?.intensity}
            updatedAt={panel?.rain?.updatedAt}
          />
        </div>
      </section>

      {/* Grafik Monitoring & Hasil Reasoning Engine */}
      <section className="mt-8">
        <PageHeader
          title="Grafik & Analisis Agronomis"
          description="Visualisasi parameter serta hasil diagnosa pintar mengenai akar masalah dan tindakan presisi."
        />

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <HealthScoreChart
            score={activeNodeData.health.score}
            status={activeNodeData.health.status}
            severity={activeNodeData.health.severity}
            description={activeNodeData.health.description}
            reasoning={activeNodeData.health.reasoning}
          />

          <TemperatureChart data={filteredCharts.temperature} />
          <HumidityChart data={filteredCharts.humidity} />
          <SoilMoistureChart data={filteredCharts.soil} />
          <LightChart data={filteredCharts.light} />
          <RainChart data={filteredCharts.rain} />
        </div>
      </section>

      {/* Daftar Node Sensor */}
      <section className="mt-8">
        <PageHeader
          title="Daftar Node Sensor"
          description="Status seluruh node sensor yang terhubung ke sistem."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sensorNodes.length > 0 ? (
            sensorNodes.map((node) => (
              <SensorCard key={node.id} {...node} />
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