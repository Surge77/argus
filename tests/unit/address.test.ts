import { describe, expect, it } from "vitest";

import {
  detectChain,
  isBitcoinAddress,
  isEthereumAddress,
  isSolanaAddress,
  parseAddress,
} from "@/lib/validators/address";

const ETH_CHECKSUMMED = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const ETH_LOWERCASE = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
const ETH_BAD_CHECKSUM = "0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const SOL_VALID = "So11111111111111111111111111111111111111112";
const BTC_LEGACY = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const BTC_BECH32 = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4";

describe("isEthereumAddress", () => {
  it("accepts a correctly checksummed address", () => {
    expect(isEthereumAddress(ETH_CHECKSUMMED)).toBe(true);
  });

  it("accepts an all-lowercase address", () => {
    expect(isEthereumAddress(ETH_LOWERCASE)).toBe(true);
  });

  it("rejects an address with an invalid EIP-55 checksum", () => {
    expect(isEthereumAddress(ETH_BAD_CHECKSUM)).toBe(false);
  });

  it("rejects the wrong length and non-hex input", () => {
    expect(isEthereumAddress("0x123")).toBe(false);
    expect(isEthereumAddress("not-an-address")).toBe(false);
  });
});

describe("isSolanaAddress", () => {
  it("accepts a valid base58 public key", () => {
    expect(isSolanaAddress(SOL_VALID)).toBe(true);
  });

  it("rejects too-short and non-base58 input", () => {
    expect(isSolanaAddress("abc")).toBe(false);
    expect(isSolanaAddress("0OIl0OIl0OIl0OIl0OIl0OIl0OIl0OIl")).toBe(false);
  });
});

describe("isBitcoinAddress", () => {
  it("accepts a legacy P2PKH address", () => {
    expect(isBitcoinAddress(BTC_LEGACY)).toBe(true);
  });

  it("accepts a bech32 segwit address", () => {
    expect(isBitcoinAddress(BTC_BECH32)).toBe(true);
  });

  it("rejects an address with a bad checksum", () => {
    expect(isBitcoinAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb")).toBe(false);
    expect(isBitcoinAddress("garbage")).toBe(false);
  });
});

describe("detectChain", () => {
  it("detects each chain", () => {
    expect(detectChain(ETH_CHECKSUMMED)).toBe("ethereum");
    expect(detectChain(SOL_VALID)).toBe("solana");
    expect(detectChain(BTC_LEGACY)).toBe("bitcoin");
    expect(detectChain(BTC_BECH32)).toBe("bitcoin");
  });

  it("trims surrounding whitespace", () => {
    expect(detectChain(`  ${ETH_LOWERCASE}  `)).toBe("ethereum");
  });

  it("returns null for an unrecognised string", () => {
    expect(detectChain("hello world")).toBeNull();
  });
});

describe("parseAddress", () => {
  it("returns the trimmed address and chain", () => {
    expect(parseAddress(`  ${SOL_VALID} `)).toEqual({
      address: SOL_VALID,
      chain: "solana",
    });
  });

  it("returns null for invalid input", () => {
    expect(parseAddress("nope")).toBeNull();
  });
});
