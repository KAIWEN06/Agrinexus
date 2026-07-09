import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "../../../utils/cn";

export default function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Pilih...",
  searchable = true,
  className,
}) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const toggleValue = (selectedValue) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedLabels = options
    .filter((item) => value.includes(item.value))
    .map((item) => item.label);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 text-sm",
            className
          )}
        >
          <span className="truncate text-left">
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>

          <ChevronDown size={18} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 w-[280px] rounded-xl border border-[var(--border)] bg-white p-3 shadow-xl"
        >
          {searchable && (
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 h-10 w-full rounded-lg border border-[var(--border)] px-3 text-sm outline-none"
            />
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((item) => {
              const checked = value.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleValue(item.value)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <span>{item.label}</span>

                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      checked
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-gray-300"
                    )}
                  >
                    {checked && <Check size={14} />}
                  </div>
                </button>
              );
            })}
          </div>

          {value.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
            >
              <X size={16} />
              Hapus Pilihan
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}