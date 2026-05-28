import { test, expect } from '@playwright/test'
import { TEST_USER } from '../fixtures/auth'

// ── Login ─────────────────────────────────────────────────────────────────────

test.describe('Login page (Django template)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts/')
  })

  test('renders the sign-in form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.locator('#id_username')).toBeVisible()
    await expect(page.locator('#id_password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  test('shows an error for wrong credentials', async ({ page }) => {
    await page.locator('#id_username').fill(TEST_USER.username)
    await page.locator('#id_password').fill('wrongpassword')
    await page.locator('button[type="submit"]').click()
    // Django AuthenticationForm renders non_field_errors in an <ul class="errorlist">
    await expect(page.locator('ul.errorlist')).toBeVisible()
  })

  test('logs in and redirects to the profile page', async ({ page }) => {
    await page.locator('#id_username').fill(TEST_USER.username)
    await page.locator('#id_password').fill(TEST_USER.password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/accounts/profile/')
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible()
  })

  test('has a link to the registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Create one' }).click()
    await page.waitForURL('/accounts/register/')
  })
})

// ── Register ──────────────────────────────────────────────────────────────────

test.describe('Register page (Django template)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts/register/')
  })

  test('renders the registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.locator('#id_username')).toBeVisible()
    await expect(page.locator('#id_email')).toBeVisible()
    await expect(page.locator('#id_password1')).toBeVisible()
    await expect(page.locator('#id_password2')).toBeVisible()
    await expect(page.locator('#id_tel')).toBeVisible()
    await expect(page.locator('#id_pref')).toBeVisible()
  })

  test('shows an error when passwords do not match', async ({ page }) => {
    await page.locator('#id_username').fill('e2e_dj_mismatch')
    await page.locator('#id_email').fill('e2e_dj_mismatch@example.com')
    await page.locator('#id_password1').fill('ValidPass1')
    await page.locator('#id_password2').fill('DifferentPass1')
    await page.locator('#id_tel').fill('09012345678')
    await page.locator('#id_pref').selectOption({ index: 1 })
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('ul.errorlist')).toBeVisible()
  })

  test('registers a new user and redirects to the profile page', async ({ page }) => {
    const uid = Date.now()
    await page.locator('#id_username').fill(`e2e_dj_${uid}`)
    await page.locator('#id_email').fill(`e2e_dj_${uid}@example.com`)
    await page.locator('#id_password1').fill('ValidPass1')
    await page.locator('#id_password2').fill('ValidPass1')
    await page.locator('#id_tel').fill('09012345678')
    // index 0 is the empty placeholder; index 1 is the first real prefecture
    await page.locator('#id_pref').selectOption({ index: 1 })
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/accounts/profile/')
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible()
  })

  test('has a link to the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click()
    await page.waitForURL('/accounts/')
  })
})
