import AreaChartCard from "../AreaChartCard";

export default function TemperatureChart(props) {
  return (
    <AreaChartCard
      title="Temperature"
      unit="°C"
      color="#EF4444"
      {...props}
    />
  );
}