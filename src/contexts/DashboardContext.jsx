import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import dashboardService from "../services/dashboardService";

export const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  const isFirstLoad = useRef(true);

  const refreshTimeout = useRef(null);

  const loadDashboard = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setError(null);

        const data =
          await dashboardService.getDashboard();

        setDashboard(data);

        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);

        setError(err);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  const updateDashboard = useCallback((payload) => {
    setDashboard((prev) => ({
      ...prev,
      ...payload,
    }));

    setLastUpdated(new Date());
  }, []);

  const refreshDashboard = useCallback(async () => {
    await loadDashboard(false);
  }, [loadDashboard]);

  useEffect(() => {
    loadDashboard(true);

    const scheduleRefresh = () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      refreshTimeout.current = setTimeout(() => {
        loadDashboard(false);
      }, 500);
    };

    const channel = supabase
      .channel("agrinexus-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sensor_readings",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "node_devices",
        },
        scheduleRefresh
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        scheduleRefresh
      )
      .subscribe((status) => {
        console.log(
          "Realtime Dashboard:",
          status
        );
      });

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      supabase.removeChannel(channel);
    };
  }, [loadDashboard]);

  useEffect(() => {
    if (isFirstLoad.current && dashboard) {
      isFirstLoad.current = false;
      setLoading(false);
    }
  }, [dashboard]);

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