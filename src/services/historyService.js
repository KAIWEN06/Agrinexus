// src/services/historyService.js

import { historyData } from "../data/history";

const historyService = {
  /**
   * Mengambil seluruh data riwayat.
   */
  async getHistory() {
    return historyData;
  }
};

export default historyService;
