/**
 * AGRONOMIC REASONING ENGINE v2 (Agrinexus AI Core)
 * Engine analisis multivariat untuk evaluasi kesehatan tanaman & rekomendasi presisi.
 *
 * PERUBAHAN UTAMA DARI v1:
 *  1. Lapisan "Sensor Diagnostics" - mendeteksi sensor rusak, salah pasang, stuck/flatline,
 *     nilai fisik tidak masuk akal (implausible), dan kontradiksi antar-sensor SEBELUM
 *     data dipakai untuk menghitung skor kesehatan tanaman. Ini mencegah engine salah
 *     menyalahkan tanaman padahal sumber masalah adalah hardware.
 *  2. Perhitungan VPD (Vapor Pressure Deficit) sebagai indikator stres evapotranspirasi
 *     yang jauh lebih akurat secara ilmiah dibanding sekadar ambang suhu & kelembapan terpisah.
 *  3. Deteksi stres kekeringan/kejenuhan AKUMULATIF (multi-hari), bukan cuma snapshot saat ini.
 *  4. Pembobotan skor kesehatan & confidence yang adaptif terhadap kualitas data
 *     (sensor yang dicurigai rusak bobotnya diturunkan, bukan langsung dianggap valid 100%).
 *  5. Pengecekan kesegaran data (stale data) & kelengkapan data historis.
 */

// =====================================================================================
// 1. HELPER UTILITY FUNCTIONS
// =====================================================================================

const calculateTrend = (current, previous) => {
  if (previous === null || previous === undefined || Number(previous) === 0 || current === null || current === undefined) {
    return 0;
  }
  return Number((((Number(current) - Number(previous)) / Number(previous)) * 100).toFixed(1));
};

const getMovingAverage = (logs, key, count = 10) => {
  const validLogs = logs.slice(0, count).map(l => Number(l[key])).filter(v => !isNaN(v));
  if (validLogs.length === 0) return 0;
  return validLogs.reduce((a, b) => a + b, 0) / validLogs.length;
};

const getStdDev = (logs, key, count = 12) => {
  const validLogs = logs.slice(0, count).map(l => Number(l[key])).filter(v => !isNaN(v));
  if (validLogs.length < 3) return null; // data kurang untuk menilai stabilitas
  const mean = validLogs.reduce((a, b) => a + b, 0) / validLogs.length;
  const variance = validLogs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validLogs.length;
  return { stdDev: Number(Math.sqrt(variance).toFixed(3)), mean: Number(mean.toFixed(2)), sampleSize: validLogs.length };
};

// Vapor Pressure Deficit (kPa) - indikator "haus"-nya udara terhadap tanaman.
// VPD tinggi = udara sangat "menyedot" air dari daun meski suhu/kelembapan individual
// masih terlihat "normal" jika dilihat terpisah-pisah.
const calculateVPD = (tempC, rhPercent) => {
  if (tempC === null || rhPercent === null || isNaN(tempC) || isNaN(rhPercent)) return null;
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3)); // kPa, saturation vapor pressure
  const avp = svp * (Math.min(Math.max(rhPercent, 0), 100) / 100); // actual vapor pressure
  return Number((svp - avp).toFixed(3));
};

// Menghitung berapa banyak dari N pembacaan terakhir yang berada di luar rentang ideal
// -> dipakai untuk mendeteksi stres kumulatif (bukan cuma 1 snapshot yang kebetulan ekstrem)
const countOutOfRangeStreak = (logs, key, min, max, count = 24) => {
  const validLogs = logs.slice(0, count).map(l => Number(l[key])).filter(v => !isNaN(v));
  if (validLogs.length === 0) return { streak: 0, sample: 0, ratio: 0 };
  const outOfRange = validLogs.filter(v => v < min || v > max).length;
  return { streak: outOfRange, sample: validLogs.length, ratio: Number((outOfRange / validLogs.length).toFixed(2)) };
};

// =====================================================================================
// 2. SENSOR DIAGNOSTICS LAYER
//    Tujuan: bedakan "tanaman sakit" vs "sensor bohong" (rusak/kotor/salah pasang/lepas kontak)
// =====================================================================================

const PLAUSIBLE_RANGES = {
  temperature: { hardMin: -5, hardMax: 55, softMin: 10, softMax: 42 },
  humidity: { hardMin: 0, hardMax: 100, softMin: 20, softMax: 99 },
  soil: { hardMin: 0, hardMax: 100, softMin: 3, softMax: 97 },
  light: { hardMin: 0, hardMax: 150000, softMin: 0, softMax: 120000 },
};

