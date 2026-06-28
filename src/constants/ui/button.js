export const buttonVariants = {
  primary: [
    "bg-[var(--primary)]",
    "text-[var(--primary-foreground)]",
    "hover:opacity-90",
    "focus:ring-[var(--primary)]"
  ].join(" "),

  secondary: [
    "bg-[var(--secondary)]",
    "text-[var(--secondary-foreground)]",
    "hover:opacity-90",
    "focus:ring-[var(--secondary)]"
  ].join(" "),

  outline: [
    "border",
    "border-[var(--border)]",
    "bg-transparent",
    "text-[var(--foreground)]",
    "hover:bg-[var(--muted)]",
    "focus:ring-[var(--border)]"
  ].join(" "),

  ghost: [
    "bg-transparent",
    "text-[var(--foreground)]",
    "hover:bg-[var(--muted)]",
    "focus:ring-[var(--border)]"
  ].join(" "),

  danger: [
    "bg-[var(--destructive)]",
    "text-[var(--destructive-foreground)]",
    "hover:opacity-90",
    "focus:ring-[var(--destructive)]"
  ].join(" "),

  success: [
    "bg-[var(--success)]",
    "text-white",
    "hover:opacity-90",
    "focus:ring-[var(--success)]"
  ].join(" "),

  link: [
    "bg-transparent",
    "text-[var(--primary)]",
    "underline-offset-4",
    "hover:underline",
    "p-0",
    "h-auto"
  ].join(" ")
};

export const buttonSizes = {
  xs: "h-8 px-3 text-xs",

  sm: "h-9 px-4 text-sm",

  md: "h-11 px-5 text-sm",

  lg: "h-12 px-6 text-base",

  xl: "h-14 px-8 text-lg",

  icon: "h-11 w-11 p-0"
};
