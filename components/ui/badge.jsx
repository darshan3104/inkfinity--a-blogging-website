import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-violet-50 text-violet-700 border border-violet-200",
    secondary: "bg-slate-100 text-slate-700",
    destructive: "bg-red-50 text-red-700 border border-red-200",
    outline: "border border-slate-200 bg-white text-slate-700",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
