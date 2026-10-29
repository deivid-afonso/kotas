import { describe, expect, it } from "vitest";
import { brl, formatDate } from "../utils";

describe("brl", () => {
  it("formats positive values", () => {
    expect(brl(1308.8)).toContain("1.308,80");
  });

  it("formats zero", () => {
    expect(brl(0)).toContain("0,00");
  });
});

describe("formatDate", () => {
  it("formats ISO date to pt-BR", () => {
    expect(formatDate("2025-02-14")).toBe("14/02/2025");
  });
});
