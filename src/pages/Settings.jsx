import { useState, useEffect, useCallback } from "react";
import { Save, Power, Cpu, Sliders, Bell, Fan, Info } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

import settingsService from "../services/settingsService";
import { supabase } from "../lib/supabase";

const DEFAULT_ALERT_EXPLANATIONS = {
  lightAlertExplanation:
    "Perhatian: Pohon mengalami kekurangan cahaya berlarut-larut. Hal ini dapat mengakibatkan tumbuhnya jamur atau membuat hama cepat berkembang biak. Silakan melakukan cek berkala ke kebun dan bersihkan kebun agar pohon mendapat cahaya yang cukup.",
  tempAlertExplanation:
    "Perhatian: Suhu udara berada di luar batas ideal dalam waktu yang lama. Suhu ekstrem dapat menyebabkan stres termal pada tanaman, merusak jaringan daun, dan mengganggu penyerapan nutrisi.",
  soilAlertExplanation:
    "Perhatian: Kelembapan tanah berada di luar rentang ideal berlarut-larut. Kondisi tanah terlalu kering dapat membuat tanaman layu permanen, sedangkan terlalu basah berisiko memicu pembusukan akar.",
  humidityAlertExplanation:
    "Perhatian: Kelembapan udara tidak seimbang. Kelembapan terlalu tinggi berpotensi memicu perkembangan spora jamur/patogen, sementara kelembapan sangat rendah meningkatkan laju transpirasi berlebih.",
  healthAlertMessage:
    "Peringatan Kritis: Health Score kebun turun di bawah ambang batas minimal ({score}%). Beberapa akumulasi parameter sensor berada dalam kondisi buruk. Segera periksa kondisi fisik tanaman dan lingkungan kebun.",
  sensorAlertMessage:
    "Peringatan: Nilai {sensor} ({value}) melewati batas ideal ({min} - {max})!",
};

