import { describe, it, expect } from 'vitest'
import { registerSchema } from './register'

const validData = {
  username: 'hirouser',
  email: 'hiro@example.com',
  password: 'Password1',
  password_confirm: 'Password1',
  tel: '0312345678',
  pref: 13,
}

describe('registerSchema', () => {
  it('accepts valid data', () => {
    expect(registerSchema.safeParse(validData).success).toBe(true)
  })

  describe('username', () => {
    it('rejects fewer than 3 characters', () => {
      const result = registerSchema.safeParse({ ...validData, username: 'ab' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.username).toContain('At least 3 characters')
      }
    })

    it('accepts exactly 3 characters', () => {
      expect(registerSchema.safeParse({ ...validData, username: 'abc' }).success).toBe(true)
    })
  })

  describe('email', () => {
    it('rejects an invalid email', () => {
      const result = registerSchema.safeParse({ ...validData, email: 'not-an-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain('Enter a valid email')
      }
    })

    it('accepts a valid email', () => {
      expect(registerSchema.safeParse({ ...validData, email: 'user@example.com' }).success).toBe(true)
    })
  })

  describe('password', () => {
    it('rejects fewer than 8 characters', () => {
      const result = registerSchema.safeParse({ ...validData, password: 'Pass1', password_confirm: 'Pass1' })
      expect(result.success).toBe(false)
    })

    it('rejects a password without uppercase', () => {
      const result = registerSchema.safeParse({ ...validData, password: 'password1', password_confirm: 'password1' })
      expect(result.success).toBe(false)
    })

    it('rejects a password without lowercase', () => {
      const result = registerSchema.safeParse({ ...validData, password: 'PASSWORD1', password_confirm: 'PASSWORD1' })
      expect(result.success).toBe(false)
    })

    it('rejects a password without a number', () => {
      const result = registerSchema.safeParse({ ...validData, password: 'PasswordA', password_confirm: 'PasswordA' })
      expect(result.success).toBe(false)
    })

    it('accepts a strong password', () => {
      expect(registerSchema.safeParse({ ...validData, password: 'StrongPass1', password_confirm: 'StrongPass1' }).success).toBe(true)
    })
  })

  describe('password_confirm', () => {
    it('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({ ...validData, password_confirm: 'Different1' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password_confirm).toContain('Passwords do not match')
      }
    })

    it('accepts matching passwords', () => {
      expect(registerSchema.safeParse(validData).success).toBe(true)
    })
  })

  describe('tel', () => {
    it('rejects non-digit characters', () => {
      const result = registerSchema.safeParse({ ...validData, tel: '03-1234-5678' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.tel).toContain('Digits only')
      }
    })

    it('accepts digits only', () => {
      expect(registerSchema.safeParse({ ...validData, tel: '0312345678' }).success).toBe(true)
    })
  })

  describe('pref', () => {
    it('rejects 0', () => {
      const result = registerSchema.safeParse({ ...validData, pref: 0 })
      expect(result.success).toBe(false)
    })

    it('accepts a valid prefecture code', () => {
      expect(registerSchema.safeParse({ ...validData, pref: 13 }).success).toBe(true)
    })

    it('coerces a string number', () => {
      expect(registerSchema.safeParse({ ...validData, pref: '13' }).success).toBe(true)
    })
  })
})
