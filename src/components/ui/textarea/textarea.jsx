import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

import {
  textareaVariants,
} from "../../../constants/ui/textarea";

const Textarea = forwardRef(
  (
    {
      label,

      helperText,

      error,

      required = false,

      fullWidth = true,

      resize = "vertical",

      rows = 4,

      containerClassName,

      className,

      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-2",

          fullWidth && "w-full",

          containerClassName
        )}
      >
        {label && (
          <label
            className="
              text-sm
              font-medium
              text-[var(--foreground)]
            "
          >
            {label}

            {required && (
              <span className="ml-1 text-[var(--destructive)]">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full",

            "rounded-[var(--radius-input)]",

            "border",

            "bg-[var(--background)]",

            "px-4",

            "py-3",

            "outline-none",

            "transition-all",

            "duration-200",

            "placeholder:text-[var(--muted-foreground)]",

            "disabled:cursor-not-allowed",

            "disabled:opacity-60",

            {
              "resize-none": resize === "none",
              "resize-y": resize === "vertical",
              "resize-x": resize === "horizontal",
              "resize": resize === "both",
            },

            textareaVariants[
              error ? "error" : "default"
            ],

            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-sm text-[var(--destructive)]">
            {error}
          </p>
        ) : (
          helperText && (
            <p className="text-sm text-[var(--muted-foreground)]">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;