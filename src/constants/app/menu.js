import { LayoutDashboard, History, Bell, Settings, User } from "lucide-react";

export const menu = [
  {
    title: "Beranda",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Riwayat",
    path: "/history",
    icon: History
  },
  {
    title: "Nonifikasi",
    path: "/notifications",
    icon: Bell
  },
  {
    title: "Setingan",
    path: "/settings",
    icon: Settings
  },
  {
    title: "Profil",
    path: "/profile",
    icon: User
  }
];
