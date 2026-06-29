import { Search, X } from "lucide-react";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { cn } from "../../../utils/cn";

export default function SearchBox({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className,
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startContent={<Search size={18} />}
        endContent={
          value ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-7 w-7"
            >
              <X size={16} />
            </Button>
          ) : null
        }
      />
    </div>
  );
}