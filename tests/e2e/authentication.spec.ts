import { test, expect } from '../../src/fixtures/test.fixture.js';
import { env } from '../../src/utils/env.js';

test.describe('Authentication @e2e', () => {
  test('authorized user reaches the lending dashboard @smoke', async ({ loginPage, dashboardPage }) => {
    await test.step('Open the secure portal', async () => {
      await loginPage.open();
    });

    await test.step('Authenticate with an authorized account', async () => {
      await loginPage.signIn(env.userEmail, env.userPassword);
    });

    await test.step('Verify access to the application workspace', async () => {
      await dashboardPage.expectLoaded();
    });
  });

  test('invalid credentials return a non-enumerating error @regression @negative', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.signIn('unknown@example.test', 'Incorrect!123');

    await expect(loginPage.alert).toHaveText('Unable to sign in with the provided credentials.');
    await expect(page).toHaveURL(/\/login$/);
  });
});
