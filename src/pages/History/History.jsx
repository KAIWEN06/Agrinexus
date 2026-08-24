// src/pages/History/History.jsx
import { useState, useMemo } from "react";
import useHistory from "../../hooks/useHistory";
import useHistoryFilter from "../../hooks/useHistoryFilter";
import { exportHistoryToPDF } from "../../services/pdfExportService";

import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";

import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";
import HistoryMobileCards from "./HistoryMobileCards";

export default function History() {
  const { history, loading, error } = useHistory();
  const filter = useHistoryFilter(history);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Data Hasil Filter (Seluruh data yang lolos filter, bukan cuma 10 per halaman)
  const filteredData = filter.filteredHistory || [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
  };

  // Ekspor seluruh data terfilter ke PDF
  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    exportHistoryToPDF(filteredData, filter);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-[var(--text-secondary)]">Memuat data riwayat...</p>
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
        onSearchSubmit={handleSearchSubmit}
      />

      <HistoryTable
        history={paginatedHistory}
        selectedSensors={filter.selectedSensors}
      />

      <HistoryMobileCards
        history={paginatedHistory}
        selectedSensors={filter.selectedSensors}
      />

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}