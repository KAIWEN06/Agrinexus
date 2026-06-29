import { cn } from "../../../utils/cn";

export default function PageHeader({
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      {/* Left */}
      <div>
        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-[var(--foreground)]
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-[var(--text-secondary)]
            "
          >
            {description}
          </p>
        )}
      </div>

      {/* Right Action */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}