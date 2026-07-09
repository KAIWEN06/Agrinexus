/* ===========================================================
   DASHBOARD STATISTICS
=========================================================== */

export const dashboardStatistics = {
  temperature: {
    value: 29,
    status: "Normal",
    trend: 1,
    trendLabel: "+0.8°C"
  },

  humidity: {
    value: 81,
    status: "Optimal",
    trend: -1,
    trendLabel: "-2%"
  },

  soil: {
    value: 63,
    status: "Sehat",
    trend: 1,
    trendLabel: "+3%"
  },

  light: {
    value: 12450,
    status: "Baik",
    trend: 0,
    trendLabel: "Tidak Ada Perubahan"
  }
};

/* ===========================================================
   HEALTH SCORE
=========================================================== */

export const healthScore = {
  score: 92,
  status: "Sehat",
  description: "Kondisi perkebunan optimal"
};

/* ===========================================================
   TEMPERATURE CHART
=========================================================== */

export const temperatureData = [
  { time: "00:00", value: 27 },
  { time: "04:00", value: 26 },
  { time: "08:00", value: 28 },
  { time: "12:00", value: 31 },
  { time: "16:00", value: 30 },
  { time: "20:00", value: 28 }
];

/* ===========================================================
   HUMIDITY CHART
=========================================================== */

export const humidityData = [
  { time: "00:00", value: 82 },
  { time: "04:00", value: 84 },
  { time: "08:00", value: 81 },
  { time: "12:00", value: 78 },
  { time: "16:00", value: 80 },
  { time: "20:00", value: 83 }
];

/* ===========================================================
   SOIL MOISTURE CHART
=========================================================== */

export const soilMoistureData = [
  { time: "00:00", value: 65 },
  { time: "04:00", value: 64 },
  { time: "08:00", value: 62 },
  { time: "12:00", value: 60 },
  { time: "16:00", value: 61 },
  { time: "20:00", value: 63 }
];

/* ===========================================================
   LIGHT CHART
=========================================================== */

export const lightData = [
  { time: "00:00", value: 0 },
  { time: "04:00", value: 500 },
  { time: "08:00", value: 12000 },
  { time: "12:00", value: 18000 },
  { time: "16:00", value: 15000 },
  { time: "20:00", value: 2000 }
];

/* ===========================================================
   NOTIFICATIONS
=========================================================== */

export const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Kelembapan Tanah Rendah",
    message: "Kelembapan tanah berada di bawah batas minimum.",
    time: "2 menit yang lalu"
  },
  {
    id: 2,
    type: "success",
    title: "Kondisi Lingkungan Stabil",
    message: "Seluruh parameter yang dipantau berada dalam kondisi optimal.",
    time: "15 menit yang lalu"
  },
  {
    id: 3,
    type: "info",
    title: "Sensor Baru Terhubung",
    message: "Node-03 berhasil terhubung ke jaringan.",
    time: "30 menit yang lalu"
  }
];

/* ===========================================================
   SENSOR NODES
=========================================================== */

export const sensorNodes = [
  {
    id: 1,
    name: "Node-01",
    location: "Blok A",
    status: "ONLINE",
    value: 29,
    unit: "°C",
    lastUpdate: "1 menit yang lalu"
  },
  {
    id: 2,
    name: "Node-02",
    location: "Blok B",
    status: "ONLINE",
    value: 81,
    unit: "%",
    lastUpdate: "30 detik yang lalu"
  },
  {
    id: 3,
    name: "Node-03",
    location: "Blok C",
    status: "OFFLINE",
    value: "-",
    unit: "",
    lastUpdate: "10 menit yang lalu"
  }
];

/* ===========================================================
   RAIN STATUS
=========================================================== */

export const rainStatus = {
  status: "Tidak Hujan",
  intensity: "-",
  updatedAt: "29 Jun 2026 14:35"
};

/* ===========================================================
   SENSOR HUJAN
=========================================================== */

export const rainHistory = [
  {
    time: "08:00",
    rain: 0
  },
  {
    time: "09:00",
    rain: 0
  },
  {
    time: "10:00",
    rain: 1
  },
  {
    time: "11:00",
    rain: 1
  },
  {
    time: "12:00",
    rain: 0
  },
  {
    time: "13:00",
    rain: 0
  },
  {
    time: "14:00",
    rain: 1
  }
];

/* ===========================================================
   DASHBOARD OBJECT
=========================================================== */

const dashboard = {
  statistics: dashboardStatistics,

  health: healthScore,

  charts: {
    temperature: temperatureData,
    humidity: humidityData,
    soil: soilMoistureData,
    light: lightData,
    rain: rainHistory
  },

  panel: {
    rain: rainStatus
  },

  notifications,

  sensorNodes
};

export default dashboard;
