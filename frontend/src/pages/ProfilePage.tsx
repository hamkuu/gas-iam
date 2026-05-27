import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../api/auth'
import type { components } from '../types/api'
import { PREFECTURES } from '../constants/prefectures'

type UserDetails = components['schemas']['UserDetails']

function getPrefectureName(code: number | null | undefined): string {
  if (code == null) return '—'
  const pref = PREFECTURES.find((p) => p.code === code)
  return pref ? pref.name : String(code)
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const token = localStorage.getItem('access') ?? ''
    try {
      await logout(token)
    } finally {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      navigate('/login', { replace: true })
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    getUser(token)
      .then(setUser)
      .catch(() => {
        // Token may be expired or invalid — send back to login
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        navigate('/login', { replace: true })
      })
  }, [navigate])

  if (error) {
    return (
      <main>
        <p role="alert"><mark>{error}</mark></p>
      </main>
    )
  }

  if (!user) {
    return (
      <main>
        <p>Loading…</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Profile</h1>

      <table>
        <tbody>
          <tr>
            <th scope="row">Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th scope="row">Phone</th>
            <td>{user.tel ?? '—'}</td>
          </tr>
          <tr>
            <th scope="row">Prefecture</th>
            <td>{getPrefectureName(user.pref)}</td>
          </tr>
        </tbody>
      </table>

      <p>
        <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </p>
    </main>
  )
}
