import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "good" | "warning" | "critical";
  children: React.ReactNode;
  className?: string;
}

const badgeStyles = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
