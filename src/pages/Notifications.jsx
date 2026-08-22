import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check, CheckCheck, Trash2, AlertTriangle, Info, ShieldAlert } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import NotificationCard from "../components/cards/NotificationCard";
import { useNotification } from "../contexts/NotificationContext";

export default function Notifications() {
  const notificationTypeLabel = {
    warning: "Peringatan",
    critical: "Kritis",
    danger: "Bahaya",
    info: "Informasi",
  };

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useNotification();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1280);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (notifications.length > 0 && selectedId === null) {
      setSelectedId(notifications[0].id);
    }
    if (notifications.length === 0) {
      setSelectedId(null);
      setShowDetail(false);
    }
  }, [notifications, selectedId]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const keyword =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.message ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (item.node ?? "").toLowerCase().includes(search.toLowerCase());

      const status =
        filter === "all"
          ? true
          : filter === "belum dibaca"
          ? item.unread
          : !item.unread;

      return keyword && status;
    });
  }, [notifications, search, filter]);

  const selected = useMemo(() => {
    return notifications.find((item) => item.id === selectedId) ?? null;
  }, [notifications, selectedId]);

  // Helper untuk memecah pesan terstruktur (Akibat & Solusi)
  const renderFormattedMessage = (messageText) => {
    if (!messageText) return null;
    const lines = messageText.split("\n").filter(Boolean);

    return (
      <div className="space-y-4 text-sm leading-relaxed text-[var(--foreground)]">
        {lines.map((line, idx) => {
          if (line.startsWith("• Akibat:")) {
            return (
              <div key={idx} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <AlertTriangle size={16} />
                  <span>Dampak & Akibat</span>
                </div>
                <p className="text-xs sm:text-sm pl-6">{line.replace("• Akibat:", "").trim()}</p>
              </div>
            );
          }
          if (line.startsWith("• Solusi:")) {
            return (
              <div key={idx} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Info size={16} />
                  <span>Rekomendasi Tindakan</span>
                </div>
                <p className="text-xs sm:text-sm pl-6">{line.replace("• Solusi:", "").trim()}</p>
              </div>
            );
          }
          return <p key={idx} className="font-medium text-[var(--text-secondary)]">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Notifikasi Sistem"
        description="Pantau peringatan terstruktur, analisa dampak, dan rekomendasi solusi kebun secara real-time."
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button startContent={<CheckCheck size={18} />} onClick={markAllAsRead} className="w-full sm:w-auto">
              Tandai Semua Dibaca
            </Button>
            <Button
              variant="outline"
              startContent={<Trash2 size={18} />}
              className="w-full sm:w-auto"
              onClick={() => {
                clearNotifications();
                setSelectedId(null);
                setShowDetail(false);
              }}
            >
              Hapus Semua
            </Button>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SearchBox value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Cari notifikasi..." />
        <Select value={filter} onValueChange={setFilter} placeholder="Status Notifikasi">
          <Select.Item value="all">Semua Notifikasi</Select.Item>
          <Select.Item value="belum dibaca">Belum Dibaca</Select.Item>
          <Select.Item value="sudah dibaca">Sudah Dibaca</Select.Item>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* LIST NOTIFIKASI */}
        <div className="space-y-4 py-2 xl:col-span-2 xl:h-[calc(100dvh-180px)] xl:overflow-y-auto xl:pr-3 scrollbar-hide">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedId(notification.id);
                  if (isMobile) setShowDetail(true);
                  if (notification.unread) markAsRead(notification.id);
                }}
              >
                <NotificationCard
                  {...notification}
                  className={selectedId === notification.id ? "ring-2 ring-[var(--primary)]" : ""}
                />
              </div>
            ))
          ) : (
            <Card className="flex h-60 items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Tidak Ada Notifikasi</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Sistem berjalan normal tanpa kendala.</p>
              </div>
            </Card>
          )}
        </div>

        {/* DETAIL NOTIFIKASI DESKTOP */}
        <div className="hidden xl:block xl:col-span-3">
          {selected ? (
            <Card className="h-full p-6 lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-xl font-bold text-[var(--foreground)] sm:text-2xl">{selected.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant={selected.badge}>{notificationTypeLabel[selected.type] ?? selected.type}</Badge>
                    <Badge variant={selected.unread ? "warning" : "success"}>{selected.unread ? "Belum Dibaca" : "Sudah Dibaca"}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
                <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Node Perangkat</span><span className="font-semibold">{selected.node}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Lokasi Kebun</span><span className="font-semibold">{selected.location}</span></div>
                <div className="flex justify-between"><span className="text-sm text-[var(--text-secondary)]">Waktu Peringatan</span><span>{selected.time} ({selected.createdAt})</span></div>
              </div>

              <div className="my-6 border-t border-[var(--border)]" />

              <div>
                <h3 className="text-lg font-semibold mb-4">Informasi & Detail Analisis</h3>
                {renderFormattedMessage(selected.message)}
              </div>

              <div className="mt-8 flex gap-3">
                <Button className="w-full sm:w-auto" startContent={<Check size={18} />} onClick={() => markAsRead(selected.id)} disabled={!selected.unread}>
                  Tandai Dibaca
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  startContent={<Trash2 size={18} />}
                  onClick={() => {
                    const currentId = selected.id;
                    removeNotification(currentId);
                    const remaining = notifications.filter((item) => item.id !== currentId);
                    setSelectedId(remaining.length > 0 ? remaining[0].id : null);
                  }}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="flex min-h-[500px] items-center justify-center p-6 text-center">
              <div>
                <ShieldAlert className="mx-auto mb-3 h-12 w-12 text-[var(--text-secondary)]" />
                <h3 className="text-xl font-semibold">Pilih Notifikasi</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Klik salah satu riwayat notifikasi di sisi kiri untuk melihat detail analisa.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* BOTTOM SHEET MOBILE */}
      {isMobile && showDetail && selected && createPortal(
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-[var(--background)] p-6 shadow-2xl">
            <Button variant="outline" startContent={<ArrowLeft size={18} />} onClick={() => setShowDetail(false)}>
              Kembali
            </Button>
            <h2 className="mt-4 text-xl font-bold">{selected.title}</h2>
            <div className="mt-6 space-y-4">
              {renderFormattedMessage(selected.message)}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}