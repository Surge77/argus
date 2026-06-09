import { Header } from "@/components/layout/header";
import { WalletSearch } from "@/components/wallet/wallet-search";
import { WalletSidebar } from "@/components/wallet/wallet-sidebar";

/** Shared chrome for dashboard pages: header, search, and the wallet sidebar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-8">
          <WalletSearch />
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <WalletSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
