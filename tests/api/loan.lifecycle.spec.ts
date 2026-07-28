import { test, expect } from '../../src/fixtures/test.fixture.js';
import { assertLoanContract, assertLoginContract } from '../../src/contracts/loan.contract.js';
import { buildLoan } from '../../src/test-data/loan.factory.js';
import { env } from '../../src/utils/env.js';

test.describe('Loan API lifecycle @api @regression', () => {
  test('creates, retrieves, submits, approves, and removes a loan application @smoke', async ({ loanClient }) => {
    const login = await loanClient.login(env.userEmail, env.userPassword);
    assertLoginContract(login);

    const payload = buildLoan();
    const created = await loanClient.create(payload);
    await expect(created.response).toBeOK();
    assertLoanContract(created.body);
    expect(created.body).toMatchObject({ ...payload, status: 'Draft' });

    try {
      const retrieved = await loanClient.get(created.body.id);
      await expect(retrieved.response).toBeOK();
      assertLoanContract(retrieved.body);
      expect(retrieved.body.id).toBe(created.body.id);

      const submitted = await loanClient.transition(created.body.id, 'Submitted');
      await expect(submitted.response).toBeOK();
      assertLoanContract(submitted.body);
      expect(submitted.body.status).toBe('Submitted');

      const approved = await loanClient.transition(created.body.id, 'Approved');
      await expect(approved.response).toBeOK();
      assertLoanContract(approved.body);
      expect(approved.body.status).toBe('Approved');
    } finally {
      const cleanup = await loanClient.remove(created.body.id);
      expect([204, 404]).toContain(cleanup.status());
    }
  });
});
