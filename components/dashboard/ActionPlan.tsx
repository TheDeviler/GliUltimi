import { TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ActionItem } from "@/lib/types";

interface ActionPlanProps {
  actions: ActionItem[];
}

const priorityStyles = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  low: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function ActionPlan({ actions }: ActionPlanProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-slate-900">Action Plan — Analisi ROI</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-slate-900">{action.title}</h4>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${priorityStyles[action.priority]}`}
                  >
                    {action.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{action.description}</p>
              </div>
              <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {action.pillar}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                Costo: {formatCurrency(action.estimatedCost)}
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              {action.estimatedSavings > 0 ? (
                <>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                    Risparmio: {formatCurrency(action.estimatedSavings)}/anno
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700">
                    Payback: {action.paybackMonths} mesi
                  </span>
                </>
              ) : (
                <span className="rounded-md bg-purple-50 px-2 py-1 font-medium text-purple-700">
                  Compliance obbligatoria
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
