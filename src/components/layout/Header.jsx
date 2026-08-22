import { useEffect, useRef, useState } from "react";
import { Bell, Menu } from "lucide-react";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

import { NotificationDropdown, ProfileDropdown } from "../overlay";

import { useNotification } from "../../contexts/NotificationContext";
import useAuth from "../../hooks/useAuth"; // Adjust path to hook
import { getProfile } from "../../services/profileService"; // Adjust path to service

export default function Header({ onMenuClick }) {
  // 1. Ambil data user auth dari Context
  const { user: authUser } = useAuth(); 

  // 2. State untuk menyimpan data profil dinamis
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });

  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [openNotification, setOpenNotification] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // 3. Fetch profil dari Supabase berdasarkan ID user yang login
  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser?.id) return;

      try {
        const data = await getProfile(authUser.id);
        if (data) {
          setProfileData({
            fullName: data.full_name || authUser.user_metadata?.full_name || "User",
            email: data.email || authUser.email || "",
            avatar: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data profil di header:", error);
        // Fallback jika fetch gagal
        setProfileData({
          fullName: authUser.user_metadata?.full_name || "User",
          email: authUser.email || "",
          avatar: "",
        });
      }
    }

    fetchUserProfile();
  }, [authUser]);

  // Click Outside & Escape logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpenNotification(false);
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-white/90 px-4 py-4 backdrop-blur-md md:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpenNotification((prev) => !prev);
              setOpenProfile(false);
            }}
          >
            <div className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </Button>

          <NotificationDropdown
            open={openNotification}
            notifications={notifications}
            unreadCount={unreadCount}
            onClose={() => setOpenNotification(false)}
            onMarkAllRead={markAllAsRead}
          />
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setOpenProfile((prev) => !prev);
              setOpenNotification(false);
            }}
            className="rounded-full transition hover:opacity-90"
          >
            <Avatar src={profileData.avatar} name={profileData.fullName} />
          </button>

          <ProfileDropdown
            open={openProfile}
            user={profileData}
            onClose={() => setOpenProfile(false)}
          />
        </div>
      </div>
    </header>
  );
}