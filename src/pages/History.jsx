import { useState } from "react";
import { Download } from "lucide-react";

import useDashboard from "../hooks/useDashboard";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";

import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";

export default function History() {
  const [search, setSearch] = useState("");

  const {
    dashboard,
    loading,
    error,
  } = useDashboard();

  const { history } = dashboard;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          Loading history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        Failed to load history data.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="History"
        description="View historical sensor readings from the plantation."
      />

      {/* ==========================
          Filter
      ========================== */}

      <div className="mb-6 grid gap-4 lg:grid-cols-5">

        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search sensor..."
        />

        <Select
          placeholder="Sensor"
          options={[
            { label: "All Sensor", value: "all" },
            { label: "Temperature", value: "temperature" },
            { label: "Humidity", value: "humidity" },
            { label: "Soil Moisture", value: "soil" },
            { label: "Light", value: "light" },
          ]}
        />

        <Select
          placeholder="Status"
          options={[
            { label: "All Status", value: "all" },
            { label: "Healthy", value: "healthy" },
            { label: "Warning", value: "warning" },
            { label: "Critical", value: "critical" },
          ]}
        />

        <Select
          placeholder="Date Range"
          options={[
            { label: "Today", value: "today" },
            { label: "Last 7 Days", value: "7days" },
            { label: "Last 30 Days", value: "30days" },
          ]}
        />

        <Button startContent={<Download size={18} />}>
          Export CSV
        </Button>

      </div>

      {/* ==========================
          Table
      ========================== */}

      <Table>

        <Table.Header>

          <Table.Row>

            <Table.Head>Node</Table.Head>

            <Table.Head>Temperature</Table.Head>

            <Table.Head>Humidity</Table.Head>

            <Table.Head>Soil</Table.Head>

            <Table.Head>Light</Table.Head>

            <Table.Head>Health</Table.Head>

            <Table.Head>Status</Table.Head>

            <Table.Head>Timestamp</Table.Head>

          </Table.Row>

        </Table.Header>

        <Table.Body>

          {history.length > 0 ? (

            history.map((item) => (

              <Table.Row key={item.id}>

                <Table.Cell>{item.node}</Table.Cell>

                <Table.Cell>{item.temperature}°C</Table.Cell>

                <Table.Cell>{item.humidity}%</Table.Cell>

                <Table.Cell>{item.soil}%</Table.Cell>

                <Table.Cell>{item.light} Lux</Table.Cell>

                <Table.Cell>{item.health}</Table.Cell>

                <Table.Cell>
                  <Badge variant={item.badge}>
                    {item.status}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  {item.timestamp}
                </Table.Cell>

              </Table.Row>

            ))

          ) : (

            <Table.Row>

              <Table.Cell colSpan={8}>

                <Table.Empty
                  title="No History Data"
                  description="No sensor history is available."
                />

              </Table.Cell>

            </Table.Row>

          )}

        </Table.Body>

      </Table>
    </>
  );
}