import { supabase } from "../lib/supabase";

const SETTINGS_ID = 1;

/**
 * Memetakan kolom flat database (snake_case) ke struktur state React (camelCase).
 */
const mapDatabaseToSettings = (dbData) => {
  if (!dbData) return null;

  return {
    refreshInterval: dbData.refresh_interval,
    sendInterval: dbData.send_interval,
    monitoringMode: dbData.monitoring_mode,

    // === MAPPING FAN CONTROL (GET) ===
    fanMode: dbData.fan_mode ?? "AUTO",
    fanThreshold: dbData.fan_threshold ?? 35,
    fanManualTarget: dbData.fan_manual_target ?? false,

    // === MAPPING NODE POWER CONTROL (GET) ===
    nodePower: dbData.node_power ?? true,

    weights: {
      temperature: dbData.weight_temperature,
      humidity: dbData.weight_humidity,
      soil: dbData.weight_soil,
      light: dbData.weight_light,
    },
    ranges: {
      temperature: {
        min: dbData.temperature_min,
        idealMin: dbData.temperature_ideal_min,
        idealMax: dbData.temperature_ideal_max,
        max: dbData.temperature_max,
      },
      humidity: {
        min: dbData.humidity_min,
        idealMin: dbData.humidity_ideal_min,
        idealMax: dbData.humidity_ideal_max,
        max: dbData.humidity_max,
      },
      soil: {
        min: dbData.soil_min,
        idealMin: dbData.soil_ideal_min,
        idealMax: dbData.soil_ideal_max,
        max: dbData.soil_max,
      },
      light: {
        min: dbData.light_min,
        idealMin: dbData.light_ideal_min,
        idealMax: dbData.light_ideal_max,
        max: dbData.light_max,
      },
    },
    notification: {
      dashboard: dbData.dashboard_notification,
      email: dbData.email_notification,
      critical: dbData.critical_notification,
      healthLimit: dbData.health_limit,
    },
    tempAlertDuration: dbData.temperature_alert_minutes,
    humidityAlertDuration: dbData.humidity_alert_minutes,
    soilAlertDuration: dbData.soil_alert_minutes,
    lightAlertDuration: dbData.light_alert_minutes,

    nodeTimeout: dbData.node_timeout,
    minimumRSSI: dbData.minimum_rssi,
    batteryLimit: dbData.battery_limit,
    updatedAt: dbData.updated_at,
  };
};

/**
 * Memetakan struktur state React (camelCase) kembali ke kolom flat database (snake_case).
 */
