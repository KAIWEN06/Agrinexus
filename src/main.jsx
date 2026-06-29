import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { DashboardProvider } from "./contexts/DashboardContext";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>

      <DashboardProvider>

        <App />

      </DashboardProvider>

    </AuthProvider>
  </StrictMode>
);