import {
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function TableSort({
  direction,
}) {
  if (direction === "asc")
    return <ArrowUp size={14} />;

  if (direction === "desc")
    return <ArrowDown size={14} />;

  return null;
}