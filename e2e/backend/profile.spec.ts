import { test, expect } from '@playwright/test'
import { backendTest, TEST_USER } from '../fixtures/auth'

// ── Unauthenticated guard ─────────────────────────────────────────────────────

test.describe('Profile page — unauthenticated (Django)', () => {
  test('redirects to the login page with a ?next param', async ({ page }) => {
    await page.goto('/accounts/profile/')
    // LOGIN_URL = "accounts:login" → /accounts/ ; Django appends ?next=/accounts/profile/
    await page.waitForURL(/\/accounts\/\?next=/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })
})

// ── Authenticated ─────────────────────────────────────────────────────────────

backendTest.describe('Profile page — authenticated (Django)', () => {
  backendTest('displays the logged-in user data', async ({ authedPage: page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible()
    await expect(page.getByText(TEST_USER.username)).toBeVisible()
    await expect(page.getByText(TEST_USER.email)).toBeVisible()
  })

  backendTest('logs out and redirects to the login page', async ({ authedPage: page }) => {
    // Logout is a form POST — click the Logout button
    await page.getByRole('button', { name: 'Logout' }).click()
    await page.waitForURL('/accounts/')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  backendTest('visiting profile after logout redirects to login', async ({ authedPage: page }) => {
    await page.getByRole('button', { name: 'Logout' }).click()
    await page.waitForURL('/accounts/')
    await page.goto('/accounts/profile/')
    await page.waitForURL(/\/accounts\/\?next=/)
  })
})
