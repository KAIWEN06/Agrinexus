// src/components/common/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
      {/* Informative Label */}
      <div className="text-xs text-[var(--text-secondary)] sm:text-sm">
        Menampilkan <span className="font-semibold text-[var(--text-primary)]">{startItem}</span> -{" "}
        <span className="font-semibold text-[var(--text-primary)]">{endItem}</span> dari{" "}
        <span className="font-semibold text-[var(--text-primary)]">{totalItems}</span> data
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          startContent={<ChevronLeft size={16} />}
        >
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        <span className="px-3 text-xs font-medium sm:text-sm">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          endContent={<ChevronRight size={16} />}
        >
          <span className="hidden sm:inline">Selanjutnya</span>
        </Button>
      </div>
    </div>
  );
}