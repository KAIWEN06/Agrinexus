// src/services/notificationService.js

import { supabase } from "./supabase";

const TABLE = "notifications";

const notificationService = {
  /**
   * Mengambil seluruh notifikasi
   * Menggunakan relasi ke node_devices via Foreign Key 'fk_notifications_node_devices'
   */
  async getNotifications(limit = null) {
    // 1. Menggunakan LEFT JOIN dengan penanda constraint FK yang eksplisit
    let query = supabase
      .from(TABLE)
      .select(`
        *,
        node_devices!fk_notifications_node_devices (
          name,
          location
        )
      `)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error.message);
      throw error;
    }

    // 2. Mapping data dengan aman (penanganan fallback data & tanggal)
    return (
      data?.map((item) => {
        const createdDate = item.created_at ? new Date(item.created_at) : null;

        return {
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.level ?? "info",
          badge: item.level ?? "info",
          unread: !item.is_read,

          // Ambil nama node & lokasi dari relasi node_devices
          node: item.node_devices?.name ?? item.node_name ?? "-",
          location: item.node_devices?.location ?? item.location ?? "-",

          // Format tanggal & waktu
          createdAt: createdDate
            ? createdDate.toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",

          time: createdDate
            ? createdDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
        };
      }) ?? []
    );
  },

  /**
   * Menandai satu notifikasi sebagai sudah dibaca
   */
  async markAsRead(id) {
    const { error } = await supabase
      .from(TABLE)
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error(`Error marking notification ${id} as read:`, error.message);
      throw error;
    }

    return true;
  },

  /**
   * Menandai semua notifikasi sebagai sudah dibaca
   */
  async markAllAsRead() {
    const { error } = await supabase
      .from(TABLE)
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error.message);
      throw error;
    }

    return true;
  },

  /**
   * Menghapus satu notifikasi
   */
  async deleteNotification(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting notification ${id}:`, error.message);
      throw error;
    }

    return true;
  },

  /**
   * Menghapus seluruh notifikasi
   */
  async clearNotifications() {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .neq("id", 0);

    if (error) {
      console.error("Error clearing notifications:", error.message);
      throw error;
    }

    return true;
  },

  /**
   * Subscribe perubahan data secara Real-time
   */
  subscribe(callback, limit = null) {
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: TABLE,
        },
        async () => {
          try {
            const notifications = await notificationService.getNotifications(limit);
            callback(notifications);
          } catch (err) {
            console.error("Error updating realtime notifications:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

export default notificationService;