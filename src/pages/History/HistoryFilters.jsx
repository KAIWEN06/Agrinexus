import {
  Download,
  RotateCcw,
} from "lucide-react";

import SearchBox from "../../components/common/SearchBox";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import MultiSelect from "../../components/ui/MultiSelect";
import Select from "../../components/ui/Select";

export default function HistoryFilters({
  filter,
  onExport,
}) {
  return (
    <Card className="mb-6 p-5">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

        {/* =====================================
            Search
        ===================================== */}

        <SearchBox
          value={filter.search}
          onChange={(e) =>
            filter.setSearch(e.target.value)
          }
          onClear={() =>
            filter.setSearch("")
          }
          placeholder="Cari data..."
        />

        {/* =====================================
            Node
        ===================================== */}

        <MultiSelect
          placeholder="Node"
          value={filter.selectedNodes}
          onChange={filter.setSelectedNodes}
          options={filter.nodeOptions}
        />

        {/* =====================================
            Tampilan Data
        ===================================== */}

        <MultiSelect
          placeholder="Tampilan Data"
          value={filter.selectedSensors}
          onChange={filter.setSelectedSensors}
          options={filter.sensorOptions}
        />

        {/* =====================================
            Status
        ===================================== */}

        <MultiSelect
          placeholder="Status"
          value={filter.selectedStatus}
          onChange={filter.setSelectedStatus}
          options={filter.statusOptions}
        />

        {/* =====================================
            Status Hujan
        ===================================== */}

        <Select
          value={filter.selectedRain}
          onValueChange={filter.setSelectedRain}
          placeholder="Status Hujan"
        >
          <Select.Item value="all">
            Semua
          </Select.Item>

          <Select.Item value="dry">
            Tidak Hujan
          </Select.Item>

          <Select.Item value="rain">
            Terdeteksi Hujan
          </Select.Item>
        </Select>

        {/* =====================================
            Rentang Tanggal
        ===================================== */}

        <Select
          value={filter.selectedDate}
          onValueChange={filter.setSelectedDate}
          placeholder="Rentang Tanggal"
        >
          <Select.Item value="all">
            Semua
          </Select.Item>

          <Select.Item value="today">
            Hari Ini
          </Select.Item>

          <Select.Item value="7days">
            7 Hari Terakhir
          </Select.Item>

          <Select.Item value="30days">
            30 Hari Terakhir
          </Select.Item>
        </Select>

      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

        <Button
          variant="outline"
          startContent={
            <RotateCcw size={18} />
          }
          onClick={filter.resetFilter}
        >
          Reset
        </Button>

        <Button
          startContent={
            <Download size={18} />
          }
          onClick={onExport}
        >
          Ekspor
        </Button>

      </div>

    </Card>
  );
}