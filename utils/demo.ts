import type { Locator, Page } from '@playwright/test';

// All helpers are no-ops unless DEMO=1.
export const DEMO = !!process.env.DEMO;

const HOLD_MS = Number(process.env.DEMO_HOLD_MS ?? 800);

const COLORS = {
  checking: '#f5b800',
  pass: '#16a34a',
  fail: '#dc2626',
} as const;

export type HighlightState = keyof typeof COLORS;

export async function highlight(locator: Locator, state: HighlightState): Promise<void> {
  if (!DEMO) return;
  const color = COLORS[state];
  await locator
    .evaluate((el, c) => {
      const e = el as HTMLElement;
      e.scrollIntoView({ block: 'center', behavior: 'smooth' });
      e.style.outline = `4px solid ${c}`;
      e.style.outlineOffset = '3px';
      e.style.boxShadow = `0 0 0 8px ${c}33`;
      e.style.transition = 'outline-color .2s, box-shadow .2s';
    }, color)
    .catch(() => {});
  // eslint-disable-next-line playwright/no-wait-for-timeout -- demo only
  await locator.page().waitForTimeout(HOLD_MS);
}

export async function banner(page: Page, text: string, state: HighlightState = 'checking'): Promise<void> {
  if (!DEMO) return;
  await page
    .evaluate(
      ({ text, color }) => {
        let el = document.getElementById('__pw_demo_banner');
        if (!el) {
          el = document.createElement('div');
          el.id = '__pw_demo_banner';
          Object.assign(el.style, {
            position: 'fixed',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '2147483647',
            padding: '10px 18px',
            borderRadius: '8px',
            font: '600 16px system-ui, sans-serif',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(0,0,0,.25)',
            pointerEvents: 'none',
            maxWidth: '90vw',
          });
          document.body.appendChild(el);
        }
        el.textContent = text;
        el.style.background = color;
      },
      { text, color: COLORS[state] },
    )
    .catch(() => {});
}

export async function pause(page: Page, ms = HOLD_MS): Promise<void> {
  // eslint-disable-next-line playwright/no-wait-for-timeout -- demo only
  if (DEMO) await page.waitForTimeout(ms).catch(() => {});
}