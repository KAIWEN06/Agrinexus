import axios from "axios";
import { supabase } from "../lib/supabase";

const API_MEDIAN =
  "https://api-iot-agrinexus.kipen.my.id/apiv1/sensor-median";

const getStatus = (value, min, max) => {
  if (value < min) return "Rendah";
  if (value > max) return "Tinggi";
  return "Normal";
};

const dashboardService = {
  async getDashboard() {
    // ===========================
    // Ambil semua data bersamaan
    // ===========================

    const [
      medianRes,
      readingsRes,
      nodesRes,
      notificationsRes,
    ] = await Promise.all([
      axios.get(API_MEDIAN),

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
        .order("device_timestamp", {
          ascending: false,
        }),

      supabase
        .from("node_devices")
        .select("*")
        .order("id"),

      supabase
        .from("notifications")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(5),
    ]);

    const median = medianRes.data;

    const {
      data: readings,
      error,
    } = readingsRes;

    if (error) throw error;

    const { data: nodes } = nodesRes;

    const { data: notifications } = notificationsRes;

    const latest = readings?.[0];

    return {
      // =====================================
      // CARD (API MEDIAN)
      // =====================================

      statistics: {
        temperature: {
          value: Number(median.temperature.toFixed(1)),
          status: getStatus(median.temperature, 24, 32),
          trend: 0,
          trendLabel: "Median",
        },

        humidity: {
          value: Number(median.humidity.toFixed(1)),
          status: getStatus(median.humidity, 70, 90),
          trend: 0,
          trendLabel: "Median",
        },

        soil: {
          value: Number(median.soil_moisture.toFixed(1)),
          status: getStatus(median.soil_moisture, 45, 80),
          trend: 0,
          trendLabel: "Median",
        },

        light: {
          value: Number(median.light_intensity.toFixed(0)),
          status: getStatus(
            median.light_intensity,
            8000,
            25000
          ),
          trend: 0,
          trendLabel: "Median",
        },
      },

      // =====================================
      // HEALTH SCORE (API MEDIAN)
      // =====================================

      health: {
        score: median.health_score,

        status:
          median.health_score >= 80
            ? "Sehat"
            : median.health_score >= 60
            ? "Perlu Perhatian"
            : "Kritis",

        description: "Berdasarkan median seluruh data sensor.",
      },

      // =====================================
      // GRAFIK (SUPABASE)
      // =====================================

      charts: {
        temperature: readings
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(
              item.device_timestamp
            ).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: Number(item.temperature),
          })),

        humidity: readings
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(
              item.device_timestamp
            ).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: Number(item.humidity),
          })),

        soil: readings
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(
              item.device_timestamp
            ).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: Number(item.soil_moisture),
          })),

        light: readings
          .slice()
          .reverse()
          .map((item) => ({
            time: new Date(
              item.device_timestamp
            ).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: Number(item.light_intensity),
          })),

        rain: [],
      },

      // =====================================
      // PANEL
      // =====================================

      panel: {
        rain: {
          status: "Tidak Hujan",
          intensity: "-",
          updatedAt: latest?.device_timestamp ?? "-",
        },
      },

      // =====================================
      // NOTIFIKASI
      // =====================================

      notifications:
        notifications?.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.level,
          time: new Date(
            item.created_at
          ).toLocaleString("id-ID"),
        })) ?? [],

      // =====================================
      // NODE
      // =====================================

sensorNodes:
  nodes?.map((node) => ({
    id: node.id,
    name: node.name,
    location: "-",

    status:
      node.status === true ||
      node.status === "ONLINE" ||
      node.status === "healthy"
        ? "Aktif"
        : "Tidak Aktif",

    value: "-",
    unit: "",

    lastUpdate: new Date(node.last_seen).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
  })) ?? [],
    };
  },
};

export default dashboardService;