import supabase from "../lib/supabase"; // Disesuaikan menjadi default import (tanpa {})

/* ==========================================
   Helper Functions
========================================== */

const getStatus = (value, min, max) => {
  if (value === null || value === undefined) return "Tidak Ada Data";
  if (value < min) return "Rendah";
  if (value > max) return "Tinggi";
  return "Normal";
};

const toNumber = (value) => Number(value ?? 0);

const median = (values) => {
  if (!values || values.length === 0) return 0;
  const sorted = values.map(toNumber).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

const formatChart = (readings = [], field) =>
  readings
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.device_timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Number(item[field] ?? 0),
      device_id: item.device_id, // Untuk memfilter chart per node
    }));

const formatRainChart = (panelLogs = []) =>
  panelLogs
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.created_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Number(item.rain_adc ?? 0),
    }));

const getRainStatus = (adc) => {
  if (adc === null || adc === undefined) return { status: "Tidak Ada Data", intensity: "-" };
  if (adc < 1500) return { status: "Hujan Deras", intensity: "Tinggi" };
  if (adc < 3000) return { status: "Hujan Ringan", intensity: "Sedang" };
  return { status: "Tidak Hujan", intensity: "Cerah / Kering" };
};

/* ==========================================
   Dashboard Service
========================================== */

const dashboardService = {
  async getDashboard() {
    // 1. Fetch data paralel dari Supabase
    const [readingsRes, nodesRes, notificationsRes, panelRes] = await Promise.all([
      supabase
        .from("sensor_readings")
        .select(`*, node_devices (id, name, status)`)
        .order("device_timestamp", { ascending: false }),

      supabase.from("node_devices").select("*").order("id"),

      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("panel_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const { data: readings = [], error: readingsError } = readingsRes;
    const { data: nodes = [] } = nodesRes;
    const { data: notifications = [] } = notificationsRes;
    const { data: panelLogs = [] } = panelRes;

    if (readingsError) throw readingsError;

    const safeReadings = readings ?? [];
    const latestPanel = panelLogs[0] || {};
    const rainInfo = getRainStatus(latestPanel.rain_adc);

    return {
      // Data mentah dikirim agar dikalkulasi dinamis oleh React (Semua Node / Per Node)
      rawReadings: safeReadings,

      charts: {
        temperature: formatChart(safeReadings, "temperature"),
        humidity: formatChart(safeReadings, "humidity"),
        soil: formatChart(safeReadings, "soil_moisture"),
        light: formatChart(safeReadings, "light_intensity"),
        health: formatChart(safeReadings, "health_score"),
        rain: formatRainChart(panelLogs),
      },

      panel: {
        rain: {
          status: rainInfo.status,
          intensity: rainInfo.intensity,
          updatedAt: latestPanel.created_at
            ? new Date(latestPanel.created_at).toLocaleString("id-ID")
            : "-",
        },
      },

      notifications:
        notifications?.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.level,
          isRead: item.is_read,
          time: new Date(item.created_at).toLocaleString("id-ID"),
        })) ?? [],

      sensorNodes:
        nodes?.map((node) => {
          const latestReading = safeReadings.find(
            (item) => item.device_id === node.id
          );

          const healthScore = latestReading
            ? Number(latestReading.health_score ?? 0)
            : 0;

          let healthStatus = "Tidak Aktif";

          if (latestReading) {
            if (healthScore >= 80) {
              healthStatus = "Sehat";
            } else if (healthScore >= 60) {
              healthStatus = "Perlu Perhatian";
            } else {
              healthStatus = "Kritis";
            }
          }

          return {
            id: node.id,
            name: node.name,
            location: node.location || "-",
            status: node.status === "online" ? "Aktif" : "Tidak Aktif",
            value: healthScore,
            unit: "%",
            healthScore,
            healthStatus,
            temperature: latestReading
              ? Number(latestReading.temperature)
              : null,
            humidity: latestReading ? Number(latestReading.humidity) : null,
            soilMoisture: latestReading
              ? Number(latestReading.soil_moisture)
              : null,
            lightIntensity: latestReading
              ? Number(latestReading.light_intensity)
              : null,
            lastUpdate: latestReading
              ? new Date(latestReading.device_timestamp).toLocaleString(
                  "id-ID",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "-",
          };
        }) ?? [],
    };
  },
};

export default dashboardService;