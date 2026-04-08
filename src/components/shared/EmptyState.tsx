import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm",
        className,
      )}
    >
      <div className="mb-6 rounded-full bg-blue-50 p-4 text-blue-600">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
