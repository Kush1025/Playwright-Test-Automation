import { test } from '../fixtures/test';
import { invalidLogins } from '../data/loadTestData';

test.describe('Login: invalid credentials are rejected', { tag: '@login' }, () => {
  for (const { id, description, email, password } of invalidLogins) {
    test(`${id}: ${description}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.submit({ email, password });
      await loginPage.expectLoginRejected();
    });
  }
});