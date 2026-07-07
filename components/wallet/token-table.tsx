import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TokenHolding } from "@/types";

/** Token holdings table. USD-less tokens render an explicit "—". */
export function TokenTable({ tokens }: { tokens: TokenHolding[] }) {
  if (tokens.length === 0) {
    return <Card className="text-sm text-dim">No token holdings found.</Card>;
  }
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            <th className="px-4 py-3 font-normal">Token</th>
            <th className="px-4 py-3 text-right font-normal">Balance</th>
            <th className="px-4 py-3 text-right font-normal">Value</th>
            <th className="px-4 py-3 text-right font-normal">24h</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr
              key={t.contractAddress ?? t.symbol}
              className="border-b border-line/50 transition-colors hover:bg-raised/60"
            >
              <td className="px-4 py-3">
                <div className="font-mono font-bold">{t.symbol}</div>
                <div className="text-xs text-dim">{t.name}</div>
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
                    ? "text-dim"
                    : t.priceChange24h >= 0
                      ? "text-up"
                      : "text-down",
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
