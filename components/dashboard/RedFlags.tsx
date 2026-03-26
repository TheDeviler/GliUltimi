import { AlertTriangle } from "lucide-react";
import type { RedFlag } from "@/lib/types";

interface RedFlagsProps {
  flags: RedFlag[];
}

export default function RedFlags({ flags }: RedFlagsProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h3 className="font-semibold text-red-900">Red Flags — Gap Critici</h3>
      </div>
      <div className="space-y-3">
        {flags.map((flag) => (
          <div key={flag.id} className="rounded-lg border border-red-200 bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-red-800">{flag.title}</p>
                <p className="mt-1 text-xs text-red-600/80">{flag.description}</p>
              </div>
              <span className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {flag.pillar}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
