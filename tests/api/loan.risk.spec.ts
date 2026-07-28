import { test, expect } from '../../src/fixtures/test.fixture.js';
import { buildLoan } from '../../src/test-data/loan.factory.js';
import { env } from '../../src/utils/env.js';

test.describe('Loan API risk controls @api @regression', () => {

  test('rejects access without a bearer token @smoke @negative', async ({ request }) => {
    const response = await request.get('/api/loans');
    expect(response.status()).toBe(401);
    expect(await response.json()).toMatchObject({ error: 'UNAUTHORIZED' });
  });

  test.beforeEach(async ({ loanClient }) => {
    await loanClient.login(env.userEmail, env.userPassword);
  });

  test('rejects a non-positive loan amount @negative', async ({ loanClient }) => {
    const result = await loanClient.create(buildLoan({ amount: 0 }));
    expect(result.response.status()).toBe(400);
    expect(result.body).toMatchObject({ error: 'VALIDATION_ERROR' });
  });

  test('blocks an invalid Draft to Approved transition @negative', async ({ loanClient }) => {
    const created = await loanClient.create(buildLoan());
    await expect(created.response).toBeOK();

    try {
      const transition = await loanClient.transition(created.body.id, 'Approved');
      expect(transition.response.status()).toBe(409);
      expect(transition.body).toMatchObject({ error: 'INVALID_STATE_TRANSITION' });
    } finally {
      await loanClient.remove(created.body.id);
    }
  });
});
