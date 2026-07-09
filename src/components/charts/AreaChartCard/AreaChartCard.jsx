import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Card from "../../ui/Card";

export default function AreaChartCard({
  title,
  unit,
  color = "#16A34A",
  data = [],
  dataKey = "value",
  chartType = "monotone",
  gradientId,
  yDomain,
  tooltipFormatter,
  tooltipLabelFormatter,
  yAxisProps = {},
}) {

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Riwayat 24 Jam Terakhir
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={color}
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor={color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              {...yAxisProps}
            />

            <Tooltip
              formatter={
                tooltipFormatter ??
                ((value) => [`${value} ${unit}`, title])
              }
              labelFormatter={tooltipLabelFormatter}
            />

            <Area
              type={chartType}
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}