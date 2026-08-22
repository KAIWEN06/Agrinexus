import { menu } from "../../../constants/app/menu";
import SidebarMenuItem from "./SidebarMenuItem";
import useAuth from "../../../hooks/useAuth";

export default function SidebarMenu({ collapsed, onClose }) {
  // Ambil 'profile' (bukan hanya 'user') dari AuthContext
  const { profile } = useAuth(); 

  // Filter daftar menu berdasarkan role di dalam profile
  const filteredMenu = menu.filter((item) => {
    // Jika menu tidak memiliki batasan role, tampilkan untuk semua orang
    if (!item.roles || item.roles.length === 0) return true;

    // Ambil role dari profile dan ubah ke lowercase
    const currentRole = profile?.role?.trim().toLowerCase();

    // Cek apakah role saat ini terdaftar di item.roles (secara case-insensitive)
    return item.roles.some(
      (allowedRole) => allowedRole.toLowerCase() === currentRole
    );
  });

  return (
    <nav className="flex flex-1 flex-col gap-2">
      {filteredMenu.map((item) => (
        <SidebarMenuItem
          key={item.path}
          item={item}
          collapsed={collapsed}
          onClose={onClose}
        />
      ))}
    </nav>
  );
}