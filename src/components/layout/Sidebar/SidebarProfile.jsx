import Avatar from "../../ui/Avatar";

export default function SidebarProfile({
  collapsed = false,
}) {
  const user = {
    fullName: "Kevin Sondakh",
    email: "kevin@example.com",
    role: "Admin",
    avatar: "",
  };

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
        src={user.avatar}
        alt={user.fullName}
        name={user.fullName}
        size={collapsed ? "sm" : "md"}
      />

      {!collapsed && (
        <div className="min-w-0 flex-1">

          <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">
            {user.fullName}
          </h3>

          <p className="truncate text-xs text-[var(--text-secondary)]">
            {user.role}
          </p>

        </div>
      )}
    </div>
  );
}