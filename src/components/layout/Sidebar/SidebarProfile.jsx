import { useEffect, useState } from "react";
import Avatar from "../../ui/Avatar";
import useAuth from "../../../hooks/useAuth";
import { getProfile } from "../../../services/profileService";

export default function SidebarProfile({ collapsed = false }) {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: "",
    role: "",
    avatar: "",
  });

  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser?.id) return;

      try {
        const data = await getProfile(authUser.id);
        if (data) {
          setProfileData({
            fullName: data.full_name || authUser.user_metadata?.full_name || "User",
            role: data.role || "Administrator",
            avatar: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil profil sidebar:", error);
        setProfileData({
          fullName: authUser.user_metadata?.full_name || "User",
          role: "Administrator",
          avatar: "",
        });
      }
    }

    fetchUserProfile();
  }, [authUser]);

  return (
    <div
      className={
        collapsed
          ? "flex justify-center"
          : `
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-3
            `
      }
    >
      <Avatar
        src={profileData.avatar}
        alt={profileData.fullName}
        name={profileData.fullName}
        size={collapsed ? "sm" : "md"}
      />

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">
            {profileData.fullName || "-"}
          </h3>

          <p className="truncate text-xs text-[var(--text-secondary)]">
            {profileData.role || "Administrator"}
          </p>
        </div>
      )}
    </div>
  );
}