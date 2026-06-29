import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { forwardRef } from "react";

import { cn } from "../../../utils/cn";
import { selectSizes } from "../../../constants/ui/select";

const Select = ({
  value,
  onValueChange,
  placeholder = "Pilih...",
  size = "md",
  children,
}) => {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "flex w-full items-center justify-between",

          "rounded-[var(--radius-input)]",

          "border border-[var(--border)]",

          "bg-[var(--background)]",

          "px-4",

          "text-sm",

          "focus:outline-none",

          "focus:ring-2",

          "focus:ring-[var(--primary)]",

          selectSizes[size]
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
        />

        <SelectPrimitive.Icon>
          <ChevronDown size={18} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>

        <SelectPrimitive.Content
          className="
          z-50
          overflow-hidden
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-lg
          "
        >

          <SelectPrimitive.ScrollUpButton
            className="flex justify-center py-2"
          >
            <ChevronUp size={18}/>
          </SelectPrimitive.ScrollUpButton>

          <SelectPrimitive.Viewport>

            {children}

          </SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton
            className="flex justify-center py-2"
          >
            <ChevronDown size={18}/>
          </SelectPrimitive.ScrollDownButton>

        </SelectPrimitive.Content>

      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

const Item = forwardRef(
  (
    {
      children,
      value,
    },
    ref
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className="
      relative
      flex
      cursor-pointer
      items-center
      px-4
      py-2
      text-sm

      hover:bg-[var(--muted)]

      focus:bg-[var(--muted)]

      outline-none
      "
    >
      <SelectPrimitive.ItemText>

        {children}

      </SelectPrimitive.ItemText>

      <span
        className="
        absolute
        right-3
        "
      >
        <SelectPrimitive.ItemIndicator>

          <Check size={16}/>

        </SelectPrimitive.ItemIndicator>
      </span>

    </SelectPrimitive.Item>
  )
);

Item.displayName = "SelectItem";

Select.Item = Item;

export default Select;