const mapSettingsToDatabase = (reactData) => {
  if (!reactData || typeof reactData !== "object") {
    throw new Error("Data pengaturan tidak valid.");
  }

  const payload = {};

  if (reactData.refreshInterval !== undefined)
    payload.refresh_interval = reactData.refreshInterval;
  if (reactData.sendInterval !== undefined)
    payload.send_interval = reactData.sendInterval;
  if (reactData.monitoringMode !== undefined)
    payload.monitoring_mode = reactData.monitoringMode;

  // === MAPPING FAN CONTROL (SAVE) ===
  if (reactData.fanMode !== undefined) payload.fan_mode = reactData.fanMode;
  if (reactData.fanThreshold !== undefined)
    payload.fan_threshold = Number(reactData.fanThreshold);
  if (reactData.fanManualTarget !== undefined)
    payload.fan_manual_target = Boolean(reactData.fanManualTarget);

  // === MAPPING NODE POWER CONTROL (SAVE) ===
  if (reactData.nodePower !== undefined)
    payload.node_power = Boolean(reactData.nodePower);

  if (reactData.weights) {
    if (reactData.weights.temperature !== undefined)
      payload.weight_temperature = reactData.weights.temperature;
    if (reactData.weights.humidity !== undefined)
      payload.weight_humidity = reactData.weights.humidity;
    if (reactData.weights.soil !== undefined)
      payload.weight_soil = reactData.weights.soil;
    if (reactData.weights.light !== undefined)
      payload.weight_light = reactData.weights.light;
  }

  if (reactData.ranges) {
    if (reactData.ranges.temperature) {
      if (reactData.ranges.temperature.min !== undefined)
        payload.temperature_min = reactData.ranges.temperature.min;
      if (reactData.ranges.temperature.idealMin !== undefined)
        payload.temperature_ideal_min = reactData.ranges.temperature.idealMin;
      if (reactData.ranges.temperature.idealMax !== undefined)
        payload.temperature_ideal_max = reactData.ranges.temperature.idealMax;
      if (reactData.ranges.temperature.max !== undefined)
        payload.temperature_max = reactData.ranges.temperature.max;
    }
    if (reactData.ranges.humidity) {
      if (reactData.ranges.humidity.min !== undefined)
        payload.humidity_min = reactData.ranges.humidity.min;
      if (reactData.ranges.humidity.idealMin !== undefined)
        payload.humidity_ideal_min = reactData.ranges.humidity.idealMin;
      if (reactData.ranges.humidity.idealMax !== undefined)
        payload.humidity_ideal_max = reactData.ranges.humidity.idealMax;
      if (reactData.ranges.humidity.max !== undefined)
        payload.humidity_max = reactData.ranges.humidity.max;
    }
    if (reactData.ranges.soil) {
      if (reactData.ranges.soil.min !== undefined)
        payload.soil_min = reactData.ranges.soil.min;
      if (reactData.ranges.soil.idealMin !== undefined)
        payload.soil_ideal_min = reactData.ranges.soil.idealMin;
      if (reactData.ranges.soil.idealMax !== undefined)
        payload.soil_ideal_max = reactData.ranges.soil.idealMax;
      if (reactData.ranges.soil.max !== undefined)
        payload.soil_max = reactData.ranges.soil.max;
    }
    if (reactData.ranges.light) {
      if (reactData.ranges.light.min !== undefined)
        payload.light_min = Number(reactData.ranges.light.min);
      if (reactData.ranges.light.idealMin !== undefined)
        payload.light_ideal_min = Number(reactData.ranges.light.idealMin);
      if (reactData.ranges.light.idealMax !== undefined)
        payload.light_ideal_max = Number(reactData.ranges.light.idealMax);
      if (reactData.ranges.light.max !== undefined)
        payload.light_max = Number(reactData.ranges.light.max);
    }
  }

  if (reactData.notification) {
    if (reactData.notification.dashboard !== undefined)
      payload.dashboard_notification = reactData.notification.dashboard;
    if (reactData.notification.email !== undefined)
      payload.email_notification = reactData.notification.email;
    if (reactData.notification.critical !== undefined)
      payload.critical_notification = reactData.notification.critical;
    if (reactData.notification.healthLimit !== undefined)
      payload.health_limit = reactData.notification.healthLimit;
  }

  if (reactData.tempAlertDuration !== undefined)
    payload.temperature_alert_minutes = reactData.tempAlertDuration;
  if (reactData.humidityAlertDuration !== undefined)
    payload.humidity_alert_minutes = reactData.humidityAlertDuration;
  if (reactData.soilAlertDuration !== undefined)
    payload.soil_alert_minutes = reactData.soilAlertDuration;
  if (reactData.lightAlertDuration !== undefined)
    payload.light_alert_minutes = reactData.lightAlertDuration;

  if (reactData.nodeTimeout !== undefined)
    payload.node_timeout = reactData.nodeTimeout;
  if (reactData.minimumRSSI !== undefined)
    payload.minimum_rssi = reactData.minimumRSSI;
  if (reactData.batteryLimit !== undefined)
    payload.battery_limit = reactData.batteryLimit;

  payload.updated_at = new Date().toISOString();

  return payload;
};

export const settingsService = {
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .limit(1)
        .single();

      if (error) throw error;
      return mapDatabaseToSettings(data);
    } catch (error) {
      throw error;
    }
  },

  async saveSettings(data) {
    try {
      const dbPayload = mapSettingsToDatabase(data);

      const { data: updatedData, error } = await supabase
        .from("settings")
        .update(dbPayload)
        .eq("id", SETTINGS_ID)
        .select("*")
        .single();

      if (error) throw error;
      return mapDatabaseToSettings(updatedData);
    } catch (error) {
      throw error;
    }
  },

  // Mengambil Log Terbaru dari panel_logs untuk status telemetri fisik
  async getLatestPanelLog() {
    try {
      const { data, error } = await supabase
        .from("panel_logs")
        .select("fan_status, node_power_status, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default settingsService;