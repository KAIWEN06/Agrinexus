import AreaChartCard from "../AreaChartCard";

export default function HumidityChart(props) {
  return (
    <AreaChartCard
      title="Kelembapan Udara"
      unit="%"
      color="#3B82F6"
      gradientId="humidityGradient"
      yDomain={[0, 100]}
      {...props}
    />
  );
}