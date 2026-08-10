import {
  LayoutDashboard,
  Cpu,
  History,
  Bell,
  Settings,
  User
} from "lucide-react";

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
    title: "Notifikasi",
    path: "/notifications",
    icon: Bell
  },
  {
    title: "Perangkat",
    path: "/perangkat", // bisa disesuaikan jadi /perangkat jika perlu
    icon: Cpu
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
