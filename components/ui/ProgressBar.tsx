import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "emerald" | "blue" | "purple" | "red" | "yellow";
  className?: string;
  showLabel?: boolean;
}

const colorStyles = {
  emerald: "bg-emerald-600",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  red: "bg-red-600",
  yellow: "bg-yellow-500",
};

export default function ProgressBar({
  value,
  max = 100,
  color = "emerald",
  className,
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={cn("h-2 rounded-full transition-all duration-500", colorStyles[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-600">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
