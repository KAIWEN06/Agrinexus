export const notifications = [
  {
    id: 1,
    title: "Kelembapan Tanah Rendah",
    message:
      "Kelembapan tanah berada di bawah batas normal. Segera lakukan penyiraman pada area yang terdampak.",
    type: "warning",
    status: "Belum Dibaca",
    badge: "warning",
    node: "Node-01",
    location: "Blok A",
    time: "2 menit yang lalu",
    createdAt: "2026-06-29T08:15:00"
  },

  {
    id: 2,
    title: "Suhu Lingkungan Tinggi",
    message:
      "Suhu udara melebihi ambang batas normal sehingga berpotensi menyebabkan stres pada tanaman.",
    type: "danger",
    status: "Belum Dibaca",
    badge: "danger",
    node: "Node-02",
    location: "Blok B",
    time: "15 menit yang lalu",
    createdAt: "2026-06-29T08:02:00"
  },

  {
    id: 3,
    title: "Intensitas Cahaya Normal",
    message:
      "Intensitas cahaya berada pada rentang yang ideal untuk pertumbuhan tanaman.",
    type: "success",
    status: "Sudah Dibaca",
    badge: "success",
    node: "Node-03",
    location: "Blok C",
    time: "45 menit yang lalu",
    createdAt: "2026-06-29T07:30:00"
  },

  {
    id: 4,
    title: "Health Score Menurun",
    message:
      "Nilai Health Score perkebunan turun menjadi 72/100. Disarankan melakukan pemeriksaan kondisi lingkungan.",
    type: "warning",
    status: "Belum Dibaca",
    badge: "warning",
    node: "Semua Node",
    location: "Perkebunan",
    time: "1 jam yang lalu",
    createdAt: "2026-06-29T07:00:00"
  },

  {
    id: 5,
    title: "Node Berhasil Terhubung",
    message:
      "Node-01 berhasil terhubung kembali ke gateway dan mengirimkan data sensor secara normal.",
    type: "info",
    status: "Sudah Dibaca",
    badge: "info",
    node: "Node-01",
    location: "Blok A",
    time: "2 jam yang lalu",
    createdAt: "2026-06-29T06:10:00"
  },

  {
    id: 6,
    title: "Seluruh Sensor Beroperasi Normal",
    message:
      "Semua sensor aktif dan mengirimkan data tanpa kendala selama 24 jam terakhir.",
    type: "success",
    status: "Sudah Dibaca",
    badge: "success",
    node: "Semua Node",
    location: "Perkebunan",
    time: "Kemarin",
    createdAt: "2026-06-28T16:45:00"
  }
];
