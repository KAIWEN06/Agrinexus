import {
  RefreshCw,
  Thermometer,
  Droplets,
  Sprout,
  Sun,
} from "lucide-react";

import useDashboard from "../hooks/useDashboard";

import Button from "../components/ui/Button";
import PageHeader from "../components/common/PageHeader";

import StatisticCard from "../components/cards/StatisticCard";
import HealthScoreCard from "../components/cards/HealthScoreCard";
import NotificationCard from "../components/cards/NotificationCard";
import SensorCard from "../components/cards/SensorCard";

import TemperatureChart from "../components/charts/TemperatureChart";
import HumidityChart from "../components/charts/HumidityChart";
import SoilMoistureChart from "../components/charts/SoilMoistureChart";
import LightChart from "../components/charts/LightChart";
import HealthScoreChart from "../components/charts/HealthScoreChart";

export default function Dashboard() {
  const {
    dashboard,
    loading,
    error,
    refreshDashboard,
  } = useDashboard();

  const {
    statistics,
    health,
    charts,
    notifications,
    sensorNodes,
  } = dashboard;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Monitor kondisi lingkungan perkebunan secara realtime."
        action={
          <Button
            startContent={<RefreshCw size={18} />}
            onClick={refreshDashboard}
          >
            Refresh
          </Button>
        }
      />

      {/* ======================================
          Health & Statistics
      ====================================== */}

      <div className="grid gap-6 xl:grid-cols-6">

        <HealthScoreCard
          className="xl:col-span-2"
          score={health.score}
          status={health.status}
          description={health.description}
        />

        <StatisticCard
          title="Temperature"
          value={statistics.temperature.value}
          unit="°C"
          icon={Thermometer}
          status={statistics.temperature.status}
          trend={statistics.temperature.trend}
          trendLabel={statistics.temperature.trendLabel}
        />

        <StatisticCard
          title="Humidity"
          value={statistics.humidity.value}
          unit="%"
          icon={Droplets}
          status={statistics.humidity.status}
          trend={statistics.humidity.trend}
          trendLabel={statistics.humidity.trendLabel}
        />

        <StatisticCard
          title="Soil Moisture"
          value={statistics.soil.value}
          unit="%"
          icon={Sprout}
          status={statistics.soil.status}
          trend={statistics.soil.trend}
          trendLabel={statistics.soil.trendLabel}
        />

        <StatisticCard
          title="Light Intensity"
          value={statistics.light.value}
          unit="Lux"
          icon={Sun}
          status={statistics.light.status}
          trend={statistics.light.trend}
          trendLabel={statistics.light.trendLabel}
        />

      </div>
      
      {/* ======================================
          Charts
      ====================================== */}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <TemperatureChart
          data={charts.temperature}
        />

        <HealthScoreChart
          score={health.score}
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

        <div className="space-y-4">

          {notifications.length > 0 ? (

            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                {...notification}
              />
            ))

          ) : (

            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
              Tidak ada notifikasi.
            </div>

          )}

        </div>

      </div>

      {/* ======================================
          Sensor Nodes
      ====================================== */}

      <section className="mt-8">

        <PageHeader
          title="Sensor Nodes"
          description="Status seluruh node sensor yang aktif."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {sensorNodes.length > 0 ? (

            sensorNodes.map((node) => (
              <SensorCard
                key={node.id}
                {...node}
              />
            ))

          ) : (

            <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-500">
              Tidak ada sensor yang tersedia.
            </div>

          )}

        </div>

      </section>

    </>
  );
}
