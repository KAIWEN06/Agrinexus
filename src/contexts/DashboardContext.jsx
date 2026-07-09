import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import dashboardService from "../services/dashboardService";

export const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Mengambil data dashboard.
   */
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dashboardService.getDashboard();

      setDashboard(data);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Memperbarui sebagian data dashboard.
   */
  const updateDashboard = useCallback((payload) => {
    setDashboard((prev) => ({
      ...prev,
      ...payload,
    }));

    setLastUpdated(new Date());
  }, []);

  /**
   * Refresh dashboard.
   */
  const refreshDashboard = useCallback(async () => {
    await loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const value = useMemo(
    () => ({
      dashboard,

      loading,

      error,

      lastUpdated,

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