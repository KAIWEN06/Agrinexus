import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

/* ===========================================
   Root
=========================================== */

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

/* ===========================================
   Content
=========================================== */

const TooltipContent = forwardRef(
  (
    {
      className,

      side = "top",

      sideOffset = 8,

      children,

      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50",

          "rounded-lg",

          "border",

          "border-[var(--border)]",

          "bg-[var(--card)]",

          "px-3",

          "py-2",

          "text-xs",

          "font-medium",

          "text-[var(--foreground)]",

          "shadow-[var(--shadow-card)]",

          "animate-fade-in",

          className
        )}
        {...props}
      >
        {children}

        <TooltipPrimitive.Arrow
          className="fill-[var(--card)]"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);

TooltipContent.displayName = "TooltipContent";

/* ===========================================
   Compound Component
=========================================== */

Tooltip.Provider = TooltipProvider;

Tooltip.Trigger = TooltipTrigger;

Tooltip.Content = TooltipContent;

export default Tooltip;