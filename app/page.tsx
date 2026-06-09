import { Header } from "@/components/layout/header";
import { TrackedWallets } from "@/components/wallet/tracked-wallets";
import { WalletSearch } from "@/components/wallet/wallet-search";

/** Landing / search page. */
export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 inline-block rounded-sm border border-border px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
          Read-only · Multi-chain
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          See any wallet, instantly
        </h1>
        <p className="mt-4 max-w-xl text-balance text-muted">
          Paste an Ethereum, Solana, or Bitcoin address for a unified analytics dashboard.
          No wallet connection, no private keys, no custody.
        </p>
        <div className="mt-8 w-full">
          <WalletSearch autoFocus />
        </div>
        <TrackedWallets />
      </main>
    </>
  );
}
