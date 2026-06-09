import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TokenHolding } from "@/types";

/** Token holdings table. USD-less tokens render an explicit "—". */
export function TokenTable({ tokens }: { tokens: TokenHolding[] }) {
  if (tokens.length === 0) {
    return (
      <Card className="text-sm text-muted">No token holdings found.</Card>
    );
  }
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
            <th className="px-4 py-3 font-medium">Token</th>
            <th className="px-4 py-3 text-right font-medium">Balance</th>
            <th className="px-4 py-3 text-right font-medium">Value</th>
            <th className="px-4 py-3 text-right font-medium">24h</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.contractAddress ?? t.symbol} className="border-b border-border/50">
              <td className="px-4 py-3">
                <div className="font-medium">{t.symbol}</div>
                <div className="text-xs text-muted">{t.name}</div>
              </td>
              <td className="px-4 py-3 text-right font-mono tabular-nums">
                {Number(t.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </td>
              <td className="px-4 py-3 text-right font-mono tabular-nums">
                {t.usdValue === null ? "—" : formatCurrency(t.usdValue)}
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right font-mono tabular-nums",
                  t.priceChange24h === null
                    ? "text-muted"
                    : t.priceChange24h >= 0
                      ? "text-positive"
                      : "text-negative",
                )}
              >
                {t.priceChange24h === null ? "—" : formatPercent(t.priceChange24h)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
