"use client";

import FileDropZone from "@/components/ui/FileDropZone";
import { DOCUMENT_TYPES } from "@/lib/constants";

interface Props {
  onFilesChange: (files: File[]) => void;
}

export default function DocumentUploadStep({ onFilesChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Documenti Fondativi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Carica i documenti aziendali per l&apos;analisi ESG iniziale.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Documenti richiesti:</p>
        <ul className="space-y-1">
          {DOCUMENT_TYPES.map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      <FileDropZone
        onFilesChange={onFilesChange}
        label="Trascina i documenti qui o clicca per selezionare"
        maxFiles={5}
      />
    </div>
  );
}
