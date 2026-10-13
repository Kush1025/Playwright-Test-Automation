import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BoardPage } from '../pages/BoardPage';
import { credentials } from '../config/env';
import { banner, pause } from '../utils/demo';

type Fixtures = {
  loginPage: LoginPage;
  boardPage: BoardPage;
  loggedInBoard: BoardPage;
  demoVerdict: void;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  boardPage: async ({ page }, use) => {
    await use(new BoardPage(page));
  },
  loggedInBoard: async ({ loginPage, boardPage }, use) => {
    await loginPage.goto();
    await loginPage.login(credentials);
    await use(boardPage);
  },
  demoVerdict: [
    async ({ page }, use, testInfo) => {
      await use();
      const asExpected = testInfo.status === testInfo.expectedStatus;
      const failed = testInfo.status !== 'passed';
      const verdict = !asExpected
        ? failed
          ? '✗ FAILED'
          : '✗ PASSED, but was expected to fail'
        : failed
          ? '✗ FAILED, as expected'
          : '✓ PASSED';
      await banner(page, `${verdict} — ${testInfo.title}`, failed || !asExpected ? 'fail' : 'pass');
      await pause(page, failed || !asExpected ? 6000 : 2500);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
