import { cn } from "@/lib/utils";

/** Fixed-dimension loading placeholder (prevents layout shift). */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-surface-elevated", className)}
      {...props}
    />
  );
}
