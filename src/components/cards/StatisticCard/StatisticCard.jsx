import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

export default function StatisticCard({
  title,
  value,
  unit = "",
  icon: Icon,
  status,
  trend = 0,
  trendLabel = "",
  className,
}) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  const renderTrend = () => {
    if (isPositive) {
      return (
        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <ArrowUpRight size={16} shrink-0="true" />
          <span>+{trend}%</span>
        </div>
      );
    }

    if (isNegative) {
      return (
        <div className="flex items-center gap-1 text-sm font-medium text-red-500">
          <ArrowDownRight size={16} shrink-0="true" />
          <span>{trend}%</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
        <Minus size={16} shrink-0="true" />
        <span>0%</span>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            {value}
            <span className="ml-1 text-lg font-medium">{unit}</span>
          </h2>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-[var(--primary)]/10
            text-[var(--primary)]
            transition-transform
            duration-200
            hover:scale-105
          "
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Badge>{status}</Badge>

        <div
          title={trendLabel || undefined}
          aria-label={trendLabel || undefined}
          className="flex items-center whitespace-nowrap"
        >
          {renderTrend()}
        </div>
      </div>
    </Card>
  );
}