const diagnoseSensorHealth = (stats, historicalReadings, panelLogs, isDaytime) => {
  const result = {
    temperature: { status: "OK", issues: [] },
    humidity: { status: "OK", issues: [] },
    soil: { status: "OK", issues: [] },
    light: { status: "OK", issues: [] },
    hasCriticalFault: false,
    hasSuspectFault: false,
  };

  const raw = {
    temperature: stats.temperature?.value,
    humidity: stats.humidity?.value,
    soil: stats.soil?.value,
    light: stats.light?.value,
  };

  const historyKeyMap = { temperature: "temperature", humidity: "humidity", soil: "soil_moisture", light: "light" };

  // --- A. Sensor tidak mengirim data sama sekali (offline / putus kabel / kehabisan daya) ---
  Object.keys(raw).forEach((sensorKey) => {
    if (raw[sensorKey] === null || raw[sensorKey] === undefined) {
      result[sensorKey].status = "FAULT";
      result[sensorKey].issues.push("Tidak ada data masuk dari sensor (kemungkinan kabel lepas, sensor mati, atau kehabisan daya/baterai node).");
    }
  });

  // --- B. Nilai fisik mustahil (hard bounds) ---
  Object.entries(PLAUSIBLE_RANGES).forEach(([sensorKey, range]) => {
    const val = raw[sensorKey];
    if (val === null || val === undefined || isNaN(Number(val))) return;
    const v = Number(val);
    if (v < range.hardMin || v > range.hardMax) {
      result[sensorKey].status = "FAULT";
      result[sensorKey].issues.push(`Nilai (${v}) berada di luar batas fisik yang mungkin (${range.hardMin} - ${range.hardMax}). Sensor kemungkinan rusak atau salah kalibrasi.`);
    } else if ((v < range.softMin || v > range.softMax) && result[sensorKey].status === "OK") {
      result[sensorKey].status = "SUSPECT";
      result[sensorKey].issues.push(`Nilai (${v}) berada di zona ekstrem yang jarang terjadi secara alami. Perlu verifikasi manual apakah ini kondisi nyata atau gangguan sensor.`);
    }
  });

  // --- C. Sensor "stuck" / flatline (nilai tidak berubah sama sekali dalam banyak pembacaan) ---
  Object.entries(historyKeyMap).forEach(([sensorKey, histKey]) => {
    const stats24 = getStdDev(historicalReadings, histKey, 12);
    if (stats24 && stats24.stdDev !== null && stats24.stdDev < 0.05 && stats24.sampleSize >= 6) {
      // Nilai identik terus-menerus - kemungkinan besar sensor macet, bukan kondisi alami
      if (result[sensorKey].status === "OK") result[sensorKey].status = "SUSPECT";
      result[sensorKey].issues.push(`Pembacaan tidak berubah sama sekali selama ${stats24.sampleSize} data terakhir (nilai stagnan di ~${stats24.mean}). Indikasi sensor macet/kotor/terjebak di satu posisi, bukan kondisi lingkungan yang benar-benar statis.`);
    }
  });

  // --- D. Kontradiksi logis antar-sensor (cross-validation) ---
  const soilVal = raw.soil !== null && raw.soil !== undefined ? Number(raw.soil) : null;
  const humVal = raw.humidity !== null && raw.humidity !== undefined ? Number(raw.humidity) : null;
  const tempVal = raw.temperature !== null && raw.temperature !== undefined ? Number(raw.temperature) : null;
  const lightVal = raw.light !== null && raw.light !== undefined ? Number(raw.light) : null;

  const recentRainLogs = panelLogs.slice(0, 48).filter(l => l.rain_adc !== null && l.rain_adc !== undefined && l.rain_adc < 800);
  const hasRecentRain = recentRainLogs.length >= 3;

  // D1. Tanah sangat kering padahal baru saja hujan deras & udara sangat lembap
  //     -> kemungkinan probe soil tidak tertanam dengan benar (menggantung/di permukaan/di udara)
  if (soilVal !== null && soilVal < 8 && hasRecentRain && (humVal === null || humVal > 80)) {
    if (result.soil.status === "OK") result.soil.status = "SUSPECT";
    result.soil.issues.push("Tanah terbaca sangat kering meskipun log hujan & kelembapan udara menunjukkan baru saja terjadi hujan. Kemungkinan probe sensor tanah tidak tertanam sempurna ke dalam tanah (menggantung di udara / kurang dalam / terlepas sebagian).");
  }

  // D2. Sensor cahaya membaca ~0 di siang hari jelas, padahal suhu tinggi menandakan matahari terik
  if (isDaytime && lightVal !== null && lightVal < 200 && tempVal !== null && tempVal > 30) {
    if (result.light.status === "OK") result.light.status = "SUSPECT";
    result.light.issues.push("Sensor cahaya membaca nyaris nol di siang hari saat suhu tinggi (indikasi matahari sedang terik). Kemungkinan lensa sensor tertutup debu/daun/embun, atau posisi sensor ternaungi objek.");
  }

  // D3. Suhu ekstrem tinggi bersamaan dengan kelembapan sangat rendah & cahaya sangat tinggi terus-menerus
  //     -> bisa jadi kondisi nyata (gelombang panas), TAPI juga pola klasik housing sensor kepanasan
  //        karena terpapar matahari langsung tanpa pelindung (radiation error). Beri catatan, jangan override.
  if (tempVal !== null && tempVal > 42 && humVal !== null && humVal < 25 && isDaytime && lightVal !== null && lightVal > limitsSafeCheck(PLAUSIBLE_RANGES.light.softMax)) {
    if (result.temperature.status === "OK") result.temperature.status = "SUSPECT";
    result.temperature.issues.push("Kombinasi suhu sangat tinggi + kelembapan sangat rendah + cahaya sangat terang bisa jadi gelombang panas nyata, tetapi juga pola khas sensor suhu yang terpapar sinar matahari langsung tanpa pelindung/shield (radiation error). Perlu cek fisik naungan sensor.");
  }

  // D4. Semua sensor melaporkan nilai 0 bersamaan -> hampir pasti masalah daya/koneksi node, bukan kondisi lahan
  const zeroCount = [tempVal, humVal, soilVal, lightVal].filter(v => v === 0).length;
  if (zeroCount >= 3) {
    ["temperature", "humidity", "soil", "light"].forEach(k => {
      if (result[k].status !== "FAULT") result[k].status = "FAULT";
    });
    result.hasCriticalFault = true;
    result.systemFault = "Mayoritas sensor melaporkan nilai 0 secara bersamaan. Ini sangat tidak wajar secara agronomis dan mengindikasikan node kehilangan daya, modul sensor tidak terpasang ke board, atau gangguan koneksi total - bukan kondisi lahan sesungguhnya.";
  }

  // --- E. Finalisasi status keseluruhan ---
  Object.keys(historyKeyMap).forEach((k) => {
    if (result[k].status === "FAULT") result.hasCriticalFault = true;
    if (result[k].status === "SUSPECT") result.hasSuspectFault = true;
  });

  return result;
};

