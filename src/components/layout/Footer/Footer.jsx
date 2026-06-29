import { APP_NAME, APP_VERSION } from "../../../config/app";

export default function Footer() {
  return (
    <footer
      className="
        flex
        items-center
        justify-between

        border-t
        border-[var(--border)]

        bg-white

        px-6
        py-4
      "
    >
      {/* Left */}
      <p
        className="
          text-sm
          text-[var(--text-secondary)]
        "
      >
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>

      {/* Right */}
      <span
        className="
          rounded-md
          bg-[var(--muted)]
          px-3
          py-1

          text-xs
          font-medium
          text-[var(--text-secondary)]
        "
      >
        v{APP_VERSION}
      </span>
    </footer>
  );
}