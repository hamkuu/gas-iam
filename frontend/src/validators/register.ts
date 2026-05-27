import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/,
    'Min 8 chars with uppercase, lowercase, and a number'
  ),
  password_confirm: z.string(),
  tel: z.string().regex(/^\d+$/, 'Digits only'),
  pref: z.coerce.number().int().min(1, 'Select a prefecture'),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Passwords do not match',
  path: ['password_confirm'],
})

export type RegisterFormValues = z.infer<typeof registerSchema>
