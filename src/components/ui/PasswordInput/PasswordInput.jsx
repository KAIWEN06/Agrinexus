import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import Input from "../Input";
import { cn } from "../../../utils/cn";

const PasswordInput = forwardRef(
  (
    {
      label = "Kata Sandi",

      placeholder = "Masukkan kata sandi",

      showLockIcon = true,

      required = false,

      disabled = false,

      className,

      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        leftIcon={showLockIcon ? <Lock size={18} /> : null}
        rightIcon={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center",
              "text-[var(--muted-foreground)]",
              "transition-colors duration-200",
              "hover:text-[var(--foreground)]",
              "disabled:cursor-not-allowed"
            )}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        }
        className={className}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;