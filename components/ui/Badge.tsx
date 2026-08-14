import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-sky-950/80 text-sky-300 border border-sky-800/50",
        secondary: "border-transparent bg-slate-800 text-slate-300 border border-slate-700",
        teal: "border-transparent bg-teal-950/80 text-teal-300 border border-teal-800/50",
        emerald: "border-transparent bg-emerald-950/80 text-emerald-300 border border-emerald-800/50",
        amber: "border-transparent bg-amber-950/80 text-amber-300 border border-amber-800/50",
        rose: "border-transparent bg-rose-950/80 text-rose-300 border border-rose-800/50",
        purple: "border-transparent bg-purple-950/80 text-purple-300 border border-purple-800/50",
        outline: "text-slate-300 border border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
