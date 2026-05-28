import { request } from '@playwright/test'

export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

/**
 * Shared credentials used across all E2E tests.
 *
 * Password satisfies pass_validator: ≥8 chars, one uppercase, one lowercase, one digit.
 * Tel satisfies tel_validator: digits only.
 * pref 13 = Tokyo (Prefecture pk matches code in the prefectures fixture).
 */
export const TEST_USER = {
  username: 'e2e_testuser',
  email: 'e2e_test@example.com',
  password: 'E2ePass1',
  tel: '09012345678',
  pref: 13,
} as const

export default async function globalSetup() {
  const ctx = await request.newContext({ baseURL: BACKEND_URL })

  const res = await ctx.post('/accounts/api/register/', {
    data: {
      username: TEST_USER.username,
      email: TEST_USER.email,
      password: TEST_USER.password,
      tel: TEST_USER.tel,
      pref: TEST_USER.pref,
    },
  })

  // 201 = created, 400 likely means the user already exists from a prior run — both are fine.
  if (!res.ok() && res.status() !== 400) {
    const body = await res.text()
    throw new Error(`[global-setup] Failed to create E2E test user: HTTP ${res.status()}\n${body}`)
  }

  await ctx.dispose()
}