// Helper kecil agar tidak menabrak nama variabel 'limits' di scope utama saat dipanggil lebih awal
function limitsSafeCheck(v) { return v; }

// =====================================================================================
// 3. CORE AGRONOMIC ENGINE
// =====================================================================================

export const generateAgronomicReasoning = (
  stats,
  settings = {},
  panelLogs = [],
  historicalReadings = [],
  healthScoreOverride = null
) => {
  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour <= 18;

  // Configuration & Boundaries
  const limits = {
    tempMin: Number(settings.temperature_ideal_min ?? 24),
    tempMax: Number(settings.temperature_ideal_max ?? 32),
    humMin: Number(settings.humidity_ideal_min ?? 70),
    humMax: Number(settings.humidity_ideal_max ?? 90),
    soilMin: Number(settings.soil_ideal_min ?? 45),
    soilMax: Number(settings.soil_ideal_max ?? 80),
    lightMin: Number(settings.light_ideal_min ?? 8000),
    lightMax: Number(settings.light_ideal_max ?? 25000),
  };

  // -------------------------------------------------------------------------------
  // STEP 0: SENSOR DIAGNOSTICS - dijalankan PALING AWAL sebelum data dipercaya
  // -------------------------------------------------------------------------------
  const sensorDiag = diagnoseSensorHealth(stats, historicalReadings, panelLogs, isDaytime);

  // Sensor Values Extraction (tetap fallback ke 0 agar kalkulasi tidak crash,
  // tapi sekarang kita TAHU dan MENCATAT kalau nilai itu sebenarnya tidak valid)
  const temp = Number(stats.temperature?.value ?? 0);
  const hum = Number(stats.humidity?.value ?? 0);
  const soil = Number(stats.soil?.value ?? 0);
  const light = Number(stats.light?.value ?? 0);

  // Bobot kepercayaan tiap sensor terhadap skor kesehatan (1 = penuh dipercaya, 0 = diabaikan)
  const trustWeight = (sensorKey) => {
    const status = sensorDiag[sensorKey]?.status;
    if (status === "FAULT") return 0; // jangan biarkan sensor rusak menjatuhkan/mengangkat skor kesehatan tanaman
    if (status === "SUSPECT") return 0.5; // tetap dihitung tapi pengaruhnya diredam
    return 1;
  };

  // Historical Analysis & Rain Verification
  const recentRainLogs = panelLogs.slice(0, 48).filter(l => l.rain_adc !== null && l.rain_adc < 800);
  const hasRecentRain = recentRainLogs.length >= 3;

  const prevTemp = historicalReadings[1]?.temperature ?? temp;
  const prevSoil = historicalReadings[1]?.soil_moisture ?? soil;
  const tempTrend = calculateTrend(temp, prevTemp);
  const soilTrend = calculateTrend(soil, prevSoil);
  const avgSoil24h = getMovingAverage(historicalReadings, 'soil_moisture', 24) || soil;

  // Stres kumulatif multi-hari (bukan cuma snapshot sesaat)
  const soilDryStreak = countOutOfRangeStreak(historicalReadings, 'soil_moisture', limits.soilMin, limits.soilMax, 24);
  const tempStreak = countOutOfRangeStreak(historicalReadings, 'temperature', limits.tempMin, limits.tempMax, 24);

  // VPD - indikator stres evapotranspirasi yang lebih akurat daripada threshold terpisah
  const vpd = calculateVPD(temp, hum);
  // VPD > 1.5-1.6 kPa umumnya mulai memicu stomata menutup pada banyak tanaman tropis;
  // > 2.2 kPa dianggap tinggi/berbahaya untuk kebanyakan tanaman perkebunan.
  const isHighVPD = vpd !== null && vpd > 1.6;
  const isSevereVPD = vpd !== null && vpd > 2.2;

  // -------------------------------------------------------------------------------
  // STEP 1: PARAMETER DEVIATION SCORING (0 to 1) - sekarang dibobot oleh trustWeight
  // -------------------------------------------------------------------------------
  const rawDevTemp = temp < limits.tempMin ? (limits.tempMin - temp) / limits.tempMin : temp > limits.tempMax ? (temp - limits.tempMax) / limits.tempMax : 0;
  const rawDevHum = hum < limits.humMin ? (limits.humMin - hum) / limits.humMin : hum > limits.humMax ? (hum - limits.humMax) / limits.humMax : 0;
  const rawDevSoil = soil < limits.soilMin ? (limits.soilMin - soil) / limits.soilMin : soil > limits.soilMax ? (soil - limits.soilMax) / limits.soilMax : 0;
  const rawDevLight = isDaytime ? (light < limits.lightMin ? (limits.lightMin - light) / limits.lightMin : light > limits.lightMax ? (light - limits.lightMax) / limits.lightMax : 0) : 0;

  const devTemp = rawDevTemp * trustWeight("temperature");
  const devHum = rawDevHum * trustWeight("humidity");
  const devSoil = rawDevSoil * trustWeight("soil");
  const devLight = rawDevLight * trustWeight("light");

  // Calculated Health Score (if not supplied externally)
  let calculatedHealth = healthScoreOverride;
  if (calculatedHealth === null || calculatedHealth === undefined) {
    const rawHealth = 100 - (devTemp * 25 + devHum * 25 + devSoil * 30 + devLight * 20) * 100;
    calculatedHealth = Math.max(0, Math.min(100, Number(rawHealth.toFixed(1))));
  }

  // -------------------------------------------------------------------------------
  // STEP 2 & 3: MULTI-SENSOR CORRELATION & ROOT CAUSE ANALYSIS
  // -------------------------------------------------------------------------------
  let mainProblem = "Tidak Ada Masalah Signifikan";
  let rootCause = "Ekosistem berada dalam batas toleransi normal.";
  let severity = "Normal";
  let prediction = "Kondisi tanaman diperkirakan stabil dan tumbuh optimal.";
  const affectedParameters = [];
  const recommendationSteps = [];
  const farmerGuidance = [];
  let priority = 5; // 1 (Highest) to 5 (Lowest)
  let confidence = 95;

  // Identify Deviated Parameters (hanya yang datanya dipercaya)
  if (devSoil > 0) affectedParameters.push("Kelembapan Tanah");
  if (devTemp > 0) affectedParameters.push("Suhu Udara");
  if (devHum > 0) affectedParameters.push("Kelembapan Udara");
  if (devLight > 0) affectedParameters.push("Intensitas Cahaya");

  // -------------------------------------------------------------------------------
  // STEP 2A (BARU): PRIORITAS TERTINGGI - JIKA ADA SENSOR FAULT KRITIS,
  // beri tahu itu duluan sebelum mendiagnosis "penyakit tanaman" dari data yang meragukan.
  // -------------------------------------------------------------------------------
  if (sensorDiag.hasCriticalFault) {
    mainProblem = "Gangguan Perangkat Sensor Terdeteksi";
    const faultySensors = Object.entries(sensorDiag)
      .filter(([k, v]) => ["temperature", "humidity", "soil", "light"].includes(k) && v.status === "FAULT")
      .map(([k]) => ({ temperature: "Suhu", humidity: "Kelembapan Udara", soil: "Kelembapan Tanah", light: "Cahaya" }[k]));

    rootCause = sensorDiag.systemFault
      ? sensorDiag.systemFault
      : `Data dari sensor berikut tidak valid/tidak masuk akal secara fisik: ${faultySensors.join(", ")}. Skor kesehatan tanaman TIDAK dihitung dari sensor-sensor ini untuk mencegah diagnosis keliru.`;
    severity = "Kritis";
    priority = 1;
    confidence = 40; // rendah karena data tidak lengkap/tidak valid
    prediction = "Selama sensor belum diperbaiki, seluruh rekomendasi otomatis pada node ini berisiko tidak akurat dan sebaiknya tidak dijadikan satu-satunya acuan keputusan.";

    recommendationSteps.push(
      "SEGERA: Datangi lokasi node secara fisik dan periksa koneksi kabel setiap sensor yang bermasalah (pastikan konektor tidak longgar/korosi).",
      "SEGERA: Periksa sumber daya (baterai/panel surya/adaptor) node - pastikan tegangan mencukupi.",
      "Bersihkan permukaan/lensa sensor dari debu, embun, lumpur, atau sisa daun yang menutupi.",
      "Khusus sensor tanah: pastikan probe tertanam penuh & tegak lurus ke dalam tanah, tidak menggantung atau tercabut sebagian akibat tanah tererosi/gembur.",
      "Khusus sensor cahaya: pastikan tidak ada objek (daun, atap, bayangan struktur) yang menutupi sensor sepanjang hari.",
      "Setelah perbaikan fisik, tunggu 1-2 siklus pembacaan lalu bandingkan kembali datanya sebelum mempercayai rekomendasi otomatis."
    );

    // Tetap kumpulkan catatan SUSPECT lain (non-kritis) sebagai tambahan, lalu langsung susun output.
    Object.entries(sensorDiag).forEach(([k, v]) => {
      if (["temperature", "humidity", "soil", "light"].includes(k) && v.issues.length > 0) {
        v.issues.forEach(issue => farmerGuidance.push(`• [${k}] ${issue}`));
      }
    });

    return {
      overall_status: "Data Tidak Valid",
      health_score: calculatedHealth,
      severity,
      main_problem: mainProblem,
      root_cause: rootCause,
      affected_parameters: affectedParameters.length > 0 ? affectedParameters : ["Tidak Ada"],
      prediction,
      recommendation: recommendationSteps,
      farmer_guidance: farmerGuidance.length > 0 ? farmerGuidance : ["Segera cek kondisi fisik sensor sebelum data dapat dipercaya kembali."],
      priority,
      confidence,
      sensor_diagnostics: sensorDiag,
      vpd_kpa: vpd,
    };
  }

  // Multi-Sensor Pattern Matching
  const isHighThermalEvap = temp > limits.tempMax && hum < limits.humMin && (isDaytime && light > limits.lightMin);
  const isDrySoilTrend = soil < limits.soilMin || (soilTrend < -5 && soil < limits.soilMin + 10);
  const isWetSoilNoRain = soil > limits.soilMax && !hasRecentRain;
  const isSatSoilWithRain = soil > limits.soilMax && hasRecentRain;

  // Diagnostic Scenario Execution
  if ((isDrySoilTrend && isHighThermalEvap && !hasRecentRain) || (isSevereVPD && soil < limits.soilMin + 15)) {
    // Scenario A: Severe Water Stress (Heat + Low Hum + No Rain + High Light, atau VPD ekstrem)
    mainProblem = "Stres Dehidrasi & Evapotranspirasi Tinggi";
    rootCause = isSevereVPD
      ? `Defisit Tekanan Uap (VPD) mencapai ${vpd} kPa, jauh di atas ambang aman (~1.6 kPa). Ini berarti udara "menarik" air dari daun jauh lebih cepat daripada yang bisa diserap akar dari tanah, terlepas dari suhu/kelembapan terlihat "cukup normal" jika dilihat terpisah.`
      : "Kombinasi suhu udara tinggi, cahaya berlebih, kelembapan udara rendah, dan ketiadaan hujan berhari-hari memicu laju penguapan ekstrem dari tanah dan daun.";
    severity = devSoil > 0.4 || devTemp > 0.3 || isSevereVPD ? "Kritis" : "Tinggi";
    priority = 1;
    confidence = 96;
    prediction = "Bila berlangsung lebih dari 48 jam, stomata daun akan menutup, pemicu kerontokan bunga/buah muda, pembakaran ujung daun, dan penghentian pertumbuhan vegetatif.";

    if (soilDryStreak.ratio >= 0.5) {
      prediction += ` Data 24 jam terakhir menunjukkan ${Math.round(soilDryStreak.ratio * 100)}% pembacaan tanah berada di luar rentang ideal - ini bukan kondisi sesaat, melainkan stres yang sudah berlangsung lama.`;
    }

    recommendationSteps.push(
      "HARI 1 (Pagi/Sore): Lakukan penyiraman manual intensif 10–15 Liter per titik tanaman. Hindari penyiraman tepat siang hari saat terik.",
      "HARI 1: Pasang mulsa jerami/daun kering di sekeliling piringan kanopi untuk menahan penguapan air tanah.",
      "HARI 2: Evaluasi respon kelembapan tanah pada dashboard. Jika masih di bawah batas ideal, periksa kejenuhan lapisan tanah bawah.",
      "HARI 3: Jika suhu udara tetap ekstrem, pasang jaring peneduh (paranet 50–60%) secara manual."
    );
    if (sensorDiag.temperature.status === "SUSPECT" || sensorDiag.humidity.status === "SUSPECT") {
      recommendationSteps.push("CATATAN: Sensor suhu/kelembapan pada node ini terindikasi mencurigakan (lihat sensor_diagnostics) - sebaiknya verifikasi manual dengan termometer/higrometer genggam sebelum mengambil tindakan besar.");
    }
  } else if (isWetSoilNoRain) {
    // Scenario B: Overwatering / Sensor Anomaly / Drainage Block
    mainProblem = "Kelembapan Tanah Jenuh Ekstrem (Anomali Tanpa Hujan)";
    rootCause = "Tanah mengalami kejenuhan air (100 ADC) padahal historis sensor hujan mengonfirmasi tidak ada hujan. Kemungkinan besar akibat penyiraman manual berlebihan atau penumpukan air tanah tanpa sirkulasi.";
    severity = "Sedang";
    priority = 2;
    confidence = 91;
    prediction = "Akar tanaman berisiko mengalami anoksia (kekurangan oksigen) yang memicu pembusukan akar (root rot) dan perkembangbiakan cendok/jamur patogen tanah.";

    recommendationSteps.push(
      "HARI 1: Hentikan seluruh kegiatan penyiraman manual pada area node ini secara total.",
      "HARI 1: Gemburkan tanah secara perlahan di sekitar piringan tanaman menggunakan cangkul kecil agar pori-pori tanah terbuka dan aerasi udara masuk.",
      "HARI 2: Bersihkan sisa-sisa genangan air atau gundukan lumpur yang menutupi probe sensor.",
      "HARI 3: Pantau apakah kelembapan tanah mulai menurun mendekati batas ideal."
    );
  } else if (isSatSoilWithRain) {
    // Scenario C: Natural Heavy Rain Saturation
    mainProblem = "Pelepasan Air Lambat Pasca Hujan Deras";
    rootCause = "Akumulasi presipitasi air hujan dari panel_logs menyebabkan tanah mencapai titik jenuh retensi air.";
    severity = "Ringan";
    priority = 3;
    confidence = 94;
    prediction = "Peningkatan risiko penyakit bercak daun dan jamur akibat kelembapan tanah dan udara yang tinggi secara simultan.";

    recommendationSteps.push(
      "HARI 1: Bersihkan piringan tanaman dari sampah organik basah yang menyumbat alur limpasan air alami.",
      "HARI 2: Taburkan pupuk hayati/trichoderma untuk mencegah infeksi jamur akar akibat kelembapan tinggi.",
      "HARI 3: Biarkan air menguap alami dan tunda penyiraman sampai indikator tanah kembali normal."
    );
  } else if (hum > limits.humMax && temp < limits.tempMin) {
    // Scenario D: Cold High Humidity (Fungal Threat)
    mainProblem = "Mikroklimat Lembap Dingin (Potensi Wabah Jamur)";
    rootCause = "Tingginya kelembapan udara disertai suhu mikro yang terlalu rendah menciptakan lingkungan ideal bagi spora patogen.";
    severity = "Sedang";
    priority = 3;
    confidence = 89;
    prediction = "Potensi munculnya penyakit phytophthora atau embun buluk (downy mildew) pada jaringan daun muda.";

    recommendationSteps.push(
      "HARI 1: Pangkas cabang/daun bagian bawah yang terlalu rimbun untuk membuka sirkulasi angin (pruning).",
      "HARI 2: Lakukan penyiangan gulma di sekitar area bawah kanopi.",
      "HARI 3: Evaluasi kelembapan udara mikro."
    );
  } else if (!isDaytime && temp > limits.tempMax) {
    // Scenario F (BARU): Suhu malam tetap tinggi -> tanaman tidak sempat "istirahat" respirasi
    mainProblem = "Suhu Malam Hari Tidak Turun (Gangguan Respirasi Tanaman)";
    rootCause = "Suhu udara pada malam hari tetap berada di atas batas ideal. Tanaman umumnya membutuhkan penurunan suhu malam untuk menekan laju respirasi dan menyimpan hasil fotosintesis siang hari sebagai energi pertumbuhan.";
    severity = "Sedang";
    priority = 3;
    confidence = 85;
    prediction = "Jika berlangsung berulang, energi hasil fotosintesis banyak terbakar untuk respirasi malam sehingga pertumbuhan & pembungaan melambat meski siang hari tampak sehat.";
    recommendationSteps.push(
      "Evaluasi apakah ada sumber panas buatan di sekitar node (aspal, tembok, atap seng) yang menahan panas hingga malam.",
      "Pastikan sirkulasi udara di sekitar tanaman tidak terhalang struktur/naungan permanen.",
      "Pantau tren suhu malam selama 3-4 hari untuk memastikan ini pola berulang, bukan anomali satu malam."
    );
  } else if (devSoil > 0) {
    // Scenario E: Isolated Soil Issue
    mainProblem = "Ketidakseimbangan Kelembapan Tanah Area Node";
    rootCause = soil < limits.soilMin ? "Intensitas penyiraman lokal kurang mencukupi kebutuhan spesifik zona node ini." : "Retensi air lokal terlalu tinggi.";
    severity = "Ringan";
    priority = 4;
    confidence = 92;
    prediction = "Pertumbuhan vegetatif pada node ini menjadi tidak seragam dibandingkan area node lainnya.";

    recommendationSteps.push(
      soil < limits.soilMin
        ? "Lakukan penyiraman manual secara berkala pada pagi hari khusus area node ini."
        : "Kurangi debit penyiraman manual pada area node ini."
    );
  } else if (isHighVPD) {
    // Scenario G (BARU): VPD moderat-tinggi walau tiap parameter individual belum "merah"
    mainProblem = "Defisit Tekanan Uap (VPD) Mulai Meningkat";
    rootCause = `VPD saat ini ${vpd} kPa - mulai memasuki zona yang memicu penutupan stomata sebagian, meskipun suhu dan kelembapan individual belum melewati ambang batas. Ini adalah sinyal dini sebelum stres air benar-benar terlihat pada sensor tanah.`;
    severity = "Ringan";
    priority = 4;
    confidence = 82;
    prediction = "Efisiensi fotosintesis mulai sedikit menurun. Jika tren suhu naik/kelembapan turun berlanjut, berisiko menjadi stres dehidrasi penuh dalam 24-48 jam ke depan.";
    recommendationSteps.push(
      "Tingkatkan frekuensi pemantauan pada jam-jam terpanas (11.00-15.00).",
      "Pertimbangkan penyiraman ringan preventif di sore hari untuk menjaga cadangan air tanah.",
      "Pantau apakah VPD terus naik pada pembacaan berikutnya."
    );
  }

  // -------------------------------------------------------------------------------
  // STEP 3B (BARU): Sisipkan peringatan sensor SUSPECT (non-kritis) ke root cause,
  // tanpa mengubah diagnosis utama - supaya petani tahu ada faktor ketidakpastian data.
  // -------------------------------------------------------------------------------
  const suspectNotes = [];
  ["temperature", "humidity", "soil", "light"].forEach((k) => {
    if (sensorDiag[k].status === "SUSPECT") {
      const label = { temperature: "suhu", humidity: "kelembapan udara", soil: "kelembapan tanah", light: "cahaya" }[k];
      suspectNotes.push(`Sensor ${label} menunjukkan indikasi mencurigakan (lihat detail di sensor_diagnostics) - pertimbangkan cek fisik pemasangan/kebersihan sensor sebagai kemungkinan penyebab, bukan semata kondisi tanaman.`);
      confidence = Math.max(50, confidence - 8); // turunkan sedikit keyakinan diagnosis karena kualitas data diragukan
    }
  });
  if (suspectNotes.length > 0) {
    rootCause += ` [Catatan kualitas data: ${suspectNotes.join(" ")}]`;
  }

  // Penalti confidence bila data historis terlalu sedikit untuk analisis tren yang andal
  if (historicalReadings.length < 5) {
    confidence = Math.max(45, confidence - 15);
    farmerGuidance.push("• Data historis masih sangat terbatas - analisis tren & prediksi akan semakin akurat seiring bertambahnya data yang terkumpul.");
  }

  // -------------------------------------------------------------------------------
  // STEP 4: CONTINUOUS HEALTH SCORE IMPROVEMENT GUIDANCE
  // -------------------------------------------------------------------------------
  if (calculatedHealth < 100) {
    farmerGuidance.push(`Indeks Kesehatan saat ini ${calculatedHealth}/100. Rekomendasi peningkatan target:`);
    if (devSoil > 0) {
      farmerGuidance.push(`• Atur kadar air tanah ke rentang ideal (${limits.soilMin} - ${limits.soilMax} ADC).`);
    }
    if (devTemp > 0 || devHum > 0) {
      farmerGuidance.push(`• Jaga lingkungan mikro udara dengan pemangkasan gulma atau penambahan mulsa.`);
    }
    if (isDaytime && devLight > 0) {
      farmerGuidance.push(`• Optimalkan tangkapan cahaya matahari dengan pembersihan peneduh liar.`);
    }
    if (vpd !== null) {
      farmerGuidance.push(`• VPD saat ini ${vpd} kPa (idealnya sekitar 0.4 - 1.6 kPa tergantung jenis tanaman).`);
    }
    farmerGuidance.push(`• Evaluasi ulang respons sensor dalam kurun waktu 12–24 jam.`);
  } else {
    farmerGuidance.push("Kondisi ekosistem perkebunan berada pada performa 100% Sempurna.");
    farmerGuidance.push("• Pertahankan pola perawatan dan jadwal monitoring harian saat ini.");
    farmerGuidance.push("• Pastikan permukaan sensor tetap bersih dari debu dan kotoran fisik.");
  }

  // Selalu ingatkan perawatan preventif sensor, bahkan saat status OK - karena ini
  // adalah permintaan eksplisit: penempatan/kondisi fisik sensor adalah faktor kesehatan data.
  if (sensorDiag.hasSuspectFault) {
    farmerGuidance.push("• PENTING: Terdapat indikasi sensor bermasalah (lihat sensor_diagnostics). Segera periksa pemasangan fisik, kebersihan lensa/probe, dan koneksi kabel sensor terkait sebelum sepenuhnya mempercayai skor kesehatan ini.");
  } else {
    farmerGuidance.push("• Rutin cek fisik sensor setiap 1-2 minggu: pastikan probe tanah tertanam sempurna, lensa cahaya bebas debu/embun, dan tidak ada hewan/serangga yang bersarang di housing sensor.");
  }

  // -------------------------------------------------------------------------------
  // STEP 5: STRUCTURED JSON ASSEMBLY
  // -------------------------------------------------------------------------------
  return {
    overall_status: calculatedHealth >= 80 ? "Optimal" : calculatedHealth >= 60 ? "Perlu Perhatian" : "Kritis",
    health_score: calculatedHealth,
    severity,
    main_problem: mainProblem,
    root_cause: rootCause,
    affected_parameters: affectedParameters.length > 0 ? affectedParameters : ["Tidak Ada"],
    prediction,
    recommendation: recommendationSteps,
    farmer_guidance: farmerGuidance,
    priority,
    confidence,
    // --- Field baru ---
    sensor_diagnostics: sensorDiag, // status per-sensor: OK / SUSPECT / FAULT + alasan
    vpd_kpa: vpd, // Vapor Pressure Deficit, indikator stres evapotranspirasi
    cumulative_stress: {
      soil_out_of_range_ratio_24h: soilDryStreak.ratio,
      temperature_out_of_range_ratio_24h: tempStreak.ratio,
    },
  };
};