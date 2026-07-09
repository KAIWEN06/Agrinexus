import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Progress from "../../components/ui/Progress";

export default function HistoryMobileCards({
  history,
  selectedSensors = [],
}) {
  const showAll = selectedSensors.length === 0;

  const show = (sensor) =>
    showAll || selectedSensors.includes(sensor);

  const showHealth = showAll;

  return (
    <div className="space-y-4 lg:hidden">
      {history.length > 0 ? (
        history.map((item) => (
          <Card
            key={item.id}
            className="p-5"
          >
            {/* ===============================
                Header
            =============================== */}

            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant="primary">
                  {item.node}
                </Badge>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {item.timestamp}
                </p>
              </div>

              <Badge variant={item.badge}>
                {item.status}
              </Badge>
            </div>

            {/* ===============================
                Data Sensor
            =============================== */}

            <div className="grid grid-cols-2 gap-4">

              {show("temperature") && (
                <InfoItem
                  label="Suhu"
                  value={`${item.temperature}°C`}
                />
              )}

              {show("humidity") && (
                <InfoItem
                  label="Kelembapan Udara"
                  value={`${item.humidity}%`}
                />
              )}

              {show("soil") && (
                <InfoItem
                  label="Kelembapan Tanah"
                  value={`${item.soil}%`}
                />
              )}

              {show("light") && (
                <InfoItem
                  label="Intensitas Cahaya"
                  value={`${item.light.toLocaleString()} lux`}
                />
              )}

            </div>

            {/* ===============================
                Status Hujan
            =============================== */}

            {show("rain") && (
              <div className="mt-5">
                <p className="mb-2 text-sm text-[var(--text-secondary)]">
                  Status Hujan
                </p>

                <Badge
                  variant={
                    item.rainStatus === "Terdeteksi Hujan"
                      ? "info"
                      : "default"
                  }
                >
                  {item.rainStatus ?? "Tidak Hujan"}
                </Badge>
              </div>
            )}

            {/* ===============================
                Skor Kesehatan
            =============================== */}

            {showHealth && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Skor Kesehatan
                  </span>

                  <span className="font-semibold">
                    {item.health}
                  </span>
                </div>

                <Progress value={item.health} />
              </div>
            )}
          </Card>
        ))
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Belum Ada Data Riwayat
            </h3>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Belum terdapat data hasil monitoring
              untuk ditampilkan.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

/* =======================================================
    COMPONENT
======================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-[var(--text-secondary)]">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}