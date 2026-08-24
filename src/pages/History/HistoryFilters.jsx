// src/pages/History/HistoryFilters.jsx
import { Download, RotateCcw, Calendar as CalendarIcon, Clock, Search } from "lucide-react";
import SearchBox from "../../components/common/SearchBox";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import MultiSelect from "../../components/ui/MultiSelect";
import Select from "../../components/ui/Select";

export default function HistoryFilters({ filter, onExport, onSearchSubmit }) {
  return (
    <Card className="mb-6 p-5">
      {/* Grid Filter Utama */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <SearchBox
          value={filter.search}
          onChange={(e) => filter.setSearch(e.target.value)}
          onClear={() => filter.setSearch("")}
          placeholder="Cari data..."
        />

        <MultiSelect
          placeholder="Node"
          value={filter.selectedNodes}
          onChange={filter.setSelectedNodes}
          options={filter.nodeOptions}
        />

        <MultiSelect
          placeholder="Tampilan Data"
          value={filter.selectedSensors}
          onChange={filter.setSelectedSensors}
          options={filter.sensorOptions}
        />

        <MultiSelect
          placeholder="Status"
          value={filter.selectedStatus}
          onChange={filter.setSelectedStatus}
          options={filter.statusOptions}
        />

        <Select
          value={filter.selectedRain}
          onValueChange={filter.setSelectedRain}
          placeholder="Status Hujan"
        >
          <Select.Item value="all">Semua</Select.Item>
          <Select.Item value="dry">Tidak Hujan</Select.Item>
          <Select.Item value="rain">Terdeteksi Hujan</Select.Item>
        </Select>

        <Select
          value={filter.timeMode}
          onValueChange={filter.setTimeMode}
          placeholder="Mode Waktu"
        >
          <Select.Item value="day">Pilih Hari / Jam</Select.Item>
          <Select.Item value="week">Pilih Minggu (Tahun-Minggu)</Select.Item>
          <Select.Item value="month">Pilih Bulan (Tahun-Bulan)</Select.Item>
          <Select.Item value="year">Pilih Tahun</Select.Item>
          <Select.Item value="all">Semua Waktu</Select.Item>
        </Select>
      </div>

      {/* Control Bar Input Dinamis Waktu */}
      {filter.timeMode !== "all" && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {filter.timeMode === "day" && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  <CalendarIcon size={16} />
                  <span>Tanggal:</span>
                </div>
                <input
                  type="date"
                  value={filter.selectedDayDate}
                  onChange={(e) => filter.setSelectedDayDate(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500"
                />

                <div className="ml-2 flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  <Clock size={16} />
                  <span>Jam (Opsional):</span>
                </div>
                <Select
                  value={filter.selectedHour}
                  onValueChange={filter.setSelectedHour}
                  placeholder="Semua Jam"
                >
                  <Select.Item value="all">Semua Jam (00:00 - 23:59)</Select.Item>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hourStr = String(i).padStart(2, "0");
                    return (
                      <Select.Item key={hourStr} value={hourStr}>
                        Jam {hourStr}:00 - {hourStr}:59
                      </Select.Item>
                    );
                  })}
                </Select>
              </div>
            )}

            {filter.timeMode === "week" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  <CalendarIcon size={16} />
                  <span>Minggu Ke-:</span>
                </div>
                <input
                  type="week"
                  value={filter.selectedWeek}
                  onChange={(e) => filter.setSelectedWeek(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {filter.timeMode === "month" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  <CalendarIcon size={16} />
                  <span>Bulan:</span>
                </div>
                <input
                  type="month"
                  value={filter.selectedMonth}
                  onChange={(e) => filter.setSelectedMonth(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {filter.timeMode === "year" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  <CalendarIcon size={16} />
                  <span>Tahun:</span>
                </div>
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  value={filter.selectedYear}
                  onChange={(e) => filter.setSelectedYear(e.target.value)}
                  className="w-32 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          startContent={<Search size={18} />}
          onClick={onSearchSubmit}
        >
          Cari
        </Button>
        <Button
          variant="outline"
          startContent={<RotateCcw size={18} />}
          onClick={filter.resetFilter}
        >
          Reset
        </Button>
        <Button
          variant="secondary"
          startContent={<Download size={18} />}
          onClick={onExport}
        >
          Ekspor
        </Button>
      </div>
    </Card>
  );
}