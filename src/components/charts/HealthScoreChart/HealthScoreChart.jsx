import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import { cn } from "../../../utils/cn";

export default function HealthScoreChart({
  score = 0,
  className,
}) {
  const data = [
    {
      name: "Skor Kesehatan",
      value: score,
      fill: "#2E7D32",
    },
  ];

  const getStatus = () => {
    if (score >= 85)
      return {
        text: "Sehat",
        variant: "success",
      };

    if (score >= 70)
      return {
        text: "Baik",
        variant: "warning",
      };

    return {
      text: "Kritis",
      variant: "danger",
    };
  };

  const status = getStatus();

  return (
    <Card
      className={cn(
        "p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Skor Kesehatan
        </h2>

        <p className="text-sm text-[var(--text-secondary)]">
          Kondisi Keseluruhan Perkebunan
        </p>
      </div>

      {/* Grafik */}
      <div className="relative h-72">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RadialBarChart
            innerRadius="75%"
            outerRadius="100%"
            barSize={18}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            <RadialBar
              background
              clockWise
              dataKey="value"
              cornerRadius={12}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <h1 className="text-5xl font-bold">
            {score}
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            /100
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-center">
        <Badge variant={status.variant}>
          {status.text}
        </Badge>
      </div>
    </Card>
  );
}