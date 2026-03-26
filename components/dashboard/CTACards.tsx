"use client";

import { CalendarDays, Trophy } from "lucide-react";

interface CTACardsProps {
  onMonthlyUpdate: () => void;
  onAddMilestone: () => void;
}

export default function CTACards({ onMonthlyUpdate, onAddMilestone }: CTACardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        onClick={onMonthlyUpdate}
        className="group flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5 text-left transition-all hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900">Aggiornamento Mensile</h3>
          <p className="mt-1 text-sm text-blue-700/70">
            Carica bollette, fatture rifiuti e dati HR per aggiornare i tuoi indicatori.
          </p>
        </div>
      </button>

      <button
        onClick={onAddMilestone}
        className="group flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-left transition-all hover:border-emerald-300 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-emerald-900">Aggiungi Traguardo / Asset</h3>
          <p className="mt-1 text-sm text-emerald-700/70">
            Carica nuove certificazioni, policy o documenti di compliance.
          </p>
        </div>
      </button>
    </div>
  );
}
