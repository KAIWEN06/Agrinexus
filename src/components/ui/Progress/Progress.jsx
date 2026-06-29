import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

import {
  progressVariants,
  progressSizes,
} from "../../../constants/ui/progress";

const Progress = forwardRef(
  (
    {
      value = 0,

      max = 100,

      size = "md",

      variant = "primary",

      showValue = false,

      animated = true,

      striped = false,

      className,

      ...props
    },
    ref
  ) => {
    const percentage = Math.min(
      Math.max((value / max) * 100, 0),
      100
    );

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        <div
          className={cn(
            "overflow-hidden",

            "rounded-full",

            "bg-[var(--muted)]",

            progressSizes[size]
          )}
        >
          <div
            className={cn(
              "h-full",

              "rounded-full",

              progressVariants[variant],

              animated &&
                "transition-all duration-500 ease-in-out",

              striped &&
                "bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"
            )}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        {showValue && (
          <div className="mt-2 text-right text-sm text-[var(--muted-foreground)]">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;