import AreaChartCard from "../AreaChartCard";

export default function TemperatureChart(props) {
  return (
    <AreaChartCard
      title="Suhu"
      unit="°C"
      color="#EF4444"
      gradientId="temperatureGradient"
      yDomain={[0, 40]}
      {...props}
    />
  );
}