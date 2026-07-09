import { useMemo, useState } from "react";

export default function useHistoryFilter(history = []) {
  /* ===========================================================
      SEARCH
  =========================================================== */

  const [search, setSearch] = useState("");

  /* ===========================================================
      MULTI SELECT
  =========================================================== */

  const [selectedNodes, setSelectedNodes] = useState([]);

  const [selectedSensors, setSelectedSensors] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState([]);

  /* ===========================================================
      SINGLE SELECT
  =========================================================== */

  const [selectedRain, setSelectedRain] = useState("all");

  const [selectedDate, setSelectedDate] = useState("all");

  /* ===========================================================
      NODE OPTIONS
  =========================================================== */

  const nodeOptions = useMemo(() => {
    return [...new Set(history.map((item) => item.node))]
      .sort()
      .map((node) => ({
        label: node,
        value: node,
      }));
  }, [history]);

  /* ===========================================================
      SENSOR OPTIONS
  =========================================================== */

  const sensorOptions = [
    {
      label: "Suhu",
      value: "temperature",
    },
    {
      label: "Kelembapan Udara",
      value: "humidity",
    },
    {
      label: "Kelembapan Tanah",
      value: "soil",
    },
    {
      label: "Intensitas Cahaya",
      value: "light",
    },
    {
      label: "Status Hujan",
      value: "rain",
    },
  ];

  /* ===========================================================
      STATUS OPTIONS
  =========================================================== */

  const statusOptions = [
    {
      label: "Baik",
      value: "success",
    },
    {
      label: "Perlu Perhatian",
      value: "warning",
    },
    {
      label: "Kritis",
      value: "danger",
    },
  ];

  /* ===========================================================
      FILTER
  =========================================================== */

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      /* =============================
          SEARCH
      ============================= */

      const keyword = search.trim().toLowerCase();

      const matchSearch =
        keyword === "" ||
        item.node.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.timestamp.toLowerCase().includes(keyword);

      /* =============================
          NODE
      ============================= */

      const matchNode =
        selectedNodes.length === 0 ||
        selectedNodes.includes(item.node);

      /* =============================
          STATUS
      ============================= */

      const matchStatus =
        selectedStatus.length === 0 ||
        selectedStatus.includes(item.badge);

      /* =============================
          RAIN
      ============================= */

      const rainStatus =
        item.rainStatus ?? "Tidak Hujan";

      const matchRain =
        selectedRain === "all" ||
        (selectedRain === "rain"
          ? rainStatus === "Terdeteksi Hujan"
          : rainStatus === "Tidak Hujan");

      /* =============================
          DATE
          (sementara)
      ============================= */

      const matchDate = true;

      return (
        matchSearch &&
        matchNode &&
        matchStatus &&
        matchRain &&
        matchDate
      );
    });
  }, [
    history,
    search,
    selectedNodes,
    selectedStatus,
    selectedRain,
    selectedDate,
  ]);

  /* ===========================================================
      RESET
  =========================================================== */

  const resetFilter = () => {
    setSearch("");

    setSelectedNodes([]);

    setSelectedSensors([]);

    setSelectedStatus([]);

    setSelectedRain("all");

    setSelectedDate("all");
  };

  /* ===========================================================
      RETURN
  =========================================================== */

  return {
    /* =============================
        DATA
    ============================= */

    filteredHistory,

    /* =============================
        SEARCH
    ============================= */

    search,
    setSearch,

    /* =============================
        MULTI SELECT
    ============================= */

    selectedNodes,
    setSelectedNodes,

    selectedSensors,
    setSelectedSensors,

    selectedStatus,
    setSelectedStatus,

    /* =============================
        SINGLE SELECT
    ============================= */

    selectedRain,
    setSelectedRain,

    selectedDate,
    setSelectedDate,

    /* =============================
        OPTIONS
    ============================= */

    nodeOptions,

    sensorOptions,

    statusOptions,

    /* =============================
        ACTION
    ============================= */

    resetFilter,
  };
}