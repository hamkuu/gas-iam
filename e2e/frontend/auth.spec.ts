import { test, expect } from '@playwright/test'
import { TEST_USER } from '../fixtures/auth'

// ── Login ─────────────────────────────────────────────────────────────────────

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders the sign-in form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  test('shows client-side validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Username is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
  })

  test('shows a server error for wrong credentials', async ({ page }) => {
    await page.locator('#username').fill(TEST_USER.username)
    await page.locator('#password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('redirects to profile on successful login', async ({ page }) => {
    await page.locator('#username').fill(TEST_USER.username)
    await page.locator('#password').fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/')
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
  })

  test('has a link to the registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign up' }).click()
    await page.waitForURL('/register')
  })
})

// ── Register ──────────────────────────────────────────────────────────────────

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('renders the registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('#password_confirm')).toBeVisible()
    await expect(page.locator('#tel')).toBeVisible()
    await expect(page.locator('select#pref')).toBeVisible()
  })

  test('shows a validation error for a weak password', async ({ page }) => {
    await page.locator('#password').fill('weak')
    await page.locator('#password').blur()
    // pass_validator: 8+ chars, uppercase, lowercase, digit
    await expect(page.getByText(/8 chars/i)).toBeVisible()
  })

  test('shows a validation error when passwords do not match', async ({ page }) => {
    await page.locator('#password').fill('ValidPass1')
    await page.locator('#password_confirm').fill('DifferentPass1')
    await page.locator('#password_confirm').blur()
    await expect(page.getByText(/match/i)).toBeVisible()
  })

  test('registers a new user and redirects to login', async ({ page }) => {
    const uid = Date.now()
    await page.locator('#username').fill(`e2e_new_${uid}`)
    await page.locator('#email').fill(`e2e_new_${uid}@example.com`)
    await page.locator('#password').fill('ValidPass1')
    await page.locator('#password_confirm').fill('ValidPass1')
    await page.locator('#tel').fill('09012345678')
    // Select the first real prefecture option (index 0 is the placeholder "— 選択してください —")
    await page.locator('select#pref').selectOption({ index: 1 })
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.waitForURL('/login')
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  test('has a link to the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click()
    await page.waitForURL('/login')
  })
})
