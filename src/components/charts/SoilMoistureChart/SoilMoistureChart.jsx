import AreaChartCard from "../AreaChartCard";

export default function SoilMoistureChart(props) {
  return (
    <AreaChartCard
      title="Soil Moisture"
      unit="%"
      color="#8B5E3C"
      {...props}
    />
  );
}