const DEFAULT_SETTINGS = {
  refreshInterval: "5",
  sendInterval: "30",
  monitoringMode: "realtime",
  powerSavingInterval: "300",
  weights: {
    temperature: 25,
    humidity: 25,
    soil: 30,
    light: 20,
  },
  ranges: {
    temperature: { min: 20, idealMin: 24, idealMax: 30, max: 35 },
    humidity: { min: 60, idealMin: 70, idealMax: 90, max: 95 },
    soil: { min: 35, idealMin: 45, idealMax: 80, max: 90 },
    light: { min: 5000, idealMin: 8000, idealMax: 18000, max: 25000 },
  },
  notification: {
    dashboard: true,
    critical: true,
    healthLimit: 80,
    ...DEFAULT_ALERT_EXPLANATIONS,
  },
  nodeTimeout: "30",
  minimumRSSI: "-90",
  batteryLimit: "20",
  nodePower: true,
  tempAlertDuration: "5m",
  soilAlertDuration: "10m",
  humidityAlertDuration: "10m",
  lightAlertDuration: "3d",
  fanMode: "AUTO",
  fanThreshold: "35",
  fanManualTarget: false,
};

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("node");

  const [refreshInterval, setRefreshInterval] = useState("5");
  const [sendInterval, setSendInterval] = useState("30");
  const [monitoringMode, setMonitoringMode] = useState("realtime");
  const [powerSavingInterval, setPowerSavingInterval] = useState("300");

  const [weights, setWeights] = useState({
    temperature: 25,
    humidity: 25,
    soil: 30,
    light: 20,
  });

  const [ranges, setRanges] = useState({
    temperature: { min: 20, idealMin: 24, idealMax: 30, max: 35 },
    humidity: { min: 60, idealMin: 70, idealMax: 90, max: 95 },
    soil: { min: 35, idealMin: 45, idealMax: 80, max: 90 },
    light: { min: 5000, idealMin: 8000, idealMax: 18000, max: 25000 },
  });

  const [notification, setNotification] = useState({
    dashboard: true,
    critical: true,
    healthLimit: 80,
    ...DEFAULT_ALERT_EXPLANATIONS,
  });

  const [tempAlertDuration, setTempAlertDuration] = useState("5m");
  const [soilAlertDuration, setSoilAlertDuration] = useState("10m");
  const [humidityAlertDuration, setHumidityAlertDuration] = useState("10m");
  const [lightAlertDuration, setLightAlertDuration] = useState("3d");

  const [nodeTimeout, setNodeTimeout] = useState("30");
  const [minimumRSSI, setMinimumRSSI] = useState("-90");
  const [batteryLimit, setBatteryLimit] = useState("20");
  const [nodePower, setNodePower] = useState(true);

  const [fanMode, setFanMode] = useState("AUTO");
  const [fanThreshold, setFanThreshold] = useState("35");
  const [fanManualTarget, setFanManualTarget] = useState(false);

  const [fanStatus, setFanStatus] = useState(false);
  const [nodePowerStatus, setNodePowerStatus] = useState(true);

  const parseNum = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    const num = Number(val);
    return isNaN(num) ? "" : num;
  };

  const loadRealtimeStatus = useCallback(async () => {
    try {
      if (typeof settingsService.getLatestPanelLog === "function") {
        const res = await settingsService.getLatestPanelLog();
        const logData = res?.data || res;
        if (logData) {
          if (logData.fan_status !== undefined) setFanStatus(Boolean(logData.fan_status));
          if (logData.node_power_status !== undefined) setNodePowerStatus(Boolean(logData.node_power_status));
          return;
        }
      }

      if (supabase) {
        const { data, error } = await supabase
          .from("panel_logs")
          .select("fan_status, node_power_status")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          if (data.fan_status !== undefined) setFanStatus(Boolean(data.fan_status));
          if (data.node_power_status !== undefined) setNodePowerStatus(Boolean(data.node_power_status));
        }
      }
    } catch (err) {
      console.error("Gagal memuat status telemetri real-time:", err);
    }
  }, []);

  useEffect(() => {
    loadRealtimeStatus();
    const interval = setInterval(() => loadRealtimeStatus(), 5000);

    let channel;
    if (supabase) {
      channel = supabase
        .channel("public:panel_logs")
        .on("postgres_changes", { event: "*", schema: "public", table: "panel_logs" }, (payload) => {
          if (payload.new) {
            if (payload.new.fan_status !== undefined) setFanStatus(Boolean(payload.new.fan_status));
            if (payload.new.node_power_status !== undefined) setNodePowerStatus(Boolean(payload.new.node_power_status));
          }
        })
        .subscribe();
    }

    return () => {
      clearInterval(interval);
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, [loadRealtimeStatus]);

  const applyDataToState = useCallback((data) => {
    if (!data) return;

    if (data.refreshInterval !== undefined) setRefreshInterval(String(data.refreshInterval));
    if (data.sendInterval !== undefined) setSendInterval(String(data.sendInterval));
    if (data.monitoringMode !== undefined) setMonitoringMode(String(data.monitoringMode));
    if (data.powerSavingInterval !== undefined) setPowerSavingInterval(String(data.powerSavingInterval));

    if (data.fanMode !== undefined) setFanMode(String(data.fanMode));
    if (data.fanThreshold !== undefined) setFanThreshold(String(data.fanThreshold));
    if (data.fanManualTarget !== undefined) setFanManualTarget(Boolean(data.fanManualTarget));

    if (data.nodePower !== undefined) setNodePower(Boolean(data.nodePower));

    if (data.weights) {
      setWeights({
        temperature: Number(data.weights.temperature ?? 25),
        humidity: Number(data.weights.humidity ?? 25),
        soil: Number(data.weights.soil ?? 30),
        light: Number(data.weights.light ?? 20),
      });
    }

    if (data.ranges) {
      setRanges({
        temperature: {
          min: Number(data.ranges.temperature?.min ?? 20),
          idealMin: Number(data.ranges.temperature?.idealMin ?? 24),
          idealMax: Number(data.ranges.temperature?.idealMax ?? 30),
          max: Number(data.ranges.temperature?.max ?? 35),
        },
        humidity: {
          min: Number(data.ranges.humidity?.min ?? 60),
          idealMin: Number(data.ranges.humidity?.idealMin ?? 70),
          idealMax: Number(data.ranges.humidity?.idealMax ?? 90),
          max: Number(data.ranges.humidity?.max ?? 95),
        },
        soil: {
          min: Number(data.ranges.soil?.min ?? 35),
          idealMin: Number(data.ranges.soil?.idealMin ?? 45),
          idealMax: Number(data.ranges.soil?.idealMax ?? 80),
          max: Number(data.ranges.soil?.max ?? 90),
        },
        light: {
          min: Number(data.ranges.light?.min ?? 5000),
          idealMin: Number(data.ranges.light?.idealMin ?? 8000),
          idealMax: Number(data.ranges.light?.idealMax ?? 18000),
          max: Number(data.ranges.light?.max ?? 25000),
        },
      });
    }

    if (data.notification) {
      setNotification({
        dashboard: Boolean(data.notification.dashboard),
        critical: Boolean(data.notification.critical),
        healthLimit: Number(data.notification.healthLimit ?? 80),
        lightAlertExplanation: data.notification.lightAlertExplanation || DEFAULT_ALERT_EXPLANATIONS.lightAlertExplanation,
        tempAlertExplanation: data.notification.tempAlertExplanation || DEFAULT_ALERT_EXPLANATIONS.tempAlertExplanation,
        soilAlertExplanation: data.notification.soilAlertExplanation || DEFAULT_ALERT_EXPLANATIONS.soilAlertExplanation,
        humidityAlertExplanation: data.notification.humidityAlertExplanation || DEFAULT_ALERT_EXPLANATIONS.humidityAlertExplanation,
        healthAlertMessage: data.notification.healthAlertMessage || DEFAULT_ALERT_EXPLANATIONS.healthAlertMessage,
        sensorAlertMessage: data.notification.sensorAlertMessage || DEFAULT_ALERT_EXPLANATIONS.sensorAlertMessage,
      });
    }

    if (data.nodeTimeout !== undefined) setNodeTimeout(String(data.nodeTimeout));
    if (data.minimumRSSI !== undefined) setMinimumRSSI(String(data.minimumRSSI));
    if (data.batteryLimit !== undefined) setBatteryLimit(String(data.batteryLimit));

    if (data.tempAlertDuration !== undefined) setTempAlertDuration(String(data.tempAlertDuration));
    if (data.soilAlertDuration !== undefined) setSoilAlertDuration(String(data.soilAlertDuration));
    if (data.humidityAlertDuration !== undefined) setHumidityAlertDuration(String(data.humidityAlertDuration));
    if (data.lightAlertDuration !== undefined) setLightAlertDuration(String(data.lightAlertDuration));
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      let raw = res?.data || res;
      if (Array.isArray(raw)) raw = raw[0];
      if (raw) applyDataToState(raw);
    } catch (err) {
      toast.error(err.message || "Gagal memuat data dari server.");
    } finally {
      setLoading(false);
    }
  }, [applyDataToState]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // VALIDASI LOGIKA INTERRUPT / SECURE UI VALIDATION
  const validateIntervals = () => {
    const readSec = Number(refreshInterval);
    const sendSec = Number(sendInterval);
    const powerSec = Number(powerSavingInterval);

    if (readSec > sendSec) {
      toast.error(
        "Interval Pembacaan Sensor tidak boleh lebih besar dari Interval Pengiriman Data! Data harus dibaca terlebih dahulu sebelum dapat dikirim."
      );
      return false;
    }

    if (monitoringMode === "power") {
      if (powerSec <= sendSec) {
        toast.error(
          "Interval Hemat Daya harus lebih besar dari Interval Pengiriman Data agar Node memiliki waktu yang cukup untuk aktif, membaca sensor, dan mendistribusikan data ke server."
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateIntervals()) return;

    const saveToast = toast.loading("Menyimpan pengaturan sistem...");

    try {
      setSaving(true);
      const finalNodePower = monitoringMode === "power" ? true : Boolean(nodePower);

      const payload = {
        refreshInterval: String(refreshInterval),
        sendInterval: String(sendInterval),
        monitoringMode: String(monitoringMode),
        powerSavingInterval: String(powerSavingInterval),
        fanMode: String(fanMode),
        fanThreshold: Number(fanThreshold),
        fanManualTarget: Boolean(fanManualTarget),
        nodePower: finalNodePower,
        weights: {
          temperature: Number(weights.temperature),
          humidity: Number(weights.humidity),
          soil: Number(weights.soil),
          light: Number(weights.light),
        },
        ranges: {
          temperature: {
            min: Number(ranges.temperature.min),
            idealMin: Number(ranges.temperature.idealMin),
            idealMax: Number(ranges.temperature.idealMax),
            max: Number(ranges.temperature.max),
          },
          humidity: {
            min: Number(ranges.humidity.min),
            idealMin: Number(ranges.humidity.idealMin),
            idealMax: Number(ranges.humidity.idealMax),
            max: Number(ranges.humidity.max),
          },
          soil: {
            min: Number(ranges.soil.min),
            idealMin: Number(ranges.soil.idealMin),
            idealMax: Number(ranges.soil.idealMax),
            max: Number(ranges.soil.max),
          },
          light: {
            min: Number(ranges.light.min),
            idealMin: Number(ranges.light.idealMin),
            idealMax: Number(ranges.light.idealMax),
            max: Number(ranges.light.max),
          },
        },
        notification: {
          dashboard: Boolean(notification.dashboard),
          critical: Boolean(notification.critical),
          healthLimit: Number(notification.healthLimit),
          ...DEFAULT_ALERT_EXPLANATIONS,
        },
        nodeTimeout: String(nodeTimeout),
        minimumRSSI: String(minimumRSSI),
        batteryLimit: String(batteryLimit),
        tempAlertDuration: String(tempAlertDuration),
        soilAlertDuration: String(soilAlertDuration),
        humidityAlertDuration: String(humidityAlertDuration),
        lightAlertDuration: String(lightAlertDuration),
      };

      await settingsService.saveSettings(payload);
      toast.success("Pengaturan berhasil disimpan.", { id: saveToast });
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan perubahan.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const resetToast = toast.loading("Mengembalikan pengaturan...");

    try {
      setSaving(true);
      applyDataToState(DEFAULT_SETTINGS);
      await settingsService.saveSettings(DEFAULT_SETTINGS);
      toast.success("Pengaturan dikembalikan ke default.", { id: resetToast });
    } catch (err) {
      toast.error(err.message || "Gagal mengembalikan pengaturan.", { id: resetToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-[var(--muted-foreground)]">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Pengaturan Sistem"
        description="Kelola konfigurasi perangkat node, kontrol panel fisik, serta parameter kesehatan dan notifikasi kebun."
      />

      <div className="mb-6 flex space-x-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("node")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "node"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
          }`}
        >
          <Cpu size={18} />
          Node
        </button>

        <button
          onClick={() => setActiveTab("panel")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "panel"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
          }`}
        >
          <Sliders size={18} />
          Panel
        </button>

        <button
          onClick={() => setActiveTab("notification")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "notification"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50"
          }`}
        >
          <Bell size={18} />
          Notifikasi
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === "node" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Konfigurasi Monitoring</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Atur frekuensi pembacaan sensor dan interval pengiriman data ke server.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Interval Pembacaan Sensor"
                  value={refreshInterval}
                  onValueChange={setRefreshInterval}
                  helperText="Seberapa sering sensor mengambil data lokasi."
                >
                  <Select.Item value="5">5 Detik</Select.Item>
                  <Select.Item value="10">10 Detik</Select.Item>
                  <Select.Item value="30">30 Detik</Select.Item>
                  <Select.Item value="60">60 Detik</Select.Item>
                </Select>

                <Select
                  label="Interval Pengiriman Data"
                  value={sendInterval}
                  onValueChange={setSendInterval}
                  helperText="Frekuensi pengiriman data gateway ke server."
                >
                  <Select.Item value="30">30 Detik</Select.Item>
                  <Select.Item value="60">1 Menit</Select.Item>
                  <Select.Item value="300">5 Menit</Select.Item>
                  <Select.Item value="600">10 Menit</Select.Item>
                </Select>

                <Select
                  label="Mode Monitoring"
                  value={monitoringMode}
                  onValueChange={setMonitoringMode}
                  helperText="Mode operasi hemat daya atau real-time."
                >
                  <Select.Item value="realtime">Normal</Select.Item>
                  <Select.Item value="power">Hemat Daya</Select.Item>
                </Select>

                <Select
                  label="Interval Hemat Daya"
                  value={powerSavingInterval}
                  onValueChange={setPowerSavingInterval}
                  disabled={monitoringMode !== "power"}
                  helperText={
                    monitoringMode === "power"
                      ? "Durasi siklus node mati & menyala otomatis."
                      : "Hanya aktif saat Mode Hemat Daya dipilih."
                  }
                >
                  <Select.Item value="60">1 Menit</Select.Item>
                  <Select.Item value="300">5 Menit</Select.Item>
                  <Select.Item value="600">10 Menit</Select.Item>
                  <Select.Item value="900">15 Menit</Select.Item>
                  <Select.Item value="1800">30 Menit</Select.Item>
                  <Select.Item value="3600">1 Jam</Select.Item>
                </Select>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Konfigurasi & Daya Node</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Kelola daya saklar fisik node dan batas threshold sinyal/komunikasi.
                </p>
              </div>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Master Switch Daya Node</h3>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Kontrol arus daya fisik ke Node dari perangkat Gateway.
                  </p>

                  {monitoringMode === "power" && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                      <Info size={16} className="mt-0.5 shrink-0" />
                      <p className="text-xs">
                        Kontrol manual dinonaktifkan karena <strong>Mode Hemat Daya</strong> sedang aktif. Daya node diatur otomatis sesuai interval hemat daya.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={monitoringMode === "power"}
                      onClick={() => setNodePower(false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                        !nodePower
                          ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30 font-semibold"
                          : "bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-rose-500/10 hover:text-rose-600 border border-[var(--border)]"
                      } ${monitoringMode === "power" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Power size={18} className="shrink-0" />
                      <span className="text-xs sm:text-sm">MATI</span>
                    </button>

                    <button
                      type="button"
                      disabled={monitoringMode === "power"}
                      onClick={() => setNodePower(true)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                        nodePower
                          ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30 font-semibold"
                          : "bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-emerald-500/10 hover:text-emerald-600 border border-[var(--border)]"
                      } ${monitoringMode === "power" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Power size={18} className="shrink-0" />
                      <span className="text-xs sm:text-sm">MENYALA</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-[var(--border)] p-5">
                  <h3 className="text-base font-semibold">Status Daya Node (Real-Time)</h3>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      Status Kelistrikan Node
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          nodePowerStatus ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      />
                      <span
                        className={`text-lg font-bold ${
                          nodePowerStatus ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {nodePowerStatus ? "TERHUBUNG" : "TERPUTUS / SLEEP"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Input
                  label="Timeout Node (detik)"
                  type="number"
                  min="5"
                  value={nodeTimeout}
                  onChange={(e) => setNodeTimeout(e.target.value)}
                  helperText="Batas waktu node dianggap Offline."
                />
                <Input
                  label="RSSI Minimum (dBm)"
                  type="number"
                  value={minimumRSSI}
                  onChange={(e) => setMinimumRSSI(e.target.value)}
                  helperText="Batas minimal kekuatan sinyal."
                />
                <Input
                  label="Daya Minimum (Volts)"
                  type="number"
                  min="0"
                  max="100"
                  value={batteryLimit}
                  onChange={(e) => setBatteryLimit(e.target.value)}
                  helperText="Batas peringatan daya baterai."
                />
              </div>
            </Card>
          </div>
        )}

        {activeTab === "panel" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Kontrol Kipas Panel</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Atur suhu ambang batas penyalaan kipas pendingin box panel secara otomatis atau manual.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center gap-2">
                    <Fan size={18} className="text-primary" />
                    <h3 className="text-base font-semibold">Pengaturan Mode & Batas Suhu Panel</h3>
                  </div>

                  <Select
                    label="Mode Kipas Panel"
                    value={fanMode}
                    onValueChange={setFanMode}
                    helperText="Pilih kontrol Otomatis atau Manual."
                  >
                    <Select.Item value="AUTO">Otomatis</Select.Item>
                    <Select.Item value="MANUAL">Manual</Select.Item>
                  </Select>

                  <Input
                    label="Batas Suhu Panel / Threshold (°C)"
                    type="number"
                    value={fanThreshold}
                    onChange={(e) => setFanThreshold(e.target.value)}
                    disabled={fanMode === "MANUAL"}
                    helperText={
                      fanMode === "MANUAL"
                        ? "Batas suhu hanya aktif dalam mode Otomatis."
                        : "Kipas menyala otomatis saat suhu panel melebihi nilai ini."
                    }
                  />
                </div>

                <div className="space-y-4 rounded-xl border border-[var(--border)] p-5">
                  <h3 className="text-base font-semibold">Status & Kontrol Manual Kipas</h3>

                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      Status Kipas Fisik Real-Time
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          fanStatus ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                        }`}
                      />
                      <span
                        className={`text-lg font-bold ${
                          fanStatus ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {fanStatus ? "MENYALA" : "MATI"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--border)] p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      Manual Saklar Kipas (Admin)
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={fanMode === "AUTO"}
                        onClick={() => setFanManualTarget(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                          !fanManualTarget
                            ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30 font-semibold"
                            : "bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-rose-500/10 hover:text-rose-600 border border-[var(--border)]"
                        } ${fanMode === "AUTO" ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Power size={18} className="shrink-0" />
                        <span className="text-xs sm:text-sm">MATI</span>
                      </button>

                      <button
                        type="button"
                        disabled={fanMode === "AUTO"}
                        onClick={() => setFanManualTarget(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                          fanManualTarget
                            ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30 font-semibold"
                            : "bg-[var(--muted)]/40 text-[var(--muted-foreground)] hover:bg-emerald-500/10 hover:text-emerald-600 border border-[var(--border)]"
                        } ${fanMode === "AUTO" ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Power size={18} className="shrink-0" />
                        <span className="text-xs sm:text-sm">MENYALA</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "notification" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Parameter Kesehatan Kebun</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Persentase bobot setiap sensor untuk kalkulasi Health Score kebun.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Bobot Suhu (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={weights.temperature}
                  onChange={(e) => setWeights({ ...weights, temperature: parseNum(e.target.value) })}
                />
                <Input
                  label="Bobot Kelembapan Udara (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={weights.humidity}
                  onChange={(e) => setWeights({ ...weights, humidity: parseNum(e.target.value) })}
                />
                <Input
                  label="Bobot Kelembapan Tanah (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={weights.soil}
                  onChange={(e) => setWeights({ ...weights, soil: parseNum(e.target.value) })}
                />
                <Input
                  label="Bobot Intensitas Cahaya (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={weights.light}
                  onChange={(e) => setWeights({ ...weights, light: parseNum(e.target.value) })}
                />
              </div>

              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-4 flex justify-between items-center">
                <span className="text-sm font-medium">Total Kombinasi Bobot:</span>
                <span
                  className={`text-lg font-bold ${
                    Number(weights.temperature) + Number(weights.humidity) + Number(weights.soil) + Number(weights.light) === 100
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {Number(weights.temperature) + Number(weights.humidity) + Number(weights.soil) + Number(weights.light)}% (Harus 100%)
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Rentang Ideal Sensor</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Tentukan nilai ambang batas ideal maupun ekstrem dari setiap sensor (Min, Ideal Min, Ideal Max, Max).
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Suhu Udara (°C)</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Input label="Min" type="number" value={ranges.temperature.min} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, min: parseNum(e.target.value) } })} />
                    <Input label="Ideal Min" type="number" value={ranges.temperature.idealMin} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, idealMin: parseNum(e.target.value) } })} />
                    <Input label="Ideal Max" type="number" value={ranges.temperature.idealMax} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, idealMax: parseNum(e.target.value) } })} />
                    <Input label="Max" type="number" value={ranges.temperature.max} onChange={(e) => setRanges({ ...ranges, temperature: { ...ranges.temperature, max: parseNum(e.target.value) } })} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Kelembapan Udara (%)</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Input label="Min" type="number" value={ranges.humidity.min} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, min: parseNum(e.target.value) } })} />
                    <Input label="Ideal Min" type="number" value={ranges.humidity.idealMin} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, idealMin: parseNum(e.target.value) } })} />
                    <Input label="Ideal Max" type="number" value={ranges.humidity.idealMax} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, idealMax: parseNum(e.target.value) } })} />
                    <Input label="Max" type="number" value={ranges.humidity.max} onChange={(e) => setRanges({ ...ranges, humidity: { ...ranges.humidity, max: parseNum(e.target.value) } })} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Kelembapan Tanah (%)</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Input label="Min" type="number" value={ranges.soil.min} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, min: parseNum(e.target.value) } })} />
                    <Input label="Ideal Min" type="number" value={ranges.soil.idealMin} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, idealMin: parseNum(e.target.value) } })} />
                    <Input label="Ideal Max" type="number" value={ranges.soil.idealMax} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, idealMax: parseNum(e.target.value) } })} />
                    <Input label="Max" type="number" value={ranges.soil.max} onChange={(e) => setRanges({ ...ranges, soil: { ...ranges.soil, max: parseNum(e.target.value) } })} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Intensitas Cahaya (lux)</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Input label="Min" type="number" value={ranges.light.min} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, min: parseNum(e.target.value) } })} />
                    <Input label="Ideal Min" type="number" value={ranges.light.idealMin} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, idealMin: parseNum(e.target.value) } })} />
                    <Input label="Ideal Max" type="number" value={ranges.light.idealMax} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, idealMax: parseNum(e.target.value) } })} />
                    <Input label="Max" type="number" value={ranges.light.max} onChange={(e) => setRanges({ ...ranges, light: { ...ranges.light, max: parseNum(e.target.value) } })} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Pengaturan Saluran & Ambang Notifikasi</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Konfigurasi saluran pengiriman pesan dan batas pemicu notifikasi.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Select label="Notifikasi Dashboard" value={notification.dashboard ? "on" : "off"} onValueChange={(val) => setNotification({ ...notification, dashboard: val === "on" })}>
                  <Select.Item value="on">Aktif</Select.Item>
                  <Select.Item value="off">Nonaktif</Select.Item>
                </Select>

                <Select label="Peringatan Kritis" value={notification.critical ? "on" : "off"} onValueChange={(val) => setNotification({ ...notification, critical: val === "on" })}>
                  <Select.Item value="on">Aktif</Select.Item>
                  <Select.Item value="off">Nonaktif</Select.Item>
                </Select>

                <Input
                  label="Ambang Health Score Minimal (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={notification.healthLimit}
                  onChange={(e) => setNotification({ ...notification, healthLimit: parseNum(e.target.value) })}
                  helperText="Batas skor minimal sebelum alert dikirim."
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-6 flex items-center gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Parameter Durasi Alert (Akumulasi Deviasi)</h2>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Durasi kumulatif deviasi nilai sensor melampaui rentang Min/Ideal/Max sebelum sistem memicu pesan alert otomatis.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Select label="Suhu Udara Di Luar Batas Selama" value={tempAlertDuration} onValueChange={setTempAlertDuration}>
                  <Select.Item value="5m">5 Menit</Select.Item>
                  <Select.Item value="30m">30 Menit</Select.Item>
                  <Select.Item value="1h">1 Jam</Select.Item>
                  <Select.Item value="12h">12 Jam</Select.Item>
                  <Select.Item value="1d">1 Hari</Select.Item>
                  <Select.Item value="3d">3 Hari</Select.Item>
                  <Select.Item value="7d">1 Minggu (7 Hari)</Select.Item>
                  <Select.Item value="30d">1 Bulan (30 Hari)</Select.Item>
                </Select>

                <Select label="Kelembapan Tanah Di Luar Batas Selama" value={soilAlertDuration} onValueChange={setSoilAlertDuration}>
                  <Select.Item value="5m">5 Menit</Select.Item>
                  <Select.Item value="30m">30 Menit</Select.Item>
                  <Select.Item value="1h">1 Jam</Select.Item>
                  <Select.Item value="12h">12 Jam</Select.Item>
                  <Select.Item value="1d">1 Hari</Select.Item>
                  <Select.Item value="3d">3 Hari</Select.Item>
                  <Select.Item value="7d">1 Minggu (7 Hari)</Select.Item>
                  <Select.Item value="30d">1 Bulan (30 Hari)</Select.Item>
                </Select>

                <Select label="Kelembapan Udara Di Luar Batas Selama" value={humidityAlertDuration} onValueChange={setHumidityAlertDuration}>
                  <Select.Item value="5m">5 Menit</Select.Item>
                  <Select.Item value="30m">30 Menit</Select.Item>
                  <Select.Item value="1h">1 Jam</Select.Item>
                  <Select.Item value="12h">12 Jam</Select.Item>
                  <Select.Item value="1d">1 Hari</Select.Item>
                  <Select.Item value="3d">3 Hari</Select.Item>
                  <Select.Item value="7d">1 Minggu (7 Hari)</Select.Item>
                  <Select.Item value="30d">1 Bulan (30 Hari)</Select.Item>
                </Select>

                <Select label="Intensitas Cahaya Di Luar Batas Selama" value={lightAlertDuration} onValueChange={setLightAlertDuration}>
                  <Select.Item value="5m">5 Menit</Select.Item>
                  <Select.Item value="30m">30 Menit</Select.Item>
                  <Select.Item value="1h">1 Jam</Select.Item>
                  <Select.Item value="12h">12 Jam</Select.Item>
                  <Select.Item value="1d">1 Hari</Select.Item>
                  <Select.Item value="3d">3 Hari</Select.Item>
                  <Select.Item value="5d">5 Hari</Select.Item>
                  <Select.Item value="7d">1 Minggu (7 Hari)</Select.Item>
                  <Select.Item value="30d">1 Bulan (30 Hari)</Select.Item>
                </Select>
              </div>
            </Card>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4 border-t border-[var(--border)]">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving || loading}
          >
            Kembalikan Default
          </Button>
          <Button
            startContent={<Save size={18} />}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </>
  );
}