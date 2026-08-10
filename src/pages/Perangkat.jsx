import React, { useState, useEffect } from "react";
import { 
  Wifi, WifiOff, Cpu, Thermometer, CloudRain, Sun, 
  Droplets, MapPin, AlertTriangle, CheckCircle2, Wrench, Edit3, Save, Loader2, PowerOff, Power
} from "lucide-react";
import { supabase } from "../services/supabase";

export default function Perangkat() {
  const [activeTab, setActiveTab] = useState("nodes"); // 'nodes' | 'panel'
  const [nodes, setNodes] = useState([]);
  const [panelData, setPanelData] = useState(null);
  const [sysSettings, setSysSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [editingNodeId, setEditingNodeId] = useState(null);
  const [tempLocation, setTempLocation] = useState("");

  // Helper untuk parse tanggal UTC dengan aman
  const parseDbDate = (dateStr) => {
    if (!dateStr) return null;
    const formattedStr = dateStr.includes("Z") || dateStr.includes("+") ? dateStr : `${dateStr.replace(" ", "T")}Z`;
    return new Date(formattedStr);
  };

  // 1. Fetch seluruh data riil dari Supabase
  // Parameter isInitial menentukan apakah loading spinner penuh perlu ditampilkan
  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);

      // A. Ambil Pengaturan Sistem Terbaru
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      
      if (settingsError && settingsError.code !== "PGRST116") {
        console.error("Gagal memuat settings:", settingsError);
      }
      
      const settings = settingsData || {
        fan_threshold: 35.0,
        node_power: true,
        fan_mode: "AUTO",
        fan_manual_target: false,
        node_timeout: 30,
        send_interval: 30
      };
      setSysSettings(settings);

      // B. Ambil Log Panel Utama Terbaru
      const { data: panelLogs, error: panelError } = await supabase
        .from("panel_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (panelError) console.error("Gagal memuat panel logs:", panelError);
      const latestPanel = panelLogs && panelLogs.length > 0 ? panelLogs[0] : null;

      // DETEKSI KONEKSI REALTIME PANEL
      let isPanelOnline = false;
      if (latestPanel && latestPanel.created_at) {
        const lastLogTime = parseDbDate(latestPanel.created_at)?.getTime() || 0;
        const now = new Date().getTime();
        const diffMinutes = Math.abs(now - lastLogTime) / (1000 * 60);

        const PANEL_TIMEOUT_MINUTES = 5;
        isPanelOnline = diffMinutes <= PANEL_TIMEOUT_MINUTES;
      }

      setPanelData(latestPanel ? { ...latestPanel, isConnected: isPanelOnline } : null);

      // C. Query Langsung Tabel 'node_devices' dari Supabase
      const { data: rawNodes, error: nodeError } = await supabase
        .from("node_devices")
        .select("*")
        .order("id", { ascending: true });

      if (nodeError) {
        console.error("Gagal memuat node_devices:", nodeError);
      }

      const formattedNodes = await Promise.all(
        (rawNodes || []).map(async (item) => {
          const { data: readings } = await supabase
            .from("sensor_readings")
            .select("*")
            .eq("device_id", item.id)
            .order("device_timestamp", { ascending: false })
            .limit(1);

          const latestReading = readings && readings.length > 0 ? readings[0] : null;

          const rawStatus = (item.status || "").trim().toLowerCase();
          const isNodeOffline = rawStatus === "offline";
          const isPowerOff = !settings.node_power;

          return {
            id: item.id,
            name: item.name,
            status: isPowerOff ? "power_off" : rawStatus,
            location: item.location ?? "-",
            lastSeen: item.last_seen,
            sensors: {
              soilMoisture: {
                status: isPowerOff || isNodeOffline ? "offline" : (latestReading?.soil_moisture != null ? "online" : "error"),
                value: latestReading?.soil_moisture != null ? `${latestReading.soil_moisture}%` : "-"
              },
              airTempHumidity: {
                status: isPowerOff || isNodeOffline ? "offline" : (latestReading?.temperature != null && latestReading?.humidity != null ? "online" : "error"),
                value: latestReading?.temperature != null ? `${latestReading.temperature}°C / ${latestReading.humidity}%` : "-"
              },
              lightIntensity: {
                status: isPowerOff || isNodeOffline ? "offline" : (latestReading?.light_intensity != null ? "online" : "error"),
                value: latestReading?.light_intensity != null ? `${latestReading.light_intensity.toLocaleString()} Lux` : "-"
              }
            }
          };
        })
      );

      setNodes(formattedNodes);
    } catch (err) {
      console.error("Gagal mendata perangkat dari Supabase:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // 2. Setup Realtime Listener Supabase
  useEffect(() => {
    // Ambil data pertama kali dengan indikator loading
    fetchData(true);

    // Buat Subscription Realtime untuk mendengarkan perubahan tabel
    const channel = supabase
      .channel("realtime_perangkat")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sensor_readings" },
        () => fetchData(false)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "panel_logs" },
        () => fetchData(false)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "node_devices" },
        () => fetchData(false)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        () => fetchData(false)
      )
      .subscribe();

    // Cleanup subscription saat komponen unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simpan Lokasi Baru ke Tabel 'node_devices'
  const handleSaveLocation = async (id) => {
    try {
      setSavingId(id);
      const { error } = await supabase
        .from("node_devices")
        .update({ location: tempLocation })
        .eq("id", id);

      if (error) throw error;

      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, location: tempLocation } : n))
      );
      setEditingNodeId(null);
    } catch (err) {
      alert("Gagal memperbarui lokasi. Silakan coba lagi.");
    } finally {
      setSavingId(null);
    }
  };

  // Helper Badge Status (Online / Offline / Error / Power OFF)
  const renderStatusBadge = (status) => {
    switch (status) {
      case "online":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-1">
            <CheckCircle2 size={12} /> Terhubung
          </span>
        );
      case "offline":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-full flex items-center gap-1">
            <WifiOff size={12} /> Terputus
          </span>
        );
      case "power_off":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-300 rounded-full flex items-center gap-1">
            <PowerOff size={12} /> Nonaktif (Power OFF)
          </span>
        );
      case "error":
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-1">
            <AlertTriangle size={12} /> Bermasalah
          </span>
        );
      default:
        return null;
    }
  };

  // Engine Troubleshooting Otomatis
  const generateTroubleshoots = () => {
    const list = [];
    const isGlobalNodePowerOff = sysSettings && sysSettings.node_power === false;
    const boxTemp = panelData?.box_temperature ?? 0;
    const fanThreshold = sysSettings?.fan_threshold ?? 35.0;
    const fanStatus = panelData?.fan_status ?? false;
    const fanMode = sysSettings?.fan_mode ?? "AUTO";

    // --- CHECK PANEL UTAMA ---
    if (!panelData || !panelData.isConnected) {
      list.push({
        source: "Panel Utama",
        issue: "Koneksi Panel Terputus / PCB Tanpa Daya",
        solution: "Periksa catu daya (power supply) pada Box Panel Utama. Pastikan PCB menyala dan modul penerima/pengirim sinyal terhubung ke internet."
      });
    } else {
      if (boxTemp > fanThreshold) {
        if (!fanStatus && fanMode === "AUTO") {
          list.push({
            source: "Panel Utama - Kipas Ventilasi",
            issue: `Suhu Box Panas (${boxTemp}°C) & Kipas Tidak Aktif`,
            solution: "Suhu internal panel melebihi batas threshold, namun kipas mode AUTO tidak berputar. Periksa kelistrikan kipas, jalur relay, atau sekerat fisik kipas."
          });
        } else if (fanStatus) {
          list.push({
            source: "Panel Utama",
            issue: `Suhu Box Tinggi (${boxTemp}°C)`,
            solution: "Kipas pendingin telah aktif otomatis. Pastikan ventilasi udara box panel tidak tersumbat kotoran agar pendinginan optimal."
          });
        }
      }

      if (panelData.rain_adc == null) {
        list.push({
          source: "Panel Utama - Sensor Hujan",
          issue: "Sensor Hujan Tidak Merespon",
          solution: "Bersihkan permukaan modul papan hujan dari debu/daun. Periksa kabel penghubung ke terminal PCB panel."
        });
      }
    }

    // --- CHECK NODE & SENSOR-SENSORNYA ---
    if (!isGlobalNodePowerOff) {
      nodes.forEach((node) => {
        if (node.status === "offline") {
          list.push({
            source: `${node.name} (${node.location})`,
            issue: "Koneksi Node Terputus",
            solution: "Cek ketersediaan tegangan solar panel pada node sekitar 12V dan tidak menunjukan perbedaan tegangan yang signifikan. Pastikan jarak node tidak terhalang material padat dari Panel, pastikan tidak ada gangguan sinyal WiFi di area node, Periksa kabel antena dan konektor modul WiFi."
          });
        } else {
          if (node.sensors.soilMoisture.status === "error") {
            list.push({
              source: `${node.name} - Sensor Kelembapan Tanah`,
              issue: "Data Sensor Kelembapan Tidak Valid",
              solution: "Tancapkan ulang probe sensor ke tanah. Periksa konektor kabel dari kemungkinan karat, korosi atau terlepas dari soket."
            });
          }
          if (node.sensors.airTempHumidity.status === "error") {
            list.push({
              source: `${node.name} - Sensor Suhu/Udara`,
              issue: "Data Sensor Suhu Udara Hilang",
              solution: "Periksa modul sensor DHT10 pada bagian bawah casing node, pastikan tidak terendam air tergenang atau tertutup, Periksa konektor kabel dari kemungkinan karat, korosi atau terlepas dari soket."
            });
          }
          if (node.sensors.lightIntensity.status === "error") {
            list.push({
              source: `${node.name} - Sensor Cahaya`,
              issue: "Data Sensor Cahaya Hilang",
              solution: "Bersihkan pelindung sensor cahaya dari debu pekat atau kotoran, Periksa konektor kabel dari kemungkinan karat, korosi atau terlepas dari soket."
            });
          }
        }
      });
    }

    return list;
  };

  const troubleshoots = generateTroubleshoots();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen text-slate-800">
      
      {/* HEADER & TAB SELECTOR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Status Perangkat</h1>
          <p className="text-sm text-slate-500">Monitoring kesehatan hardware, sensor, dan lokasi node perkebunan</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("nodes")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "nodes" 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Node Perkebunan ({nodes.length})
          </button>
          <button
            onClick={() => setActiveTab("panel")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "panel" 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Panel Utama
          </button>
        </div>
      </div>

      {/* BANNER INFORMASI: JIKA POWER NODE DIMATIKAN DARI PENGATURAN */}
      {sysSettings && !sysSettings.node_power && (
        <div className="p-4 bg-slate-800 text-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <PowerOff className="text-amber-400 shrink-0" size={20} />
            <span className="text-sm">
              <strong className="text-white">Daya Node Dimatikan Manual:</strong> Seluruh node perkebunan saat ini diset <strong>OFF</strong> melalui Pengaturan Sistem. Status terputus pada node dianggap sebagai kondisi normal.
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: DAFTAR NODE */}
      {activeTab === "nodes" && (
        loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={24} />
            <span>Memuat data node devices & sensor...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nodes.map((node) => (
              <div key={node.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Header Node */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      node.status === "online" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : node.status === "power_off" 
                        ? "bg-slate-100 text-slate-500" 
                        : "bg-rose-50 text-rose-600"
                    }`}>
                      <Cpu size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{node.name}</h3>
                      {renderStatusBadge(node.status)}
                    </div>
                  </div>
                </div>

                {/* Input Edit Lokasi */}
                <div className="mb-5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 truncate w-full">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                    {editingNodeId === node.id ? (
                      <input
                        type="text"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        placeholder="Masukan lokasi baru..."
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-full focus:outline-emerald-500"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium truncate">{node.location || "-"}</span>
                    )}
                  </div>

                  {editingNodeId === node.id ? (
                    <button 
                      onClick={() => handleSaveLocation(node.id)}
                      disabled={savingId === node.id}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded disabled:opacity-50"
                      title="Simpan Ke Supabase"
                    >
                      {savingId === node.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setEditingNodeId(node.id); setTempLocation(node.location); }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                      title="Ubah Lokasi"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>

                {/* Telemetri Sensor Node */}
                <div className="space-y-2.5 text-xs">
                  {/* Kelembapan Tanah */}
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Droplets size={14} className="text-blue-500" /> Kelembapan Tanah
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{node.sensors.soilMoisture.value}</span>
                      {renderStatusBadge(node.sensors.soilMoisture.status)}
                    </div>
                  </div>

                  {/* Suhu & Udara */}
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Thermometer size={14} className="text-orange-500" /> Suhu & Udara
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{node.sensors.airTempHumidity.value}</span>
                      {renderStatusBadge(node.sensors.airTempHumidity.status)}
                    </div>
                  </div>

                  {/* Intensitas Cahaya */}
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/70">
                    <span className="flex items-center gap-2 text-slate-600">
                      <Sun size={14} className="text-amber-500" /> Intensitas Cahaya
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{node.sensors.lightIntensity.value}</span>
                      {renderStatusBadge(node.sensors.lightIntensity.status)}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 2: PANEL UTAMA */}
      {activeTab === "panel" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Status Sistem & Koneksi PCB Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="text-emerald-600" size={20} /> Status Sistem Panel
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Wifi size={18} className={panelData?.isConnected ? "text-emerald-500" : "text-rose-500"} />
                Koneksi Modul Panel
              </span>
              {renderStatusBadge(panelData?.isConnected ? "online" : "offline")}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Thermometer size={18} className="text-amber-500" />
                Suhu Internal Box Panel
              </span>
              <span className={`font-mono font-bold text-sm ${
                panelData?.isConnected && (panelData?.box_temperature ?? 0) > (sysSettings?.fan_threshold ?? 35) 
                  ? "text-amber-600" 
                  : "text-slate-800"
              }`}>
                {panelData?.isConnected && panelData?.box_temperature != null ? `${panelData.box_temperature} °C` : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Power size={18} className={panelData?.isConnected && panelData?.fan_status ? "text-emerald-500" : "text-slate-400"} />
                Status Kipas Exhaust
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  panelData?.isConnected && panelData?.fan_status 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-slate-200 text-slate-700"
                }`}>
                  {panelData?.isConnected ? (panelData?.fan_status ? "AKTIF" : "MATI") : "OFFLINE"}
                </span>
                <span className="text-xs text-slate-400">
                  ({sysSettings?.fan_mode === "AUTO" ? "Auto Threshold" : "Manual"})
                </span>
              </div>
            </div>
          </div>

          {/* Sensor Direct Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CloudRain className="text-blue-600" size={20} /> Sensor Direct Panel
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Sensor Hujan (ADC)</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded font-mono">
                    {panelData?.isConnected && panelData?.rain_adc != null ? `ADC: ${panelData.rain_adc}` : "-"}
                  </span>
                  {renderStatusBadge(panelData?.isConnected && panelData?.rain_adc != null ? "online" : "offline")}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Kelembapan Box Panel</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded font-mono">
                    {panelData?.isConnected && panelData?.box_humidity != null ? `${panelData.box_humidity} %` : "-"}
                  </span>
                  {renderStatusBadge(panelData?.isConnected && panelData?.box_humidity != null ? "online" : "offline")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION TROUBLESHOOTING */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Pusat Troubleshooting & Panduan Perbaikan</h2>
              <p className="text-xs text-slate-500">Mendeteksi gangguan nyata berdasarkan data telemetri & konfigurasi sistem</p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
            {troubleshoots.length} Isu Terdeteksi
          </span>
        </div>

        {troubleshoots.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Seluruh sistem dan perangkat berjalan normal tanpa kendala.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {troubleshoots.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span className="px-2 py-0.5 bg-amber-100/80 rounded">{item.source}</span>
                  <span className="text-rose-600 font-semibold">{item.issue}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Cara Perbaikan:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}