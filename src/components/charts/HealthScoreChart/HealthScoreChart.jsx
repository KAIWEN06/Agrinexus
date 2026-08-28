import React from "react";
import { Activity, Lightbulb, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";

export default function HealthScoreChart({
  score = 0,
  status = "Tidak Diketahui",
  severity = "Normal",
  description = "",
  insights = [],
  reasoning = null,
}) {
  const getBadgeStyle = () => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (score >= 60) return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-rose-50 text-rose-700 border border-rose-200";
  };

  const getProgressBarColor = () => {
    if (score >= 80) return "bg-emerald-600";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-600";
  };

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case "kritis":
        return "bg-red-50 text-red-700 border-red-200";
      case "tinggi":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "sedang":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all">
      {/* Header Card */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Indeks Kesehatan Perkebunan
        </h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      {/* Skor Utama */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-gray-900">
          {score}
        </span>
        <span className="text-sm font-medium text-gray-400">/100</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>

      {/* Status & Deskripsi Node */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${getBadgeStyle()}`}>
            {reasoning?.overall_status || status}
          </span>
          {reasoning?.severity && reasoning.severity !== "Normal" && (
            <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium ${getSeverityBadge(reasoning.severity)}`}>
              Keparahan: {reasoning.severity}
            </span>
          )}
        </div>
        {description && (
          <span className="text-xs text-gray-500">
            {description}
          </span>
        )}
      </div>

      <hr className="my-5 border-gray-100" />

      {/* Bagian Rekomendasi / Tindakan Petani */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Panduan & Analisis Tindakan:</span>
        </div>

        <div className="mt-3 space-y-3">
          {/* RENDER DARI OBJ REASONING ENGINE BARU */}
          {reasoning ? (
            <div className="space-y-3 text-xs sm:text-sm">
              {/* Root Cause Card */}
              {reasoning.main_problem && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-amber-900">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-950">{reasoning.main_problem}</p>
                      <p className="mt-0.5 text-xs text-amber-800">{reasoning.root_cause}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Impact Prediction */}
              {reasoning.prediction && (
                <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-gray-700">
                  <p className="font-medium text-xs">🔮 <span className="font-semibold text-gray-900">Prediksi Dampak:</span> {reasoning.prediction}</p>
                </div>
              )}

              {/* Step-by-Step Recommendations */}
              {reasoning.recommendation && reasoning.recommendation.length > 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                  <p className="font-semibold text-emerald-950 mb-1.5">🛠️ Langkah Penanganan Bertahap:</p>
                  <ul className="space-y-1 list-disc list-inside text-xs text-emerald-900">
                    {reasoning.recommendation.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Continuous Farmer Guidance */}
              {reasoning.farmer_guidance && reasoning.farmer_guidance.length > 0 && (
                <div className="space-y-1 pt-1 text-xs text-gray-500">
                  {reasoning.farmer_guidance.map((guide, idx) => (
                    <p key={idx}>{guide}</p>
                  ))}
                </div>
              )}
            </div>
          ) : insights && insights.length > 0 ? (
            /* FALLBACK RENDER DARI INSIGHTS LAMA */
            insights.map((item, idx) => (
              <div
                key={`${item.parameter}-${idx}`}
                className={`rounded-lg p-3 text-xs sm:text-sm border ${
                  item.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : item.type === "danger"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : item.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-blue-50 border-blue-200 text-blue-900"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {item.type === "warning" || item.type === "danger" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  ) : item.type === "success" ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  )}

                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-gray-900">
                      {item.parameter}: <span className="font-normal text-gray-700">{item.issue}</span>
                    </p>
                    <p className="font-medium text-emerald-700">
                      💡 Solusi: {item.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* DEFAULT TEXT SESUAI KONDISI SKOR */
            <p className="text-xs text-gray-500">
              {score < 100
                ? "Memproses analisis parameter yang mengalami penyimpangan..."
                : "Sistem tidak mendeteksi anomali. Semua indikator dalam batas normal."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}