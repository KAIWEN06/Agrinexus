export const cardVariants = {
  default: ["bg-[var(--card)]", "border", "border-[var(--border)]"].join(" "),

  elevated: [
    "bg-[var(--card)]",
    "border",
    "border-[var(--border)]",
    "shadow-[var(--shadow-card)]"
  ].join(" "),

  outline: ["border", "border-[var(--border)]", "bg-transparent"].join(" ")
};

export const cardPadding = {
  none: "p-0",

  sm: "p-4",

  md: "p-6",

  lg: "p-8"
};
