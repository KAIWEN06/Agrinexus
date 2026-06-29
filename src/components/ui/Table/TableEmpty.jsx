import { Database } from "lucide-react";

export default function TableEmpty({
  title = "No Data",
  description = "There is no data available.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <Database
        size={52}
        className="text-slate-300"
      />

      <h3 className="mt-4 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}