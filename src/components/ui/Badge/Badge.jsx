import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

import {
  badgeVariants,
  badgeSizes,
} from "../../../constants/ui/badge";

const Badge = forwardRef(
  (
    {
      children,

      variant = "default",

      size = "md",

      rounded = true,

      startContent,

      endContent,

      className,

      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5",

          "font-medium",

          "whitespace-nowrap",

          "transition-all duration-200",

          rounded
            ? "rounded-full"
            : "rounded-[var(--radius-button)]",

          badgeVariants[variant],

          badgeSizes[size],

          className
        )}
        {...props}
      >
        {startContent}

        {children}

        {endContent}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;