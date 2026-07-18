import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import useNotificationRules from "../hooks/useNotificationRules";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";

import NotificationRuleForm from "../components/notifications/NotificationRuleForm";
import NotificationRuleTable from "../components/notifications/NotificationRuleTable";
import NotificationRuleCard from "../components/notifications/NotificationRuleCard";

const PRIORITY_OPTIONS = [
  {
    label: "Semua Prioritas",
    value: "all",
  },
  {
    label: "Informasi",
    value: "info",
  },
  {
    label: "Peringatan",
    value: "warning",
  },
  {
    label: "Kritis",
    value: "critical",
  },
];

const STATUS_OPTIONS = [
  {
    label: "Semua Status",
    value: "all",
  },
  {
    label: "Aktif",
    value: "active",
  },
  {
    label: "Nonaktif",
    value: "inactive",
  },
];

export default function NotificationRules() {
  const {
    rules,
    loading,
    error,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    duplicateRule,
  } = useNotificationRules();

  const [search, setSearch] = useState("");

  const [priority, setPriority] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [openForm, setOpenForm] =
    useState(false);

  const [selectedRule, setSelectedRule] =
    useState(null);

  /*
   * Tambah
   */

  const handleCreate = () => {
    setSelectedRule(null);
    setOpenForm(true);
  };

  /*
   * Edit
   */

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setOpenForm(true);
  };

  /*
   * Simpan
   */

  const handleSubmit = async (data) => {
    try {
      if (selectedRule) {
        await updateRule(
          selectedRule.id,
          data
        );
      } else {
        await createRule(data);
      }

      setOpenForm(false);
      setSelectedRule(null);
    } catch (err) {
      console.error(err);
    }
  };

  /*
   * Hapus
   */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus aturan ini?"
    );

    if (!confirmed) return;

    await deleteRule(id);
  };

  /*
   * Filter
   */

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchSearch =
        search === "" ||
        rule.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchPriority =
        priority === "all" ||
        rule.priority === priority;

      const matchStatus =
        status === "all" ||
        (status === "active"
          ? rule.enabled
          : !rule.enabled);

      return (
        matchSearch &&
        matchPriority &&
        matchStatus
      );
    });
  }, [
    rules,
    search,
    priority,
    status,
  ]);
    return (
    <>
      <PageHeader
        title="Aturan Notifikasi"
        description="Kelola aturan yang digunakan sistem untuk menghasilkan notifikasi secara otomatis."
        action={
          <Button
            startContent={<Plus size={18} />}
            onClick={handleCreate}
          >
            Tambah Aturan
          </Button>
        }
      />

      {/* =======================================
          Filter
      ======================================= */}

      <Card className="mb-6 p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <SearchBox
            value={search}
            placeholder="Cari nama aturan..."
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onClear={() => setSearch("")}
          />

          <Select
            label="Prioritas"
            value={priority}
            options={PRIORITY_OPTIONS}
            onValueChange={setPriority}
          />

          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onValueChange={setStatus}
          />
        </div>
      </Card>

      {/* =======================================
          Error
      ======================================= */}

      {error && (
        <Card className="mb-6 border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </Card>
      )}

      {/* =======================================
          Desktop
      ======================================= */}

      <div className="hidden lg:block">
        <NotificationRuleTable
          rules={filteredRules}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={toggleRule}
          onDuplicate={duplicateRule}
        />
      </div>

      {/* =======================================
          Mobile
      ======================================= */}

        <div className="space-y-4 lg:hidden">
        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Memuat aturan notifikasi...
              </p>
            </div>
          </Card>
        ) : filteredRules.length > 0 ? (
          filteredRules.map((rule) => (
            <NotificationRuleCard
              key={rule.id}
              rule={rule}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={toggleRule}
              onDuplicate={duplicateRule}
            />
          ))
        ) : (
          <Card className="p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-[var(--muted)] p-4">
                <Plus
                  size={28}
                  className="text-[var(--text-secondary)]"
                />
              </div>

              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Belum Ada Aturan Notifikasi
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                Tambahkan aturan notifikasi pertama agar sistem
                dapat menghasilkan notifikasi otomatis sesuai
                kondisi yang ditentukan.
              </p>

              <Button
                className="mt-6"
                startContent={<Plus size={18} />}
                onClick={handleCreate}
              >
                Tambah Aturan
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* =======================================
          Modal Form
      ======================================= */}

      <Modal
        open={openForm}
        onOpenChange={setOpenForm}
      >
        <NotificationRuleForm
          initialData={selectedRule}
          onSubmit={handleSubmit}
          onCancel={() => {
            setOpenForm(false);
            setSelectedRule(null);
          }}
        />
      </Modal>
    </>
  );
}