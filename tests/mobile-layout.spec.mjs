import { test, expect } from '@playwright/test'

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'

for (const [width, height] of [[320, 568], [375, 667], [667, 375]]) {
  test.describe(`phone ${width}x${height}`, () => {
    test.use({ viewport: { width, height }, isMobile: true, deviceScaleFactor: 2 })

    test('home action does not overlap its footer', async ({ page }) => {
      await page.goto(base + '/')
      const start = await page.getByRole('link', { name: 'START' }).boundingBox()
      const footer = await page.getByText('SERVER ONLINE').locator('..').locator('..').boundingBox()
      expect(start).not.toBeNull()
      expect(footer).not.toBeNull()
      const intersect = start.x < footer.x + footer.width && start.x + start.width > footer.x &&
        start.y < footer.y + footer.height && start.y + start.height > footer.y
      expect(intersect).toBe(false)
      expect(start.x + start.width).toBeLessThanOrEqual(width)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    })

    test('story action remains within the scrollable page', async ({ page }) => {
      await page.goto(base + '/story/')
      await page.getByRole('button', { name: 'NEXT STAGE' }).click()
      const action = page.getByRole('link', { name: 'CONTINUE' })
      const clipped = await action.evaluate(el => {
        let ancestor = el.parentElement
        while (ancestor) {
          const overflow = getComputedStyle(ancestor).overflowY
          if (['hidden', 'clip'].includes(overflow) &&
            ancestor.getBoundingClientRect().bottom < el.getBoundingClientRect().bottom - 1) return true
          ancestor = ancestor.parentElement
        }
        return false
      })
      expect(clipped).toBe(false)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await action.click()
      await expect(page).toHaveURL(/\/chapter\//)
    })

    test('game tasks and PDA tabs stay within the viewport', async ({ page }) => {
      await page.goto(base + '/game/')
      for (let i = 0; i < 12 && await page.getByText('Meet with the community').count() === 0; i++) {
        await page.locator('[class*="pointer-events-auto"][class*="max-w-5xl"] > div').click()
      }
      await expect(page.getByText('Meet with the community')).toBeVisible()
      const panel = page.getByText('Meet with the community').locator('..').locator('..')
      await expect.poll(async () => (await panel.boundingBox()).x).toBeGreaterThanOrEqual(0)
      const tasks = await panel.boundingBox()
      expect(tasks.x + tasks.width).toBeLessThanOrEqual(width)
      await page.getByTitle('Open PDA (Journal & Encyclopedia)').click()
      const reports = await page.getByRole('button', { name: 'REPORTS' }).boundingBox()
      expect(reports.x).toBeGreaterThanOrEqual(0)
      expect(reports.x + reports.width).toBeLessThanOrEqual(width)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await page.getByRole('button', { name: 'REPORTS' }).click()
      await expect(page.getByText('Investigation Reports')).toBeVisible()
    })
  })
}
