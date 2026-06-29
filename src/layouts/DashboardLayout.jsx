import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />

      <div className="ml-[280px] flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}