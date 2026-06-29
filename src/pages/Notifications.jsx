import { useMemo, useState } from "react";
import {
  CheckCheck,
  Trash2,
  Check,
} from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";

import NotificationCard from "../components/cards/NotificationCard";

import { notifications } from "../data/notifications";

export default function Notifications() {

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [selected, setSelected] = useState(
    notifications[0] ?? null
  );

  const filteredNotifications = useMemo(() => {

    return notifications.filter((item) => {

      const keyword =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.message
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.node
          .toLowerCase()
          .includes(search.toLowerCase());

      const status =
        filter === "all"
          ? true
          : item.status.toLowerCase() === filter.toLowerCase();

      return keyword && status;

    });

  }, [search, filter]);

  return (

    <>

      <PageHeader
        title="Notifications"
        description="Monitor every important event from your plantation."
        action={

          <Button
            startContent={<CheckCheck size={18} />}
          >
            Mark All Read
          </Button>

        }
      />

      <div className="mb-8 grid gap-4 lg:grid-cols-2">

        <SearchBox
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onClear={() => setSearch("")}
          placeholder="Search notification..."
        />

        <Select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          options={[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Belum Dibaca",
              value: "belum dibaca",
            },
            {
              label: "Sudah Dibaca",
              value: "sudah dibaca",
            },
          ]}
        />

      </div>

      {/* ===========================
          Master Detail Layout
      =========================== */}

      <div className="grid gap-6 xl:grid-cols-5">
        {/* ======================================
          Notification List
      ====================================== */}

      <div className="space-y-4 xl:col-span-2">

        {filteredNotifications.length > 0 ? (

          filteredNotifications.map((notification) => (

            <div
              key={notification.id}
              onClick={() => setSelected(notification)}
              className="cursor-pointer"
            >
              <NotificationCard
                {...notification}
                className={
                  selected?.id === notification.id
                    ? "ring-2 ring-[var(--primary)]"
                    : ""
                }
              />
            </div>

          ))

        ) : (

          <Card className="flex h-60 items-center justify-center">

            <div className="text-center">

              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Tidak ada notifikasi
              </h3>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Tidak ditemukan notifikasi yang sesuai.
              </p>

            </div>

          </Card>

        )}

      </div>
            {/* ======================================
          Notification Detail
      ====================================== */}

      <div className="xl:col-span-3">

        {selected ? (

          <Card className="h-full p-8">

            {/* Header */}

            <div className="flex items-start justify-between gap-6">

              <div>

                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  {selected.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-3">

                  <Badge variant={selected.badge}>
                    {selected.type}
                  </Badge>

                  <Badge
                    variant={
                      selected.status === "Belum Dibaca"
                        ? "warning"
                        : "success"
                    }
                  >
                    {selected.status}
                  </Badge>

                </div>

              </div>

            </div>

            {/* Information */}

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Node
                </p>

                <p className="mt-2 font-semibold">
                  {selected.node}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Location
                </p>

                <p className="mt-2 font-semibold">
                  {selected.location}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Time
                </p>

                <p className="mt-2">
                  {selected.time}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Created At
                </p>

                <p className="mt-2">
                  {selected.createdAt}
                </p>

              </div>

            </div>

            {/* Divider */}

            <div className="my-8 border-t border-[var(--border)]" />

            {/* Message */}

            <div>

              <h3 className="text-lg font-semibold">
                Description
              </h3>

              <p className="mt-4 leading-8 text-[var(--text-secondary)]">
                {selected.message}
              </p>

            </div>

            {/* Action */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                startContent={<Check size={18} />}
              >
                Mark as Read
              </Button>

              <Button
                variant="outline"
                startContent={<Trash2 size={18} />}
              >
                Delete
              </Button>

            </div>

          </Card>

        ) : (

          <Card className="flex h-full min-h-[500px] items-center justify-center">

            <div className="text-center">

              <h3 className="text-xl font-semibold">
                No Notification Selected
              </h3>

              <p className="mt-2 text-[var(--text-secondary)]">
                Select a notification to view its details.
              </p>

            </div>

          </Card>

        )}

      </div>

    </div>

    </>
  );
}