import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../src/fixtures/test.fixture.js';
import { env } from '../../src/utils/env.js';

test('critical lending screens have no serious or critical automated accessibility violations @a11y @regression', async ({
  page,
  loginPage,
  dashboardPage
}, testInfo) => {
  await loginPage.open();
  await loginPage.signIn(env.userEmail, env.userPassword);
  await dashboardPage.expectLoaded();

  const scan = await new AxeBuilder({ page }).analyze();
  const blocking = scan.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  );

  await testInfo.attach('axe-results', {
    body: JSON.stringify(scan, null, 2),
    contentType: 'application/json'
  });

  expect(blocking).toEqual([]);
});
