import { expect, test, type Locator, type Page } from '@playwright/test';
import type { Credentials } from '../data/types';
import { banner, highlight } from '../utils/demo';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page
      .getByLabel(/email|user\s*name/i)
      .or(page.getByPlaceholder(/email|user\s*name/i))
      .first();
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /sign\s*in|log\s*in|login/i });
  }

  async goto(): Promise<void> {
    await test.step(
      'Open the login page',
      async () => {
        await this.page.goto('/');
        await expect(this.passwordInput).toBeVisible();
      },
      { box: true },
    );
  }

  async submit({ email, password }: Credentials): Promise<void> {
    await test.step(
      `Enter username "${email}"`,
      async () => {
        await highlight(this.emailInput, 'checking');
        await this.emailInput.fill(email);
        await highlight(this.emailInput, 'pass');
      },
      { box: true },
    );

    await test.step(
      'Enter password',
      async () => {
        await highlight(this.passwordInput, 'checking');
        await this.passwordInput.fill(password);
        await highlight(this.passwordInput, 'pass');
      },
      { box: true },
    );

    await test.step(
      'Click "Sign in"',
      async () => {
        await highlight(this.submitButton, 'checking');
        await this.submitButton.click();
      },
      { box: true },
    );
  }

  async login(credentials: Credentials): Promise<void> {
    await banner(this.page, 'Logging in…');
    await this.submit(credentials);

    await test.step(
      'Verify login succeeded',
      async () => {
        await expect(this.passwordInput, 'Login form should disappear after a successful login').toBeHidden();
        await banner(this.page, '✓ Logged in', 'pass');
      },
      { box: true },
    );
  }

  async expectLoginRejected(): Promise<void> {
    await test.step(
      'Verify login was rejected',
      async () => {
        // eslint-disable-next-line playwright/no-networkidle -- let an async login response arrive before asserting
        await this.page.waitForLoadState('networkidle');
        await expect(this.passwordInput, 'Login form should still be shown after invalid credentials').toBeVisible();
        await highlight(this.passwordInput, 'pass');
        await banner(this.page, '✓ Invalid login was rejected', 'pass');
      },
      { box: true },
    );
  }
}