import AreaChartCard from "../AreaChartCard";

export default function LightChart(props) {
  return (
    <AreaChartCard
      title="Intensitas Cahaya"
      unit="Lux"
      color="#F59E0B"
      gradientId="lightGradient"
      yDomain={[0, 20000]}
      {...props}
    />
  );
}