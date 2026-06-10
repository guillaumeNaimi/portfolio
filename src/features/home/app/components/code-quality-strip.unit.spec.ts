import { describe, expect, it } from "vitest";

import { fmtBundle } from "./code-quality-strip";

describe("fmtBundle", () => {
  it("returns empty string for 0", () => {
    expect(fmtBundle(0)).toBe("");
  });

  it("returns empty string for negative values", () => {
    expect(fmtBundle(-1)).toBe("");
  });

  it("returns empty string for NaN", () => {
    expect(fmtBundle(NaN)).toBe("");
  });

  it("returns empty string for Infinity", () => {
    expect(fmtBundle(Infinity)).toBe("");
  });

  it("uses toFixed(1) below 100", () => {
    expect(fmtBundle(42.567)).toBe("42.6");
    expect(fmtBundle(99.94)).toBe("99.9");
  });

  it("rounds to integer at exactly 100", () => {
    expect(fmtBundle(100)).toBe("100");
  });

  it("rounds to integer above 100", () => {
    expect(fmtBundle(123.7)).toBe("124");
    expect(fmtBundle(999.4)).toBe("999");
  });

  it("handles the 99.95 boundary (rounds up via toFixed)", () => {
    expect(fmtBundle(99.95)).toBe("100.0");
  });
});
