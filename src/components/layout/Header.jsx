import { Bell, Search } from "lucide-react";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Header() {
  const user = {
    fullName: "Kevin Sondakh",
    avatar: "",
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40

        flex
        items-center
        justify-end

        border-b
        border-[var(--border)]

        bg-white/90

        px-6
        py-4

        backdrop-blur-md
      "
    >
      <div className="flex items-center gap-4">
        {/* Search */}

        <div className="hidden w-80 lg:block">
          <Input
            placeholder="Search..."
            startContent={<Search size={18} />}
          />
        </div>

        {/* Notification */}

        <Button
          variant="ghost"
          size="icon"
        >
          <Bell size={20} />
        </Button>

        {/* User */}

        <Avatar
          src={user.avatar}
          alt={user.fullName}
          fallback={user.fullName}
        />
      </div>
    </header>
  );
}