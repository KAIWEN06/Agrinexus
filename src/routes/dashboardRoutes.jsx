import { Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute"; // Import AdminRoute

import Dashboard from "../pages/Dashboard";
import History from "../pages/History";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Perangkat from "../pages/Perangkat";
import UserManagement from "../pages/UserManagement"; // Import Halaman CRUD

import { ROUTES } from "../constants/app/routes";

const dashboardRoutes = (
  <Route element={<PrivateRoute />}>
    <Route element={<DashboardLayout />}>
      <Route
        path={ROUTES.DASHBOARD}
        element={<Dashboard />}
      />

      <Route
        path={ROUTES.HISTORY}
        element={<History />}
      />

      <Route
        path={ROUTES.NOTIFICATIONS}
        element={<Notifications />}
      />
      
      <Route
        path={ROUTES.PERANGKAT}
        element={<Perangkat />}
      />

      <Route
        path={ROUTES.SETTINGS}
        element={<Settings />}
      />

      <Route
        path={ROUTES.PROFILE}
        element={<Profile />}
      />

      {/* RUTE KHUSUS ADMINISTRATOR */}
      <Route element={<AdminRoute />}>
        <Route
          path={ROUTES.USERS}
          element={<UserManagement />}
        />
      </Route>
    </Route>
  </Route>
);

export default dashboardRoutes;