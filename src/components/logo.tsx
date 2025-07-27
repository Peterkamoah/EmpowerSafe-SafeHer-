import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-headline text-3xl font-bold text-primary",
        className
      )}
    >
      <ShieldCheck className="h-8 w-8" />
      <span>EmpowerSafe</span>
    </div>
  );
}
