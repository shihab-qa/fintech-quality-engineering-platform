import { expect, type Locator, type Page } from '@playwright/test';
import type { CreateLoanRequest } from '../contracts/loan.contract.js';

export class DashboardPage {
  readonly heading: Locator;
  readonly applicantName: Locator;
  readonly amount: Locator;
  readonly termMonths: Locator;
  readonly purpose: Locator;
  readonly createButton: Locator;
  readonly applicationsTable: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Loan Applications' });
    this.applicantName = page.getByLabel('Applicant name');
    this.amount = page.getByLabel('Amount');
    this.termMonths = page.getByLabel('Term in months');
    this.purpose = page.getByLabel('Purpose');
    this.createButton = page.getByRole('button', { name: 'Create application' });
    this.applicationsTable = page.getByRole('table', { name: 'Loan applications' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard$/);
    await expect(this.heading).toBeVisible();
  }

  async createApplication(payload: CreateLoanRequest): Promise<void> {
    await this.applicantName.fill(payload.applicantName);
    await this.amount.fill(String(payload.amount));
    await this.termMonths.fill(String(payload.termMonths));
    await this.purpose.fill(payload.purpose);
    await this.createButton.click();
  }

  rowForApplicant(name: string): Locator {
    return this.applicationsTable.getByRole('row').filter({ hasText: name });
  }
}
