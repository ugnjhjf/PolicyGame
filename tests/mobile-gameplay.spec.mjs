import { test, expect } from '@playwright/test'

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'

test.use({ viewport: { width: 320, height: 568 }, isMobile: true, deviceScaleFactor: 2 })

test('a phone can read a report and finish the dataset game', async ({ page }) => {
  await page.goto(base + '/game/')
  const dialogue = page.locator('[class*="pointer-events-auto"][class*="max-w-5xl"] > div')
  for (let i = 0; i < 5; i++) await dialogue.click()
  const marker = page.getByRole('button', { name: /Talk to Aunt Zhang/ })
  await expect(marker).toBeVisible()
  await marker.click()
  for (let i = 0; i < 7; i++) await dialogue.click()
  const investigate = page.getByRole('button', { name: /Investigate Aunt Zhang/ })
  await expect(investigate).toBeVisible()
  await investigate.click()
  await expect(investigate.locator('svg.text-green-400')).toBeVisible()
  await investigate.click()
  await expect(page.getByRole('heading', { name: 'Investigation Report' })).toBeVisible()
  const report = await page.getByRole('heading', { name: 'Investigation Report' }).boundingBox()
  expect(report.x + report.width).toBeLessThanOrEqual(320)
  await page.getByRole('button', { name: 'CLOSE RECORD' }).click()
  await expect(page.getByRole('heading', { name: 'Model Training Dataset' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  for (const label of ['Annual Income', 'Credit Score', 'Employment Duration']) {
    await page.getByRole('button', { name: label }).click()
  }
  await page.getByRole('button', { name: 'TRAIN MODEL' }).click()
  await expect(page.getByText('Application Result')).toBeVisible()
  const finish = page.getByRole('button', { name: 'Finish' })
  await finish.scrollIntoViewIfNeeded()
  const rect = await finish.boundingBox()
  expect(rect.x).toBeGreaterThanOrEqual(0)
  expect(rect.x + rect.width).toBeLessThanOrEqual(320)
  await finish.click()
  await expect(page.getByRole('heading', { name: 'Model Training Dataset' })).toHaveCount(0)
})
