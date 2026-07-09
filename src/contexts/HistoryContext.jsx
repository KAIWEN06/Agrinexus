import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import historyService from "../services/historyService";

export const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Mengambil data riwayat
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await historyService.getHistory();

      setHistory(data);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh data
   */
  const refreshHistory = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const value = useMemo(
    () => ({
      history,

      loading,

      error,

      lastUpdated,

      refreshHistory,
    }),
    [
      history,
      loading,
      error,
      lastUpdated,
      refreshHistory,
    ]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}