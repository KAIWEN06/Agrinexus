// src/services/settingsService.js

const settings = {
  refreshInterval: 5,
  language: "id",
  timezone: "Asia/Makassar"
};

const settingsService = {
  async getSettings() {
    return settings;
  },

  async saveSettings(data) {
    Object.assign(settings, data);

    return settings;
  }
};

export default settingsService;
