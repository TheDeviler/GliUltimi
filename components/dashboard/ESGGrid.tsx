"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import ESGBarChart from "./ESGBarChart";
import { PILLAR_COLORS, PILLAR_LABELS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import type { ESGPillarData } from "@/lib/types";

interface ESGGridProps {
  pillars: ESGPillarData[];
}

const pillarProgressColor: Record<string, "emerald" | "blue" | "purple"> = {
  E: "emerald",
  S: "blue",
  G: "purple",
};

export default function ESGGrid({ pillars }: ESGGridProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">ESG Dashboard</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {pillars.map((pillar) => {
          const colors = PILLAR_COLORS[pillar.pillar];
          return (
            <Card key={pillar.pillar} className="overflow-hidden">
              <div className={`-mx-6 -mt-6 mb-4 px-6 py-3 ${colors.bg}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${colors.text}`}>
                    {PILLAR_LABELS[pillar.pillar]}
                  </h3>
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    {pillar.score}
                  </span>
                </div>
                <ProgressBar
                  value={pillar.score}
                  color={pillarProgressColor[pillar.pillar]}
                  className="mt-2"
                />
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                {pillar.metrics.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {formatNumber(m.value)} {m.unit}
                      </span>
                      <Badge variant={m.status}>
                        {m.status === "good" ? "OK" : m.status === "warning" ? "!" : "!!"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <ESGBarChart
                data={pillar.chartData}
                color={colors.chart}
                label="Trend Ultimi 6 Mesi"
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
