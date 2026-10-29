import { describe, expect, it } from "vitest";
import { services, participants, charges } from "../data";

describe("demo data integrity", () => {
  it("all services have positive values", () => {
    for (const s of services) {
      expect(s.annualValue).toBeGreaterThan(0);
      expect(s.chargeValue).toBeGreaterThan(0);
      expect(s.seats).toBeGreaterThan(0);
    }
  });

  it("participant service references are valid", () => {
    const ids = new Set(services.map((s) => s.id));
    for (const p of participants) {
      for (const sid of p.services) {
        expect(ids.has(sid)).toBe(true);
      }
    }
  });

  it("charges have valid participant references", () => {
    const pIds = new Set(participants.map((p) => p.id));
    for (const c of charges) {
      expect(pIds.has(c.participantId)).toBe(true);
    }
  });

  it("charge statuses are valid", () => {
    const valid = new Set(["pago", "pendente", "vencido", "cancelado"]);
    for (const c of charges) {
      expect(valid.has(c.status)).toBe(true);
    }
  });
});
