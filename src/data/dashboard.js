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
    status: "Healthy",
    trend: 1,
    trendLabel: "+3%"
  },

  light: {
    value: 12450,
    status: "Good",
    trend: 0,
    trendLabel: "No Change"
  }
};

/* ===========================================================
   HEALTH SCORE
=========================================================== */

export const healthScore = {
  score: 92,
  status: "Healthy",
  description: "Optimal Environment"
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
    title: "Soil Moisture Low",
    message: "Soil moisture has dropped below the minimum threshold.",
    time: "2 minutes ago"
  },
  {
    id: 2,
    type: "success",
    title: "Environment Stable",
    message: "All monitored parameters are within the optimal range.",
    time: "15 minutes ago"
  },
  {
    id: 3,
    type: "info",
    title: "New Sensor Connected",
    message: "Node-03 has successfully connected to the network.",
    time: "30 minutes ago"
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
    lastUpdate: "1 minute ago"
  },
  {
    id: 2,
    name: "Node-02",
    location: "Blok B",
    status: "ONLINE",
    value: 81,
    unit: "%",
    lastUpdate: "30 seconds ago"
  },
  {
    id: 3,
    name: "Node-03",
    location: "Blok C",
    status: "OFFLINE",
    value: "-",
    unit: "",
    lastUpdate: "10 minutes ago"
  }
];
