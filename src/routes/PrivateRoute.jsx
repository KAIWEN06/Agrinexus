import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/app/routes";

export default function PrivateRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Memuat...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}