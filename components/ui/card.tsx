import { cn } from "@/lib/utils";

/** Lens plate: bordered surface with brass viewfinder corner brackets. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  // min-w-0 lets cards shrink below their content's min-content width inside
  // grid/flex tracks (Recharts otherwise forces horizontal overflow on mobile).
  return <div className={cn("lens min-w-0 rounded-sm p-5", className)} {...props} />;
}
