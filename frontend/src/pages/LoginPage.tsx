import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { login } from '../api/auth'
import type { components } from '../types/api'

type JWTResponse = components['schemas']['JWT']

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [user, setUser] = useState<JWTResponse['user'] | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      const jwt = await login(values)
      localStorage.setItem('access', jwt.access)
      localStorage.setItem('refresh', jwt.refresh)
      setUser(jwt.user)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { detail?: string } } }).response
        setServerError(res?.data?.detail ?? 'Login failed.')
      } else {
        setServerError('An unexpected error occurred.')
      }
    }
  }

  if (user) {
    return (
      <main>
        <p>Welcome, <strong>{user.username}</strong>!</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Sign in</h1>

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

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <small>{errors.password.message}</small>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
