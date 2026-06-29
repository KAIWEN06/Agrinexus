import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/app/routes";

export default function PublicRoute() {
  const location = useLocation();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Memuat...
      </div>
    );
  }

  const allowAuthenticated =
    location.pathname === ROUTES.RESET_PASSWORD;

  if (
    isAuthenticated &&
    !allowAuthenticated
  ) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
      />
    );
  }

  return <Outlet />;
}