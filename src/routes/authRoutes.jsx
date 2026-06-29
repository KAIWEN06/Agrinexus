import { Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import PublicRoute from "./PublicRoute";

import { ROUTES } from "../constants/app/routes";

const authRoutes = (
  <Route element={<PublicRoute />}>
    <Route element={<AuthLayout />}>
      <Route
        index
        element={<Login />}
      />

      <Route
        path={ROUTES.FORGOT_PASSWORD.slice(1)}
        element={<ForgotPassword />}
      />

      <Route
        path={ROUTES.RESET_PASSWORD.slice(1)}
        element={<ResetPassword />}
      />
    </Route>
  </Route>
);

export default authRoutes;