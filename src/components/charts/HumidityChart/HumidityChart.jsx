import AreaChartCard from "../AreaChartCard";

export default function HumidityChart(props) {
  return (
    <AreaChartCard
      title="Humidity"
      unit="%"
      color="#3B82F6"
      {...props}
    />
  );
}