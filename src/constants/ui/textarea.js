export const textareaVariants = {
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
