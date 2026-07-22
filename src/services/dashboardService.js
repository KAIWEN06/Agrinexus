import { supabase } from "../lib/supabase";

/* ==========================================
   Helper Functions
========================================== */

const getStatus = (value, min, max) => {
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
    }));

const calculateMedian = (readings = []) => ({
  temperature: median(readings.map((r) => r.temperature)),
  humidity: median(readings.map((r) => r.humidity)),
  soil_moisture: median(readings.map((r) => r.soil_moisture)),
  light_intensity: median(readings.map((r) => r.light_intensity)),
  health_score: median(readings.map((r) => r.health_score)),
});

/* ==========================================
   Dashboard Service
========================================== */

const dashboardService = {
  async getDashboard() {
    // 1. Fetch data secara paralel
    const [readingsRes, nodesRes, notificationsRes] = await Promise.all([
      supabase
        .from("sensor_readings")
        .select(
          `
          *,
          node_devices (
            id,
            name,
            status
          )
        `
        )
        .order("device_timestamp", { ascending: false }),

      supabase.from("node_devices").select("*").order("id"),

      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // 2. Destructuring response
    const { data: readings = [], error: readingsError } = readingsRes;
    const { data: nodes = [] } = nodesRes;
    const { data: notifications = [] } = notificationsRes;

    if (readingsError) throw readingsError;

    // 3. Olah data
    const safeReadings = readings ?? [];
    const latest = safeReadings[0];
    const medianData = calculateMedian(safeReadings);

    // 4. Return Objek Dashboard
    return {
      // =====================================
      // CARD (SUPABASE MEDIAN)
      // =====================================
      statistics: {
        temperature: {
          value: Number((medianData.temperature ?? 0).toFixed(1)),
          status: getStatus(medianData.temperature, 24, 32),
          trend: 0,
          trendLabel: "Median",
        },
        humidity: {
          value: Number((medianData.humidity ?? 0).toFixed(1)),
          status: getStatus(medianData.humidity, 70, 90),
          trend: 0,
          trendLabel: "Median",
        },
        soil: {
          value: Number((medianData.soil_moisture ?? 0).toFixed(1)),
          status: getStatus(medianData.soil_moisture, 45, 80),
          trend: 0,
          trendLabel: "Median",
        },
        light: {
          value: Number((medianData.light_intensity ?? 0).toFixed(0)),
          status: getStatus(medianData.light_intensity, 8000, 25000),
          trend: 0,
          trendLabel: "Median",
        },
      },

      // =====================================
      // HEALTH SCORE
      // =====================================
      health: {
        score: Number((medianData.health_score ?? 0).toFixed(1)),
        status:
          medianData.health_score >= 80
            ? "Sehat"
            : medianData.health_score >= 60
            ? "Perlu Perhatian"
            : "Kritis",
        description: "Berdasarkan median seluruh data sensor.",
      },

      // =====================================
      // CHART
      // =====================================
      charts: {
        temperature: formatChart(safeReadings, "temperature"),
        humidity: formatChart(safeReadings, "humidity"),
        soil: formatChart(safeReadings, "soil_moisture"),
        light: formatChart(safeReadings, "light_intensity"),
        rain: [],
      },

      // =====================================
      // PANEL
      // =====================================
      panel: {
        rain: {
          status: "Tidak Hujan",
          intensity: "-",
          updatedAt: latest?.device_timestamp
            ? new Date(latest.device_timestamp).toLocaleString("id-ID")
            : "-",
        },
      },

      // =====================================
      // NOTIFICATIONS
      // =====================================
      notifications:
        notifications?.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.level,
          isRead: item.is_read,
          time: new Date(item.created_at).toLocaleString("id-ID"),
        })) ?? [],

      // =====================================
      // SENSOR NODES
      // =====================================
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
            location: "-",
            status: latestReading != null ? "Aktif" : "Tidak Aktif",
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