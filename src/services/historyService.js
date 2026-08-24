// src/services/historyService.js
import { supabase } from "../lib/supabase";

const historyService = {
  async getHistory() {
    // 1. Ambil batasan kesehatan (health_limit) dari tabel settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("health_limit")
      .limit(1)
      .maybeSingle();

    const healthLimit = settingsData?.health_limit ?? 80;

    // 2. Ambil data sensor utama
    const { data: readings, error: readingsError } = await supabase
      .from("sensor_readings")
      .select(`
        id,
        temperature,
        humidity,
        soil_moisture,
        light_intensity,
        health_score,
        status,
        device_timestamp,
        device_id,
        node_devices ( name )
      `)
      .order("device_timestamp", { ascending: false });

    if (readingsError) throw readingsError;

    // 3. Ambil data log panel untuk sensor hujan
    const { data: panelLogs, error: panelError } = await supabase
      .from("panel_logs")
      .select("created_at, rain_adc")
      .order("created_at", { ascending: false });

    if (panelError) throw panelError;

    // 4. Mapping data
    return readings.map((item) => {
      const itemTime = new Date(item.device_timestamp).getTime();
      const matchedPanel = panelLogs?.find((panel) => {
        const panelTime = new Date(panel.created_at).getTime();
        return Math.abs(itemTime - panelTime) <= 60000;
      });

      const isRaining = matchedPanel?.rain_adc !== undefined && matchedPanel?.rain_adc < 500;
      const rainStatus = isRaining ? "Terdeteksi Hujan" : "Tidak Hujan";

      // Evaluasi Status berdasarkan Perbandingan health_score dengan health_limit
      const healthScore = Number(item.health_score) || 0;
      let calculatedStatus = item.status;
      let badge = "default";

      if (healthScore >= healthLimit) {
        calculatedStatus = "Optimal";
        badge = "success";
      } else if (healthScore >= healthLimit - 20) {
        calculatedStatus = "Perlu Perhatian";
        badge = "warning";
      } else {
        calculatedStatus = "Kritis";
        badge = "danger";
      }

      return {
        id: item.id,
        rawTimestamp: item.device_timestamp,
        timestamp: new Date(item.device_timestamp).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        node: item.node_devices?.name || `Node ${item.device_id}`,
        temperature: Number(item.temperature),
        humidity: Number(item.humidity),
        soil: Number(item.soil_moisture),
        light: Number(item.light_intensity),
        rainStatus,
        health: healthScore,
        status: calculatedStatus,
        badge,
      };
    });
  },
};

export default historyService;