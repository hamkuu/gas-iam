import { test, expect } from '@playwright/test'
import { frontendTest, TEST_USER } from '../fixtures/auth'

// ── Unauthenticated guard ─────────────────────────────────────────────────────

test.describe('Profile page — unauthenticated', () => {
  test('redirects to /login when no token is stored', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })
})

// ── Authenticated ─────────────────────────────────────────────────────────────

frontendTest.describe('Profile page — authenticated', () => {
  frontendTest.beforeEach(async ({ authedPage }) => {
    await authedPage.goto('/')
    await expect(authedPage.getByRole('heading', { name: 'Profile' })).toBeVisible()
  })

  frontendTest('displays the logged-in user data', async ({ authedPage: page }) => {
    await expect(page.getByText(TEST_USER.username)).toBeVisible()
    await expect(page.getByText(TEST_USER.email)).toBeVisible()
  })

  frontendTest('logs out and redirects to /login', async ({ authedPage: page }) => {
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  frontendTest('visiting / after logout redirects back to /login', async ({ authedPage: page }) => {
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('/login')
    await page.goto('/')
    await page.waitForURL('/login')
  })
})
