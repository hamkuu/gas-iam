import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser } from '../api/auth'
import { PREFECTURES } from '../constants/prefectures'
import type { components } from '../types/api'

type RegisterPayload = components['schemas']['Register']

const registerSchema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/,
    'Min 8 chars with uppercase, lowercase, and a number'
  ),
  tel: z.string().regex(/^\d+$/, 'Digits only'),
  pref: z.coerce.number().int('Select a prefecture'),
}) satisfies z.ZodType<RegisterPayload>

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await registerUser(values)
      navigate('/login')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: Record<string, string[]> } }).response
        const firstError = res?.data
          ? Object.values(res.data).flat()[0]
          : null
        setServerError(firstError ?? 'Registration failed.')
      } else {
        setServerError('An unexpected error occurred.')
      }
    }
  }

  return (
    <main>
      <h1>Create account</h1>

      {serverError && <p role="alert"><mark>{serverError}</mark></p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          aria-invalid={!!errors.username}
          {...register('username')}
        />
        {errors.username && <small>{errors.username.message}</small>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <small>{errors.email.message}</small>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <small>{errors.password.message}</small>}

        <label htmlFor="tel">Phone number</label>
        <input
          id="tel"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.tel}
          {...register('tel')}
        />
        {errors.tel && <small>{errors.tel.message}</small>}

        <label htmlFor="pref">Prefecture</label>
        <select
          id="pref"
          aria-invalid={!!errors.pref}
          {...register('pref')}
        >
          <option value="">— 選択してください —</option>
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
        {errors.pref && <small>{errors.pref.message}</small>}

        <p>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </p>
      </form>

      <p>Already have an account? <Link to="/">Sign in</Link></p>
    </main>
  )
}
