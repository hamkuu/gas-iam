import { test as base, request as baseRequest, type Page } from '@playwright/test'
import { TEST_USER, BACKEND_URL } from '../global-setup'

// ── Shared helper ─────────────────────────────────────────────────────────────

/** Calls /api/auth/login/ and returns a { access, refresh } JWT pair. */
async function getJwt(): Promise<{ access: string; refresh: string }> {
  const ctx = await baseRequest.newContext({ baseURL: BACKEND_URL })
  const res = await ctx.post('/api/auth/login/', {
    data: { username: TEST_USER.username, password: TEST_USER.password },
  })
  if (!res.ok()) {
    throw new Error(`[auth fixture] JWT login failed: HTTP ${res.status()}`)
  }
  const tokens = (await res.json()) as { access: string; refresh: string }
  await ctx.dispose()
  return tokens
}

// ── Frontend fixture (JWT in localStorage) ────────────────────────────────────

type FrontendFixtures = { authedPage: Page }

/**
 * Extends `test` with an `authedPage` fixture that injects a valid JWT into
 * localStorage before each test, and clears it after.
 *
 * Usage:
 *   import { frontendTest as test } from '../fixtures/auth'
 *   test('my test', async ({ authedPage }) => { ... })
 */
export const frontendTest = base.extend<FrontendFixtures>({
  authedPage: async ({ page }, use) => {
    const { access, refresh } = await getJwt()

    // We must navigate first so localStorage is accessible on the correct origin.
    await page.goto('/')
    await page.evaluate(
      ([a, r]) => {
        localStorage.setItem('access', a)
        localStorage.setItem('refresh', r)
      },
      [access, refresh],
    )

    await use(page)

    await page.evaluate(() => {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    })
  },
})

// ── Backend fixture (Django session cookie) ───────────────────────────────────

type BackendFixtures = { authedPage: Page }

/**
 * Extends `test` with an `authedPage` fixture that submits the Django login
 * form and yields a page that already holds a valid session cookie.
 *
 * Usage:
 *   import { backendTest as test } from '../fixtures/auth'
 *   test('my test', async ({ authedPage }) => { ... })
 */
export const backendTest = base.extend<BackendFixtures>({
  authedPage: async ({ page }, use) => {
    await page.goto('/accounts/')
    await page.locator('#id_username').fill(TEST_USER.username)
    await page.locator('#id_password').fill(TEST_USER.password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/accounts/profile/')
    await use(page)
  },
})

export { TEST_USER }
