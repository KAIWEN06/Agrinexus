// utils/notificationTemplates.js

/**
 * Helper untuk menghasilkan title, message (penjelasan + rekomendasi), dan level notifikasi
 * Level yang valid: 'info', 'warning', 'danger', 'critical'
 */
export const NOTIFICATION_TEMPLATES = {
  // 1. SENSOR CAHAYA (LIGHT)
  light: {
    low: (val, limit, duration) => ({
      title: "Intensitas Cahaya Rendah",
      level: "warning",
      message: `Intensitas cahaya terdeteksi ${val} Lux (di bawah batas ideal ${limit} Lux) selama ${duration} menit. Kondisi ini dapat menghambat fotosintesis dan memicu kelembapan tinggi pada tanaman. Rekomendasi: Lakukan pemangkasan pohon pelindung di sekitar area node agar sinar matahari dapat masuk secara optimal.`
    }),
    high: (val, limit, duration) => ({
      title: "Intensitas Cahaya Terlalu Tinggi",
      level: "warning",
      message: `Intensitas cahaya mencapai ${val} Lux (melebihi batas ideal ${limit} Lux) selama ${duration} menit. Paparan terik berlebih berisiko menyebabkan daun terbakar dan dehidrasi. Rekomendasi: Pasang paranet/peneduh buatan jika memungkinkan.`
    })
  },

  // 2. SENSOR SUHU (TEMPERATURE)
  temperature: {
    low: (val, limit, duration) => ({
      title: "Suhu Udara Terlalu Dingin",
      level: "warning",
      message: `Suhu udara terdeteksi ${val}°C (di bawah batas ideal ${limit}°C) selama ${duration} menit. Suhu dingin berisiko memperlambat metabolisme dan pertumbuhan tanaman. Rekomendasi: Pantau kondisi fisik tanaman dan pastikan tidak ada genangan air berlebih.`
    }),
    high: (val, limit, duration) => ({
      title: "Suhu Udara Terlalu Panas",
      level: "danger",
      message: `Suhu udara mencapai ${val}°C (melebihi batas ideal ${limit}°C) selama ${duration} menit. Suhu tinggi mempercepat penguapan air tanah dan memicu stres panas. Rekomendasi: Lakukan penyiraman pada jam sejuk dan aktifkan sirkulasi udara/kipas jika tersedia.`
    })
  },

  // 3. KELEMBAPAN TANAH (SOIL MOISTURE)
  soil: {
    low: (val, limit, duration) => ({
      title: "Kelembapan Tanah Sangat Rendah",
      level: "critical",
      message: `Kelembapan tanah turun hingga ${val}% (di bawah batas ideal ${limit}%) selama ${duration} menit. Tanaman mengalami dehidrasi yang dapat menyebabkan akar layu secara permanen. Rekomendasi: Segera lakukan penyiraman intensif pada area perkebunan.`
    }),
    high: (val, limit, duration) => ({
      title: "Kelembapan Tanah Berlebih",
      level: "warning",
      message: `Kelembapan tanah mencapai ${val}% (melebihi batas ideal ${limit}%) selama ${duration} menit. Tanah yang terlalu basah berisiko menyebabkan pembusukan akar. Rekomendasi: Periksa saluran drainase tanah dan kurangi atau hentikan penyiraman sementara.`
    })
  },

  // 4. KELEMBAPAN UDARA (HUMIDITY)
  humidity: {
    low: (val, limit, duration) => ({
      title: "Kelembapan Udara Kering",
      level: "warning",
      message: `Kelembapan udara terdeteksi ${val}% (di bawah batas ideal ${limit}%) selama ${duration} menit. Udara yang terlalu kering meningkatkan laju penguapan daun. Rekomendasi: Lakukan pengembunan (misting) di area sekitar.`
    }),
    high: (val, limit, duration) => ({
      title: "Kelembapan Udara Sangat Tinggi",
      level: "warning",
      message: `Kelembapan udara mencapai ${val}% (melebihi batas ideal ${limit}%) selama ${duration} menit. Kondisi ini memicu perkembangan spora jamur dan hama. Rekomendasi: Tingkatkan sirkulasi udara di area kebun.`
    })
  },

  // 5. HEALTH SCORE PERKEBUNAN
  health: {
    low: (score, limit) => ({
      title: "Kesehatan Perkebunan Menurun",
      level: "critical",
      message: `Health Score perkebunan turun menjadi ${score}% (di bawah batas minimum ${limit}%). Kondisi ini dipicu oleh akumulasi deviasi parameter sensor yang tidak ideal. Rekomendasi: Segera lakukan inspeksi langsung ke lokasi node untuk pengecekan fisik.`
    })
  }
};
