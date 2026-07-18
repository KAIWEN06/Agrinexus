import AreaChartCard from "../AreaChartCard";

export default function SoilMoistureChart(props) {
  return (
    <AreaChartCard
      title="Kelembapan Tanah"
      unit="ADC"
      color="#8B5E3C"
      gradientId="soilGradient"
      yDomain={[0, 100]}
      {...props}
    />
  );
}