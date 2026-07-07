import { Header } from "@/components/layout/header";
import { TrackedWallets } from "@/components/wallet/tracked-wallets";
import { WalletSearch } from "@/components/wallet/wallet-search";

/** Landing / search page. */
export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <HeroIris />
        <p className="rise mt-8 font-mono text-[11px] uppercase tracking-[0.32em] text-dim">
          Obs. 001 — Ethereum · Solana · Bitcoin
        </p>
        <h1 className="rise rise-1 mt-4 font-display text-5xl tracking-tight text-balance sm:text-6xl">
          See any wallet, <em className="text-brass italic">instantly</em>
        </h1>
        <p className="rise rise-2 mt-5 max-w-xl text-balance text-dim">
          Paste an Ethereum, Solana, or Bitcoin address for a unified analytics dashboard. No
          wallet connection, no private keys, no custody.
        </p>
        <div className="rise rise-3 mt-9 w-full">
          <WalletSearch autoFocus />
        </div>
        <TrackedWallets />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
          <span>Argus — nothing signed, nothing stored</span>
          <span>Panoptes station</span>
        </div>
      </footer>
    </>
  );
}

/** Large breathing iris — the observatory's instrument, watching. */
function HeroIris() {
  return (
    <svg aria-hidden viewBox="0 0 120 120" fill="none" className="iris rise size-24">
      <circle cx="60" cy="60" r="56" stroke="var(--brass)" strokeOpacity="0.25" strokeWidth="1" />
      <circle
        cx="60"
        cy="60"
        r="46"
        stroke="var(--brass)"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="2 6"
        className="iris-ring"
      />
      <circle cx="60" cy="60" r="34" stroke="var(--brass)" strokeOpacity="0.7" strokeWidth="1" />
      <circle
        cx="60"
        cy="60"
        r="24"
        stroke="var(--brass)"
        strokeWidth="1.2"
        strokeDasharray="10 5"
        className="iris-ring"
      />
      <circle cx="60" cy="60" r="13" fill="var(--brass)" fillOpacity="0.92" />
      <circle cx="64" cy="55" r="3.5" fill="var(--night)" />
      {/* meridian ticks */}
      <path d="M60 2 V10 M60 110 V118 M2 60 H10 M110 60 H118" stroke="var(--brass)" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  );
}
