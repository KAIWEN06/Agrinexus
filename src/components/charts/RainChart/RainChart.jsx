import AreaChartCard from "../AreaChartCard";

const formatRain = (value) =>
  value === 1 ? "Hujan" : "Tidak Hujan";

export default function RainChart(props) {
  return (
    <AreaChartCard
      title="Riwayat Hujan"
      color="var(--primary)"
      dataKey="rain"
      gradientId="rainGradient"
      chartType="stepAfter"
      yDomain={[0, 1]}
      tooltipFormatter={(value) => [formatRain(value), "Status"]}
      tooltipLabelFormatter={(label) => `Waktu : ${label}`}
      yAxisProps={{
        ticks: [0, 1],
        tickFormatter: formatRain,
      }}
      {...props}
    />
  );
}