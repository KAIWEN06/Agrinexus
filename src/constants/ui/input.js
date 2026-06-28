export const inputVariants = {
  default: [
    "border-[var(--border)]",
    "focus:border-[var(--primary)]",
    "focus:ring-4",
    "focus:ring-[color:var(--primary)]/10"
  ].join(" "),

  error: [
    "border-[var(--destructive)]",
    "focus:border-[var(--destructive)]",
    "focus:ring-4",
    "focus:ring-[color:var(--destructive)]/10"
  ].join(" "),

  success: [
    "border-[var(--success)]",
    "focus:border-[var(--success)]",
    "focus:ring-4",
    "focus:ring-[color:var(--success)]/10"
  ].join(" ")
};

export const inputSizes = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",
  lg: "h-12 text-base"
};
