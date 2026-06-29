import { BrowserRouter, Routes, Route } from "react-router-dom";

import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {authRoutes}

        {dashboardRoutes}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}