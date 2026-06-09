import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatPercent,
  truncateAddress,
  truncateForLog,
} from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats USD with two decimals by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("respects a custom fraction-digit cap", () => {
    expect(formatCurrency(0.123456, { maximumFractionDigits: 4 })).toBe("$0.1235");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("formatPercent", () => {
  it("prefixes a plus sign for positive change", () => {
    expect(formatPercent(2.34)).toBe("+2.34%");
  });

  it("keeps the minus sign for negative change", () => {
    expect(formatPercent(-1.5)).toBe("-1.50%");
  });

  it("does not sign zero", () => {
    expect(formatPercent(0)).toBe("0.00%");
  });
});

describe("truncateAddress", () => {
  it("shortens a long address to head…tail", () => {
    expect(truncateAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045")).toBe(
      "0xd8da…6045",
    );
  });

  it("returns short values unchanged", () => {
    expect(truncateAddress("0x1234")).toBe("0x1234");
  });
});

describe("truncateForLog", () => {
  it("uses an 8+4 window distinct from the UI format", () => {
    expect(truncateForLog("0xd8da6bf26964af9d7eed9e03e53415d37aa96045")).toBe(
      "0xd8da6b…6045",
    );
  });
});
