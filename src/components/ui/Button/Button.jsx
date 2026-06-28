import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "../../../utils/cn";

import {
  buttonVariants,
  buttonSizes,
} from "../../../constants/ui/button";

const Button = forwardRef(
  (
    {
      children,

      variant = "primary",

      size = "md",

      type = "button",

      loading = false,

      loadingText = "Memproses...",

      disabled = false,

      fullWidth = false,

      startContent,

      endContent,

      className,

      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2",

          "rounded-[var(--radius-button)]",

          "font-medium",

          "transition-all duration-200",

          "select-none",

          "focus:outline-none",

          "focus:ring-2",

          "focus:ring-offset-2",

          "disabled:pointer-events-none",

          "disabled:opacity-50",

          buttonVariants[variant],

          buttonSizes[size],

          fullWidth && "w-full",

          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin"
            />

            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {startContent}

            {children}

            {endContent}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;