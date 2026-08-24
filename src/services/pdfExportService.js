// src/services/pdfExportService.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper untuk mengubah URL gambar ke Base64 (CORS-safe)
const getBase64ImageFromUrl = async imageUrl => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const exportHistoryToPDF = async (filteredData, filterState) => {
  const doc = jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const logoUrl =
    "https://vpjazpaxfyfornsanirb.supabase.co/storage/v1/object/public/LOGO/ChatGPT%20Image%20Jun%2023,%202026,%2010_46_47%20PM.png";

  // Load Logo terlebih dahulu
  try {
    const logoBase64 = await getBase64ImageFromUrl(logoUrl);
    // doc.addImage(imageData, format, x, y, width, height)
    doc.addImage(logoBase64, "PNG", 14, 10, 15, 15);
  } catch (error) {
    console.error("Gagal memuat logo untuk PDF:", error);
  }

  // Offset X untuk teks header karena ada logo di kiri (14mm + 15mm width + 4mm gap = 33mm)
  const headerX = 33;

  // ==========================================
  // 1. Header Laporan
  // ==========================================
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text("LAPORAN MONITORING KESEHATAN KEBUN", headerX, 16);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 117, 125);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, headerX, 22);

  // Info Filter Waktu
  let timeFilterText = "Semua Waktu";
  if (filterState.timeMode === "day") {
    timeFilterText = `Tanggal: ${filterState.selectedDayDate} ${filterState.selectedHour !==
    "all"
      ? `(Jam ${filterState.selectedHour}:00)`
      : ""}`;
  } else if (filterState.timeMode === "week") {
    timeFilterText = `Minggu: ${filterState.selectedWeek}`;
  } else if (filterState.timeMode === "month") {
    timeFilterText = `Bulan: ${filterState.selectedMonth}`;
  } else if (filterState.timeMode === "year") {
    timeFilterText = `Tahun: ${filterState.selectedYear}`;
  }

  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.text(
    `Rentang Waktu: ${timeFilterText} | Total Record: ${filteredData.length} Data`,
    14,
    31
  );

  // ==========================================
  // 2. Perhitungan Skor Menyeluruh & Distribusi Status
  // ==========================================
  const totalItems = filteredData.length;
  const avgHealth = Math.round(
    filteredData.reduce((acc, item) => acc + (item.health || 0), 0) /
      (totalItems || 1)
  );

  const statusCount = { Optimal: 0, "Perlu Perhatian": 0, Kritis: 0 };
  filteredData.forEach(item => {
    if (statusCount[item.status] !== undefined) {
      statusCount[item.status]++;
    } else {
      statusCount["Optimal"]++;
    }
  });

  // Card Ringkasan Skor Kesehatan
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, 35, 65, 32, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text("Skor Kesehatan Menyeluruh", 18, 42);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  let scoreColor = [16, 185, 129]; // Green
  if (avgHealth < 60) scoreColor = [239, 68, 68];
  else if (avgHealth < 80)
    // Red
    scoreColor = [245, 158, 11]; // Yellow/Orange
  doc.setTextColor(...scoreColor);
  doc.text(`${avgHealth} / 100`, 18, 53);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 117, 125);
  doc.text(`Berdasarkan ${totalItems} data sampel`, 18, 61);

  // ==========================================
  // 3. Grafik Bar Visualisasi Status
  // ==========================================
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(85, 35, 198, 32, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text("Distribusi Status Kesehatan Kebun", 89, 42);

  const maxBarWidth = 120;
  const chartItems = [
    { label: "Optimal", count: statusCount["Optimal"], color: [16, 185, 129] },
    {
      label: "Perlu Perhatian",
      count: statusCount["Perlu Perhatian"],
      color: [245, 158, 11]
    },
    { label: "Kritis", count: statusCount["Kritis"], color: [239, 68, 68] }
  ];

  chartItems.forEach((chart, idx) => {
    const yPos = 47 + idx * 6;
    const ratio = totalItems > 0 ? chart.count / totalItems : 0;
    const barWidth = Math.max(ratio * maxBarWidth, 2);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(chart.label, 89, yPos + 4);

    doc.setFillColor(220, 225, 230);
    doc.rect(120, yPos, maxBarWidth, 4, "F");

    doc.setFillColor(...chart.color);
    doc.rect(120, yPos, barWidth, 4, "F");

    const percentStr = `${Math.round(ratio * 100)}% (${chart.count})`;
    doc.text(percentStr, 120 + maxBarWidth + 4, yPos + 4);
  });

  // ==========================================
  // 4. Analisis Kekurangan & Rekomendasi Solusi
  // ==========================================
  const issues = [];
  const avgTemp =
    filteredData.reduce((acc, i) => acc + (i.temperature || 0), 0) /
    (totalItems || 1);
  const avgHum =
    filteredData.reduce((acc, i) => acc + (i.humidity || 0), 0) /
    (totalItems || 1);
  const avgSoil =
    filteredData.reduce((acc, i) => acc + (i.soil || 0), 0) / (totalItems || 1);
  const avgLight =
    filteredData.reduce((acc, i) => acc + (i.light || 0), 0) /
    (totalItems || 1);

  if (avgSoil < 40) {
    issues.push({
      problem: "Kelembapan tanah rata-rata terlalu rendah (Kurang dari 40%).",
      solution:
        "Tingkatkan intensitas penyiraman pada area perkebunan atau aktifkan sistem irigasi otomatis."
    });
  }
  if (avgTemp > 35) {
    issues.push({
      problem: "Suhu lingkungan rata-rata cukup tinggi (Lebih dari 35°C).",
      solution:
        "Aktifkan kipas pendingin (Fan Mode ON) atau pertimbangkan penambahan peneduh tanaman."
    });
  }
  if (avgHum < 50) {
    issues.push({
      problem:
        "Kelembapan udara di sekitar area kebun relatif kering (Kurang dari 50%).",
      solution:
        "Lakukan pengembunan (misting) untuk menjaga kelembapan mikro perkebunan tetap stabil."
    });
  }
  if (avgLight > 50000) {
    issues.push({
      problem: "Intensitas cahaya matahari berlebih (Lebih dari 50.000 Lux).",
      solution:
        "Gunakan paranet penghalang sinar matahari langsung pada jam-jam terik siang hari."
    });
  }

  if (issues.length === 0) {
    issues.push({
      problem: "Tidak ditemukan kendala signifikan pada parameter lingkungan.",
      solution: "Pertahankan kondisi perawatan dan monitoring secara berkala."
    });
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text("Analisis Kekurangan & Rekomendasi Solusi:", 14, 74);

  let issueY = 79;
  issues.slice(0, 2).forEach(item => {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(`• Kendala: ${item.problem}`, 14, issueY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(16, 185, 129);
    doc.text(`  Solusi: ${item.solution}`, 14, issueY + 4.5);
    issueY += 10;
  });

  // ==========================================
  // 5. Tabel Data Sensor Dinamis
  // ==========================================
  const showAll = filterState.selectedSensors.length === 0;
  const show = sensor =>
    showAll || filterState.selectedSensors.includes(sensor);

  const tableHeaders = ["Waktu", "Node"];
  if (show("temperature")) tableHeaders.push("Suhu (°C)");
  if (show("humidity")) tableHeaders.push("Kelembapan Udara (%)");
  if (show("soil")) tableHeaders.push("Kelembapan Tanah (%)");
  if (show("light")) tableHeaders.push("Cahaya (Lux)");
  if (show("rain")) tableHeaders.push("Status Hujan");
  if (showAll) {
    tableHeaders.push("Skor Kesehatan");
    tableHeaders.push("Status");
  }

  const tableRows = filteredData.map(item => {
    const row = [item.timestamp, item.node];
    if (show("temperature")) row.push(`${item.temperature} °C`);
    if (show("humidity")) row.push(`${item.humidity} %`);
    if (show("soil")) row.push(`${item.soil} %`);
    if (show("light")) row.push(`${item.light.toLocaleString()} lux`);
    if (show("rain")) row.push(item.rainStatus);
    if (showAll) {
      row.push(item.health);
      row.push(item.status);
    }
    return row;
  });

  autoTable(doc, {
    startY: issueY + 2,
    head: [tableHeaders],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "center"
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 28 }
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    didDrawPage: () => {
      const str = `Halaman ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        str,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }
  });

  // ==========================================
  // 6. Simpan File PDF
  // ==========================================
  const filename = `Laporan_Kesehatan_Kebun_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  doc.save(filename);
};
