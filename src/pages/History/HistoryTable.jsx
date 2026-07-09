import Badge from "../../components/ui/Badge";
import Progress from "../../components/ui/Progress";
import Table from "../../components/ui/Table";

export default function HistoryTable({
  history,
  selectedSensors = [],
}) {
  const show = (sensor) =>
    selectedSensors.length === 0 ||
    selectedSensors.includes(sensor);

  const showSummary =
    selectedSensors.length === 0;

  const columnSpan =
    showSummary ? 9 : 7;

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">

        <Table>

          <Table.Header>

            <Table.Row>

              <Table.Head>Waktu</Table.Head>

              <Table.Head>Node</Table.Head>

              {show("temperature") && (
                <Table.Head>Suhu</Table.Head>
              )}

              {show("humidity") && (
                <Table.Head>
                  Kelembapan Udara
                </Table.Head>
              )}

              {show("soil") && (
                <Table.Head>
                  Kelembapan Tanah
                </Table.Head>
              )}

              {show("light") && (
                <Table.Head>
                  Intensitas Cahaya
                </Table.Head>
              )}

              {show("rain") && (
                <Table.Head>
                  Status Hujan
                </Table.Head>
              )}

              {showSummary && (
                <>
                  <Table.Head>
                    Skor Kesehatan
                  </Table.Head>

                  <Table.Head>
                    Status
                  </Table.Head>
                </>
              )}

            </Table.Row>

          </Table.Header>

          <Table.Body>
            {history.length > 0 ? (

  history.map((item) => (

    <Table.Row key={item.id}>

      <Table.Cell>
        {item.timestamp}
      </Table.Cell>

      <Table.Cell>

        <Badge variant="primary">
          {item.node}
        </Badge>

      </Table.Cell>

      {show("temperature") && (
        <Table.Cell>
          {item.temperature}°C
        </Table.Cell>
      )}

      {show("humidity") && (
        <Table.Cell>
          {item.humidity}%
        </Table.Cell>
      )}

      {show("soil") && (
        <Table.Cell>
          {item.soil}%
        </Table.Cell>
      )}

      {show("light") && (
        <Table.Cell>
          {item.light.toLocaleString()} lux
        </Table.Cell>
      )}

      {show("rain") && (
        <Table.Cell>

          <Badge
            variant={
              item.rainStatus === "Terdeteksi Hujan"
                ? "info"
                : "default"
            }
          >
            {item.rainStatus ?? "Tidak Hujan"}
          </Badge>

        </Table.Cell>
      )}

      {showSummary && (

        <>

          <Table.Cell>

            <div className="flex min-w-[130px] items-center gap-3">

              <Progress
                value={item.health}
                className="flex-1"
              />

              <span className="text-sm font-medium">
                {item.health}
              </span>

            </div>

          </Table.Cell>

          <Table.Cell>

            <Badge variant={item.badge}>
              {item.status}
            </Badge>

          </Table.Cell>

        </>

      )}

    </Table.Row>

  ))

) : (
                <Table.Row>

                <Table.Cell colSpan={columnSpan}>

                  <Table.Empty
                    title="Belum Ada Data Riwayat"
                    description="Belum terdapat data hasil monitoring untuk ditampilkan."
                  />

                </Table.Cell>

              </Table.Row>

            )}

          </Table.Body>

        </Table>

      </div>
    </div>
  );
}