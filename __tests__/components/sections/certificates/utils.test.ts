import {
  formatCertDate,
  getCertificateStatus,
  sortCertificates,
} from "@/components/sections/certificates/utils";
import type { Certificate } from "@/lib/types";

const cert = (overrides: Partial<Certificate>): Certificate => ({
  id: "c",
  name: "Cert",
  issuer: "Issuer",
  issueDate: "2024-03-01",
  ...overrides,
});

describe("certificate utils", () => {
  const now = new Date("2026-06-01");

  it("formats dates as short month + year and ignores bad input", () => {
    expect(formatCertDate("2024-03-15")).toBe("Mar 2024");
    expect(formatCertDate("not-a-date")).toBe("");
    expect(formatCertDate(undefined)).toBe("");
  });

  it("derives status from lifetime flag and expiration date", () => {
    expect(getCertificateStatus(cert({ isLifetime: true, expirationDate: "2020-01-01" }), now)).toBe("lifetime");
    expect(getCertificateStatus(cert({}), now)).toBe("lifetime");
    expect(getCertificateStatus(cert({ expirationDate: "2027-01-01" }), now)).toBe("active");
    expect(getCertificateStatus(cert({ expirationDate: "2025-01-01" }), now)).toBe("expired");
  });

  it("sorts newest first with undated certificates last", () => {
    const sorted = sortCertificates([
      cert({ id: "old", issueDate: "2022-01-01" }),
      cert({ id: "bad", issueDate: "" }),
      cert({ id: "new", issueDate: "2025-05-01" }),
    ]);
    expect(sorted.map((c) => c.id)).toEqual(["new", "old", "bad"]);
  });
});
