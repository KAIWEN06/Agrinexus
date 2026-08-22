import {
  LayoutDashboard,
  Cpu,
  History,
  Bell,
  Settings,
  User,
  Users // Import ikon Users
} from "lucide-react"; //[cite: 17]

import { ROUTES } from "./routes";

export const menu = [
  {
    title: "Beranda",
    path: ROUTES.DASHBOARD || "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Riwayat",
    path: ROUTES.HISTORY || "/history",
    icon: History
  },
  {
    title: "Notifikasi",
    path: ROUTES.NOTIFICATIONS || "/notifications",
    icon: Bell
  },
  {
    title: "Perangkat",
    path: ROUTES.PERANGKAT || "/perangkat",
    icon: Cpu
  },
  {
    title: "Pengaturan",
    path: ROUTES.SETTINGS || "/settings",
    icon: Settings
  },
  {
    title: "Profil",
    path: ROUTES.PROFILE || "/profile",
    icon: User
  },
  {
    title: "Manajemen Akun", // Menu baru khusus Administrator
    path: ROUTES.USERS || "/users",
    icon: Users,
    roles: ["Administrator"]
  }
];
