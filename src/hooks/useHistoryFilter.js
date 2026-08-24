// src/hooks/useHistoryFilter.js
import { useState, useMemo } from "react";

function getISOWeekString(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export default function useHistoryFilter(history = []) {
  const today = new Date();
  const todayYYYYMMDD = today.toISOString().split("T")[0];
  const currentMonth = today.toISOString().slice(0, 7);
  const currentYear = String(today.getFullYear());
  const currentWeek = getISOWeekString(today);

  // State Filter
  const [search, setSearch] = useState("");
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedRain, setSelectedRain] = useState("all");

  // State Waktu Dinamis
  const [timeMode, setTimeMode] = useState("day");
  const [selectedDayDate, setSelectedDayDate] = useState(todayYYYYMMDD);
  const [selectedHour, setSelectedHour] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Dynamic Options for Select UI
  const nodeOptions = useMemo(() => {
    const uniqueNodes = [...new Set(history.map((item) => item.node).filter(Boolean))];
    return uniqueNodes.map((node) => ({ value: node, label: node }));
  }, [history]);

  const sensorOptions = [
    { value: "temperature", label: "Suhu Udara" },
    { value: "humidity", label: "Kelembapan Udara" },
    { value: "soil", label: "Kelembapan Tanah" },
    { value: "light", label: "Intensitas Cahaya" },
    { value: "rain", label: "Status Hujan" },
  ];

  const statusOptions = useMemo(() => {
    const uniqueStatus = [...new Set(history.map((item) => item.status).filter(Boolean))];
    return uniqueStatus.map((status) => ({ value: status, label: status }));
  }, [history]);

  // Filter Data Logic
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const itemDate = new Date(item.rawTimestamp || item.device_timestamp || item.timestamp);
      if (isNaN(itemDate.getTime())) return true;

      // 1. Mode Waktu
      if (timeMode === "day") {
        const itemDateStr = itemDate.toISOString().split("T")[0];
        if (selectedDayDate && itemDateStr !== selectedDayDate) return false;

        if (selectedHour !== "all") {
          const itemHour = String(itemDate.getHours()).padStart(2, "0");
          if (itemHour !== selectedHour) return false;
        }
      } else if (timeMode === "week") {
        if (selectedWeek) {
          const itemWeekStr = getISOWeekString(itemDate);
          if (itemWeekStr !== selectedWeek) return false;
        }
      } else if (timeMode === "month") {
        if (selectedMonth) {
          const itemMonthStr = itemDate.toISOString().slice(0, 7);
          if (itemMonthStr !== selectedMonth) return false;
        }
      } else if (timeMode === "year") {
        if (selectedYear) {
          if (String(itemDate.getFullYear()) !== selectedYear) return false;
        }
      }

      // 2. MultiSelect Node
      if (selectedNodes.length > 0 && !selectedNodes.includes(item.node)) {
        return false;
      }

      // 3. MultiSelect Status
      if (selectedStatus.length > 0 && !selectedStatus.includes(item.status)) {
        return false;
      }

      // 4. Status Hujan
      if (selectedRain === "dry" && item.rainStatus === "Terdeteksi Hujan") return false;
      if (selectedRain === "rain" && item.rainStatus !== "Terdeteksi Hujan") return false;

      // 5. Search Box
      if (search) {
        const query = search.toLowerCase();
        const nodeMatch = item.node?.toLowerCase().includes(query);
        const statusMatch = item.status?.toLowerCase().includes(query);
        if (!nodeMatch && !statusMatch) return false;
      }

      return true;
    });
  }, [
    history,
    timeMode,
    selectedDayDate,
    selectedHour,
    selectedWeek,
    selectedMonth,
    selectedYear,
    selectedNodes,
    selectedStatus,
    selectedRain,
    search,
  ]);

  const resetFilter = () => {
    setSearch("");
    setSelectedNodes([]);
    setSelectedSensors([]);
    setSelectedStatus([]);
    setSelectedRain("all");
    setTimeMode("day");
    setSelectedDayDate(todayYYYYMMDD);
    setSelectedHour("all");
    setSelectedWeek(currentWeek);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  return {
    search,
    setSearch,
    selectedNodes,
    setSelectedNodes,
    nodeOptions,
    selectedSensors,
    setSelectedSensors,
    sensorOptions,
    selectedStatus,
    setSelectedStatus,
    statusOptions,
    selectedRain,
    setSelectedRain,
    timeMode,
    setTimeMode,
    selectedDayDate,
    setSelectedDayDate,
    selectedHour,
    setSelectedHour,
    selectedWeek,
    setSelectedWeek,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filteredHistory,
    resetFilter,
  };
}