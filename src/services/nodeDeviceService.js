// src/services/nodeDeviceService.js
import { supabase } from "./supabase";

const TABLE = "node_devices";

const nodeDeviceService = {
  /**
   * Mengambil semua node devices (Otomatis jalankan pengecekan timeout dulu)
   */
  async getNodes() {
    try {
      // 1. Eksekusi pengecekan timeout di database
      await supabase.rpc("check_and_update_node_timeout");
    } catch (err) {
      console.warn("Gagal mengeksekusi timeout check:", err);
    }

    // 2. Ambil data node devices yang sudah ter-update statusnya
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching nodes:", error.message);
      throw error;
    }

    return data ?? [];
  },

  /**
   * Memperbarui lokasi node
   */
  async updateLocation(id, location) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ location })
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating location for node ${id}:`, error.message);
      throw error;
    }

    return data;
  },
};

export default nodeDeviceService;