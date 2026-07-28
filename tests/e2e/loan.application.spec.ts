import { test, expect } from "../../src/fixtures/test.fixture.js";
import { assertLoanListContract } from "../../src/contracts/loan.contract.js";
import { buildLoan } from "../../src/test-data/loan.factory.js";
import { env } from "../../src/utils/env.js";

test("loan officer creates and submits an application @smoke @regression", async ({
  loginPage,
  dashboardPage,
  loanClient,
}) => {
  const payload = buildLoan({ amount: 240_000, termMonths: 18 });

  try {
    await loginPage.open();
    await loginPage.signIn(env.userEmail, env.userPassword);
    await dashboardPage.expectLoaded();
    await dashboardPage.createApplication(payload);

    const row = dashboardPage.rowForApplicant(payload.applicantName);
    await expect(row).toContainText(payload.applicantName);
    await expect(row).toContainText("240,000");
    await expect(row).toContainText("Draft");

    await row.getByRole("button", { name: "Submit" }).click();
    await expect(row).toContainText("Submitted");
  } finally {
    await loanClient.login(env.userEmail, env.userPassword);
    const listed = await loanClient.list();
    await expect(listed.response).toBeOK();
    assertLoanListContract(listed.body);
    const created = listed.body.items.find(
      (loan) => loan.applicantName === payload.applicantName,
    );
    if (created) await loanClient.remove(created.id);
  }
});
