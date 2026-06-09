import { cn } from "@/lib/utils";

/** Surface container with the ChainLens 4px-radius, bordered look. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border bg-surface p-5",
        className,
      )}
      {...props}
    />
  );
}
