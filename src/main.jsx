import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { NotificationProvider } from "./contexts/NotificationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>

      <NotificationProvider>

        <DashboardProvider>

          <HistoryProvider>

            <App />

          </HistoryProvider>

        </DashboardProvider>

      </NotificationProvider>

    </AuthProvider>
  </StrictMode>
);