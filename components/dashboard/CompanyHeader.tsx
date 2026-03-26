"use client";

import { FileText, Leaf } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ESGScoreRing from "./ESGScoreRing";
import type { ESGScore } from "@/lib/types";

interface CompanyHeaderProps {
  companyName: string;
  score: ESGScore;
}

function getStatus(score: number): { label: string; variant: "good" | "warning" | "critical" } {
  if (score >= 75) return { label: "Good", variant: "good" };
  if (score >= 50) return { label: "Medium", variant: "warning" };
  return { label: "Critical", variant: "critical" };
}

export default function CompanyHeader({ companyName, score }: CompanyHeaderProps) {
  const status = getStatus(score.overall);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <ESGScoreRing score={score.overall} />
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">{companyName || "La Tua Azienda"}</h1>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-slate-500">ESG Score</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-slate-400">
            <span>E: {score.environmental}</span>
            <span>S: {score.social}</span>
            <span>G: {score.governance}</span>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={() => window.print()}
        className="shrink-0"
      >
        <FileText className="h-4 w-4" />
        Genera Report PDF per Banca
      </Button>
    </div>
  );
}
