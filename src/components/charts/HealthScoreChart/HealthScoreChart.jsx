import { Activity, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";

import Card from "../../ui/Card";
import Progress from "../../ui/Progress";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

export default function HealthScoreCard({
  score = 0,
  status = "Tidak Diketahui",
  description = "",
  insights = [],
  className,
}) {
  const getStatusColor = () => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Indeks Kesehatan Kebun
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[var(--foreground)]">
            {score}
            <span className="text-xl text-[var(--text-secondary)]">/100</span>
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

      {/* Progress & Badge Status */}
      <div className="mt-4">
        <Progress value={score} />
        <div className="mt-3 flex items-center justify-between">
          <Badge variant={getStatusColor()}>{status}</Badge>
          {description && (
            <span className="text-xs text-[var(--text-secondary)]">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Bagian Catatan & Solusi untuk Petani */}
      <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Panduan & Tindakan Petani:</span>
        </div>

        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg p-3 text-xs sm:text-sm",
                  item.type === "warning"
                    ? "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                    : item.type === "success"
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                )}
              >
                <div className="flex items-start gap-2">
                  {item.type === "warning" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  ) : item.type === "success" ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  )}

                  <div className="flex-1">
                    <p className="font-semibold">
                      {item.parameter}: <span className="font-normal">{item.issue}</span>
                    </p>
                    <p className="mt-1 font-medium underline underline-offset-2">
                      Solusi: {item.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">
              Tidak ada rekomendasi khusus saat ini.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}