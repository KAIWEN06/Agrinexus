import { LayoutDashboard, History, Bell, Settings, User } from "lucide-react";

export const menu = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },

  {
    title: "Riwayat",
    path: "/history",
    icon: History
  },

  {
    title: "Notifikasi",
    path: "/notifications",
    icon: Bell
  },

  {
    title: "Pengaturan",
    path: "/settings",
    icon: Settings
  },

  {
    title: "Profil",
    path: "/profile",
    icon: User
  }
];
