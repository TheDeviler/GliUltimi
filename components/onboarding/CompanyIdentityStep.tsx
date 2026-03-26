"use client";

import type { CompanyProfile } from "@/lib/types";
import { ATECO_SECTORS } from "@/lib/constants";

interface Props {
  data: CompanyProfile;
  onUpdate: (data: CompanyProfile) => void;
}

export default function CompanyIdentityStep({ data, onUpdate }: Props) {
  const update = (field: keyof CompanyProfile, value: string | number) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Identità Aziendale</h2>
        <p className="mt-1 text-sm text-slate-500">
          Inserisci le informazioni di base della tua azienda.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Nome Azienda
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Es. Acme S.r.l."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Partita IVA
          </label>
          <input
            type="text"
            value={data.vatNumber}
            onChange={(e) => update("vatNumber", e.target.value)}
            placeholder="Es. IT12345678901"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Settore ATECO
          </label>
          <select
            value={data.atecoSector}
            onChange={(e) => update("atecoSector", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Seleziona settore...</option>
            {ATECO_SECTORS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Metratura Sede (mq)
          </label>
          <input
            type="number"
            value={data.officeSqm || ""}
            onChange={(e) => update("officeSqm", Number(e.target.value))}
            placeholder="Es. 500"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
