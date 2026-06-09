import * as bitcoin from "bitcoinjs-lib";
import { PublicKey } from "@solana/web3.js";
import { isAddress } from "viem";
import { z } from "zod";

import type { Chain } from "@/types";

const ETH_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
// Base58 alphabet (no 0, O, I, l); Solana addresses are 32–44 chars.
const SOL_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * EIP-55 aware Ethereum check. `viem.isAddress` accepts all-lowercase, all-uppercase, and
 * correctly-checksummed mixed-case addresses, and rejects bad checksums.
 */
export function isEthereumAddress(value: string): boolean {
  if (!ETH_ADDRESS_RE.test(value)) return false;
  return isAddress(value, { strict: true });
}

/** Solana: a value that constructs a valid ed25519 `PublicKey`. */
export function isSolanaAddress(value: string): boolean {
  if (!SOL_ADDRESS_RE.test(value)) return false;
  try {
    // Throws on invalid base58 or wrong byte length.
    void new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

/** Bitcoin: legacy (P2PKH/P2SH) or bech32 (segwit) mainnet address. */
export function isBitcoinAddress(value: string): boolean {
  try {
    bitcoin.address.toOutputScript(value, bitcoin.networks.bitcoin);
    return true;
  } catch {
    return false;
  }
}

/** Returns the chain for an address, or null if it matches none. ETH is checked first. */
export function detectChain(value: string): Chain | null {
  const trimmed = value.trim();
  if (isEthereumAddress(trimmed)) return "ethereum";
  if (isBitcoinAddress(trimmed)) return "bitcoin";
  if (isSolanaAddress(trimmed)) return "solana";
  return null;
}

/**
 * Zod schema that accepts any address resolvable to a supported chain. Use at every
 * boundary (route handlers, forms) before any downstream call.
 */
export const addressSchema = z
  .string()
  .trim()
  .refine((value) => detectChain(value) !== null, {
    message: "Not a valid Ethereum, Solana, or Bitcoin address",
  });

export interface DetectedAddress {
  address: string;
  chain: Chain;
}

/** Parse + detect in one step. Returns the trimmed address and its chain, or null. */
export function parseAddress(value: string): DetectedAddress | null {
  const result = addressSchema.safeParse(value);
  if (!result.success) return null;
  const address = result.data;
  const chain = detectChain(address);
  return chain ? { address, chain } : null;
}
