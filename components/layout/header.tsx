import Link from "next/link";

/** Concentric-ring eye mark — Argus Panoptes, the all-seeing watchman. */
export function IrisMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="14" stroke="var(--brass)" strokeOpacity="0.5" strokeWidth="1" />
      <circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="var(--brass)"
        strokeWidth="1"
        strokeDasharray="3 4"
        className="iris-ring"
      />
      <circle cx="16" cy="16" r="4.5" fill="var(--brass)" />
      <circle cx="17.5" cy="14.5" r="1.3" fill="var(--night)" />
    </svg>
  );
}

/** Top bar with the wordmark, linking home. */
export function Header() {
  return (
    <header className="border-b border-line bg-night/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <IrisMark />
          <span className="font-display text-2xl tracking-tight">
            Argus
            <span className="ml-2.5 hidden font-mono text-[10px] tracking-[0.3em] text-dim uppercase sm:inline">
              The all-seeing ledger
            </span>
          </span>
        </Link>
        <span className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
          Read-only
        </span>
      </div>
    </header>
  );
}
