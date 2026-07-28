import { randomUUID } from "node:crypto";
import type { CreateLoanRequest } from "../contracts/loan.contract.js";

export function buildLoan(
  overrides: Partial<CreateLoanRequest> = {},
): CreateLoanRequest {
  const suffix = randomUUID().slice(0, 8);

  return {
    applicantName: `Portfolio Applicant ${suffix}`,
    amount: 125_000,
    termMonths: 12,
    purpose: "Agricultural equipment financing",
    ...overrides,
  };
}
