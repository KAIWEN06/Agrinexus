import { forwardRef, useMemo, useState } from "react";
import { User } from "lucide-react";

import { cn } from "../../../utils/cn";

import {
  avatarSizes,
  avatarStatus,
} from "../../../constants/ui/avatar";

/* ======================================
   Root
====================================== */

const Avatar = forwardRef(
  (
    {
      src,

      alt = "Avatar",

      name = "",

      size = "md",

      rounded = true,

      children,

      className,

      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const initials = useMemo(() => {
      if (!name) return "";

      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }, [name]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0",

          avatarSizes[size],

          className
        )}
        {...props}
      >
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className={cn(
              "h-full w-full object-cover",

              rounded
                ? "rounded-full"
                : "rounded-[var(--radius-card)]"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center",

              "bg-[var(--muted)]",

              "text-[var(--foreground)]",

              "font-semibold",

              rounded
                ? "rounded-full"
                : "rounded-[var(--radius-card)]"
            )}
          >
            {initials || <User size={20} />}
          </div>
        )}

        {children}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

/* ======================================
   Status
====================================== */

const Status = ({
  status = "online",

  className,
}) => (
  <span
    className={cn(
      "absolute",

      "bottom-0",

      "right-0",

      "h-3.5",

      "w-3.5",

      "rounded-full",

      "border-2",

      "border-[var(--background)]",

      avatarStatus[status],

      className
    )}
  />
);

/* ======================================
   Badge
====================================== */

const Badge = ({
  children,

  className,
}) => (
  <span
    className={cn(
      "absolute",

      "-top-1",

      "-right-1",

      "flex",

      "min-h-5",

      "min-w-5",

      "items-center",

      "justify-center",

      "rounded-full",

      "bg-[var(--destructive)]",

      "px-1.5",

      "text-[10px]",

      "font-semibold",

      "text-white",

      "border-2",

      "border-[var(--background)]",

      className
    )}
  >
    {children}
  </span>
);

Avatar.Status = Status;
Avatar.Badge = Badge;

export default Avatar;