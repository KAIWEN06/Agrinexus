import { Activity } from "lucide-react";

import Card from "../../ui/Card";
import Progress from "../../ui/Progress";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

export default function HealthScoreCard({
  score = 0,
  status = "Unknown",
  description = "",
  className,
}) {
  const getStatusColor = () => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "danger";
  };

  return (
    <Card
      className={cn(
        "p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Health Score
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {score}
            <span className="text-xl">/100</span>
          </h2>
        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[var(--primary)]/10
            text-[var(--primary)]
          "
        >
          <Activity size={28} />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <Progress value={score} />
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Badge variant={getStatusColor()}>
          {status}
        </Badge>

        <span className="text-sm text-[var(--text-secondary)]">
          {description}
        </span>
      </div>
    </Card>
  );
}