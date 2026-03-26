"use client";

import { Monitor, Server, Printer } from "lucide-react";
import type { HardwareBaseline } from "@/lib/types";

interface Props {
  data: HardwareBaseline;
  onUpdate: (data: HardwareBaseline) => void;
}

const fields: { key: keyof HardwareBaseline; label: string; icon: typeof Monitor; placeholder: string }[] = [
  { key: "pcStations", label: "N° Postazioni PC", icon: Monitor, placeholder: "Es. 25" },
  { key: "physicalServers", label: "N° Server Fisici", icon: Server, placeholder: "Es. 3" },
  { key: "printers", label: "N° Stampanti", icon: Printer, placeholder: "Es. 5" },
];

export default function HardwareBaselineStep({ data, onUpdate }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Baseline Asset</h2>
        <p className="mt-1 text-sm text-slate-500">
          Indica il numero di dispositivi hardware attivi nella sede.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Icon className="h-4 w-4 text-slate-400" />
              {label}
            </label>
            <input
              type="number"
              value={data[key] || ""}
              onChange={(e) => onUpdate({ ...data, [key]: Number(e.target.value) })}
              placeholder={placeholder}
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
