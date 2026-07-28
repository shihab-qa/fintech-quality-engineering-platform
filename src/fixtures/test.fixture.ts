import { test as base, expect } from "@playwright/test";
import { LoanClient } from "../api/loan.client.js";
import { DashboardPage } from "../pages/dashboard.page.js";
import { LoginPage } from "../pages/login.page.js";

interface PortfolioFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loanClient: LoanClient;
}

export const test = base.extend<PortfolioFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  loanClient: async ({ request }, use) => {
    await use(new LoanClient(request));
  },
});

export { expect };
