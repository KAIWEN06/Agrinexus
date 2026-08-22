import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/app/routes";

export default function AdminRoute() {
  const { loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Memuat...
      </div>
    );
  }

  // Gunakan profile?.role
  if (profile?.role !== "Administrator") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}