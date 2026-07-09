import { useContext } from "react";

import { HistoryContext } from "../contexts/HistoryContext";

export default function useHistory() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error("useHistory harus digunakan di dalam HistoryProvider.");
  }

  return context;
}
