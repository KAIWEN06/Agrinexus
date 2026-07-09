// src/services/dashboardService.js

import dashboard from "../data/dashboard";

const dashboardService = {
  /**
   * Mengambil seluruh data dashboard.
   */
  async getDashboard() {
    return dashboard;
  }
};

export default dashboardService;
