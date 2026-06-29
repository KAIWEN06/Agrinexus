import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  dashboardStatistics,
  healthScore,
  temperatureData,
  humidityData,
  soilMoistureData,
  lightData,
  notifications,
  sensorNodes,
} from "../data/dashboard";

import { historyData } from "../data/history";

export const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState({
    statistics: dashboardStatistics,

    health: healthScore,

    charts: {
      temperature: temperatureData,
      humidity: humidityData,
      soil: soilMoistureData,
      light: lightData,
    },

    notifications,

    sensorNodes,

    history: historyData,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const updateDashboard = useCallback((payload) => {
    setDashboard((prev) => ({
      ...prev,
      ...payload,
    }));

    setLastUpdated(new Date());
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      /*
       * =====================================
       * FASTAPI
       * =====================================
       *
       * const response =
       * await dashboardService.getDashboard();
       *
       * updateDashboard(response.data);
       *
       */

      console.log("Dashboard refreshed");

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, [updateDashboard]);

  const value = useMemo(
    () => ({
      dashboard,

      loading,

      error,

      lastUpdated,

      setDashboard,

      updateDashboard,

      refreshDashboard,
    }),
    [
      dashboard,
      loading,
      error,
      lastUpdated,
      updateDashboard,
      refreshDashboard,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}