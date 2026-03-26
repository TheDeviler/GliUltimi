"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-emerald-600 text-white",
                  isCurrent && "bg-emerald-600 text-white ring-4 ring-emerald-100",
                  !isCompleted && !isCurrent && "bg-slate-200 text-slate-500"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  isCurrent ? "text-slate-900" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 sm:w-16",
                  isCompleted ? "bg-emerald-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
