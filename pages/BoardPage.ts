import { expect, test, type Locator, type Page } from '@playwright/test';
import { BOARD_COLUMNS, type BoardColumn } from '../data/types';
import { banner, highlight } from '../utils/demo';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class BoardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  projectNavItem(project: string): Locator {
    return this.page
      .getByRole('button', { name: project })
      .or(this.page.getByRole('link', { name: project }))
      .or(this.page.getByText(project, { exact: true }))
      .first();
  }

  async openProject(project: string): Promise<void> {
    await test.step(
      `Open project "${project}"`,
      async () => {
        await banner(this.page, `Opening "${project}"…`);
        const navItem = this.projectNavItem(project);
        await highlight(navItem, 'checking');
        await navItem.click();
        await expect(this.columnHeading('To Do')).toBeVisible();
        await banner(this.page, `✓ Opened "${project}"`, 'pass');
      },
      { box: true },
    );
  }

  columnHeading(column: BoardColumn): Locator {
    return this.page.getByText(new RegExp(`^\\s*${escapeRegExp(column)}(\\s*\\(?\\d+\\)?)?\\s*$`)).first();
  }

  // Outermost element holding this column's heading and no other column's heading.
  column(column: BoardColumn): Locator {
    let locator = this.page.locator('div, section').filter({ has: this.columnHeading(column) });
    for (const other of BOARD_COLUMNS.filter((c) => c !== column)) {
      locator = locator.filter({ hasNot: this.columnHeading(other) });
    }
    return locator.first();
  }

  // The card is the outermost element containing exactly one card title, so tags on
  // neighbouring cards in the same column can never be matched.
  private async taskCard(column: BoardColumn, task: string): Promise<Locator> {
    const columnLocator = this.column(column);
    const title = columnLocator.getByText(task, { exact: true }).first();
    await expect(title, `"${task}" should be in the "${column}" column`).toBeVisible();

    const titleSelector = await title.evaluate((el) =>
      [el.tagName.toLowerCase(), ...Array.from(el.classList).map((c) => `.${CSS.escape(c)}`)].join(''),
    );

    const candidates = columnLocator
      .locator('*')
      .filter({ has: this.page.getByText(task, { exact: true }) })
      .filter({ hasNot: this.columnHeading(column) });

    const count = await candidates.count();
    for (let i = 0; i < count; i++) {
      const candidate = candidates.nth(i);
      if ((await candidate.locator(titleSelector).count()) === 1) return candidate;
    }
    return title.locator('xpath=..');
  }

  async expectTaskInColumn(column: BoardColumn, task: string): Promise<Locator> {
    return test.step(
      `Verify "${task}" is in the "${column}" column`,
      async () => {
        await banner(this.page, `Checking "${task}" is in "${column}"…`);
        const columnLocator = this.column(column);
        await highlight(columnLocator, 'checking');
        try {
          const card = await this.taskCard(column, task);
          await highlight(columnLocator, 'pass');
          await highlight(card, 'pass');
          await banner(this.page, `✓ "${task}" is in "${column}"`, 'pass');
          return card;
        } catch (error) {
          await highlight(columnLocator, 'fail');
          await banner(this.page, `✗ "${task}" not found in "${column}"`, 'fail');
          throw error;
        }
      },
      { box: true },
    );
  }

  async expectTags(card: Locator, tags: string[]): Promise<void> {
    for (const tag of tags) {
      await test.step(
        `Verify tag "${tag}"`,
        async () => {
          await banner(this.page, `Checking tag "${tag}"…`);
          const tagLocator = card.getByText(tag, { exact: true });
          try {
            await expect(tagLocator, `Card should have tag "${tag}"`).toBeVisible();
          } catch (error) {
            await highlight(card, 'fail');
            await banner(this.page, `✗ Tag "${tag}" missing`, 'fail');
            throw error;
          }
          await highlight(tagLocator, 'checking');
          await highlight(tagLocator, 'pass');
          await banner(this.page, `✓ Tag "${tag}" found`, 'pass');
        },
        { box: true },
      );
    }
  }
}