export const badgeVariants = {
  default: ["bg-[var(--muted)]", "text-[var(--foreground)]"].join(" "),

  primary: ["bg-[var(--primary)]/10", "text-[var(--primary)]"].join(" "),

  success: ["bg-[var(--success)]/10", "text-[var(--success)]"].join(" "),

  warning: ["bg-[var(--warning)]/10", "text-[var(--warning)]"].join(" "),

  danger: ["bg-[var(--destructive)]/10", "text-[var(--destructive)]"].join(" "),

  info: ["bg-[var(--info)]/10", "text-[var(--info)]"].join(" "),

  outline: [
    "border",
    "border-[var(--border)]",
    "bg-transparent",
    "text-[var(--foreground)]"
  ].join(" ")
};

export const badgeSizes = {
  sm: "h-5 px-2 text-[11px]",

  md: "h-6 px-3 text-xs",

  lg: "h-7 px-4 text-sm"
};
