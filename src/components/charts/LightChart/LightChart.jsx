import AreaChartCard from "../AreaChartCard";

export default function LightChart(props) {
  return (
    <AreaChartCard
      title="Light Intensity"
      unit="Lux"
      color="#F59E0B"
      {...props}
    />
  );
}