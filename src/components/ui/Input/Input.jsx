import { forwardRef } from "react";
import { cn } from "../../../utils/cn";

import {
  inputVariants,
  inputSizes,
} from "../../../constants/ui/input";

const Input = forwardRef(
  (
    {
      label,

      helperText,

      error,

      leftIcon,

      rightIcon,

      variant = "default",

      size = "md",

      required = false,

      fullWidth = true,

      className,

      containerClassName,

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
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}

            {required && (
              <span className="ml-1 text-[var(--destructive)]">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">

          {leftIcon && (
            <div
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[var(--muted-foreground)]
                pointer-events-none
              "
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "w-full",

              "rounded-[var(--radius-input)]",

              "border",

              "bg-[var(--background)]",

              "px-4",

              "outline-none",

              "transition-all",

              "duration-200",

              "placeholder:text-[var(--muted-foreground)]",

              "disabled:cursor-not-allowed",

              "disabled:opacity-60",

              leftIcon && "pl-10",

              rightIcon && "pr-10",

              inputSizes[size],

              inputVariants[error ? "error" : variant],

              className
            )}
            {...props}
          />
            {rightIcon && (
            <div
                className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                "
            >
                {rightIcon}
            </div>
            )}

        </div>

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

Input.displayName = "Input";

export default Input;