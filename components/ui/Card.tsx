import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className, title, description }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
