// src/services/notificationService.js

import { supabase } from "./supabase";

const TABLE = "notifications";

const notificationService = {
  /**
   * Mengambil seluruh notifikasi
   */
  async getNotifications(limit = null) {
    let query = supabase
      .from(TABLE)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (
      data?.map((item) => ({
        id: item.id,

        title: item.title,

        message: item.message,

        type: item.level ?? "info",

        badge: item.level ?? "info",

        unread: !item.is_read,

        node: item.node_name ?? "-",

        location: item.location ?? "-",

        createdAt: new Date(
          item.created_at
        ).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),

        time: new Date(
          item.created_at
        ).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })) ?? []
    );
  },

  /**
   * Menandai satu notifikasi sebagai sudah dibaca
   */
  async markAsRead(id) {
    const { error } = await supabase
      .from(TABLE)
      .update({
        is_read: true,
      })
      .eq("id", id);

    if (error) {
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
      .update({
        is_read: true,
      })
      .eq("is_read", false);

    if (error) {
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
      throw error;
    }

    return true;
  },

  /**
   * Subscribe realtime
   */
  subscribe(callback) {
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
          const notifications =
            await this.getNotifications();

          callback(notifications);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

export default notificationService;