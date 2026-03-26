"use client";

import { useState } from "react";
import { X, Target } from "lucide-react";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (certificationId: string) => void;
}

const certificationOptions = [
  { id: "iso14001", label: "ISO 14001 (Gestione Ambientale)" },
  { id: "iso45001", label: "ISO 45001 (Salute e Sicurezza)" },
  { id: "iso9001", label: "ISO 9001 (Gestione Qualità)" },
  { id: "sa8000", label: "SA8000 (Responsabilità Sociale)" },
  { id: "bcorp", label: "Certificazione B Corp" },
];

export default function ComplianceModal({ isOpen, onClose, onAnalyze }: ComplianceModalProps) {
  const [selected, setSelected] = useState("");

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!selected) return;
    onAnalyze(selected);
    setSelected("");
  };

  const handleClose = () => {
    setSelected("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon + Title */}
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <Target className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Simulatore di Conformità ESG
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mb-6 text-sm leading-relaxed text-slate-500">
          Seleziona una certificazione target. L&apos;IA analizzerà il tuo stato attuale e ti dirà quanto sei distante dall&apos;obiettivo.
        </p>

        {/* Select dropdown */}
        <div className="mb-6">
          <label
            htmlFor="certification-select"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Obiettivo di certificazione
          </label>
          <select
            id="certification-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Seleziona un obiettivo...</option>
            {certificationOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action button */}
        <button
          onClick={handleAnalyze}
          disabled={!selected}
          className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Analizza Gap per l&apos;Obiettivo
        </button>
      </div>
    </div>
  );
}
