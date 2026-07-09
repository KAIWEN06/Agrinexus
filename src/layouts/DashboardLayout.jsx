import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      setCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">

      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`
          flex
          min-h-screen
          flex-col
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-20"
              : "lg:ml-[280px]"
          }
        `}
      >
        <Header
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        <Footer />

      </div>

    </div>
  );
}