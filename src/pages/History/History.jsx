import useHistory from "../../hooks/useHistory";
import useHistoryFilter from "../../hooks/useHistoryFilter";

import PageHeader from "../../components/common/PageHeader";

import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";
import HistoryMobileCards from "./HistoryMobileCards";

export default function History() {
  const {
    history,
    loading,
    error,
  } = useHistory();

  const filter = useHistoryFilter(history);

  const handleExport = () => {
    console.log("Ekspor laporan");
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-[var(--text-secondary)]">
          Memuat data riwayat...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Gagal memuat data riwayat.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Riwayat & Laporan"
        description="Lihat riwayat data sensor serta buat laporan hasil monitoring kondisi lingkungan perkebunan."
      />

      <HistoryFilters
        filter={filter}
        onExport={handleExport}
      />

      <HistoryTable
        history={filter.filteredHistory}
        selectedSensors={filter.selectedSensors}
      />

      <HistoryMobileCards
        history={filter.filteredHistory}
        selectedSensors={filter.selectedSensors}
      />
    </>
  );
}