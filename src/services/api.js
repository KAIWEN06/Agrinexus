// src/services/api.js

const api = {
  async get(url) {
    throw new Error(
      `GET ${url} belum diimplementasikan. Backend belum terhubung.`
    );
  },

  async post(url, data) {
    throw new Error(
      `POST ${url} belum diimplementasikan. Backend belum terhubung.`
    );
  },

  async put(url, data) {
    throw new Error(
      `PUT ${url} belum diimplementasikan. Backend belum terhubung.`
    );
  },

  async delete(url) {
    throw new Error(
      `DELETE ${url} belum diimplementasikan. Backend belum terhubung.`
    );
  }
};

export default api;
