/**
 * Server-side environment access. Required keys throw on first use with a clear message,
 * so a misconfigured deploy fails loudly instead of making silent bad requests.
 *
 * Only imported by route handlers and adapter fetchers (server), never by client code.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith("REPLACE_WITH_")) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.startsWith("REPLACE_WITH_")) return undefined;
  return value;
}

export const env = {
  get alchemyApiKey() {
    return required("ALCHEMY_API_KEY");
  },
  get heliusApiKey() {
    return required("HELIUS_API_KEY");
  },
  get upstashUrl() {
    return required("UPSTASH_REDIS_REST_URL");
  },
  get upstashToken() {
    return required("UPSTASH_REDIS_REST_TOKEN");
  },
  get etherscanApiKey() {
    return optional("ETHERSCAN_API_KEY");
  },
  get coingeckoApiKey() {
    return optional("COINGECKO_API_KEY");
  },
  get bitcoinApiBaseUrl() {
    return optional("BITCOIN_API_BASE_URL") ?? "https://blockstream.info/api";
  },
};
