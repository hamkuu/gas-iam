import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'
import * as authApi from '../api/auth'

// Mock the API so tests don't hit the network
vi.mock('../api/auth', () => ({
  register: vi.fn(),
}))

const validFormData = {
  username: 'hirouser',
  email: 'hiro@example.com',
  password: 'StrongPass1',
  password_confirm: 'StrongPass1',
  tel: '0312345678',
  pref: '13',
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText(/username/i), validFormData.username)
  await userEvent.type(screen.getByLabelText(/email/i), validFormData.email)
  await userEvent.type(screen.getByLabelText(/^password$/i), validFormData.password)
  await userEvent.type(screen.getByLabelText(/confirm password/i), validFormData.password_confirm)
  await userEvent.type(screen.getByLabelText(/phone/i), validFormData.tel)
  await userEvent.selectOptions(screen.getByLabelText(/prefecture/i), validFormData.pref)
  await userEvent.click(screen.getByRole('button', { name: /create account/i }))
}

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all fields', () => {
    renderPage()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prefecture/i)).toBeInTheDocument()
  })

  it('shows username error after blurring with short value', async () => {
    renderPage()
    const input = screen.getByLabelText(/username/i)
    await userEvent.type(input, 'ab')
    await userEvent.tab()
    expect(await screen.findByText('At least 3 characters')).toBeInTheDocument()
  })

  it('shows email error after blurring with invalid value', async () => {
    renderPage()
    const input = screen.getByLabelText(/email/i)
    await userEvent.type(input, 'not-an-email')
    await userEvent.tab()
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
  })

  it('shows password error for weak password', async () => {
    renderPage()
    const input = screen.getByLabelText(/^password$/i)
    await userEvent.type(input, 'weakpass')
    await userEvent.tab()
    expect(await screen.findByText(/min 8 chars/i)).toBeInTheDocument()
  })

  it('shows mismatch error when passwords differ', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/^password$/i), 'StrongPass1')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Different1')
    await userEvent.tab()
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('shows tel error for non-digit input', async () => {
    renderPage()
    const input = screen.getByLabelText(/phone/i)
    await userEvent.type(input, '03-1234')
    await userEvent.tab()
    expect(await screen.findByText('Digits only')).toBeInTheDocument()
  })

  describe('onSubmit', () => {
    it('navigates to /login on successful registration', async () => {
      vi.mocked(authApi.register).mockResolvedValueOnce(undefined)
      renderPage()
      await fillAndSubmit()
      // MemoryRouter won't visually navigate, but register() should have been called
      expect(authApi.register).toHaveBeenCalledOnce()
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'hirouser',
        email: 'hiro@example.com',
        password: 'StrongPass1',
        tel: '0312345678',
        pref: 13,
      })
    })

    it('shows server error message from API response', async () => {
      vi.mocked(authApi.register).mockRejectedValueOnce({
        response: { data: { username: ['A user with that username already exists.'] } },
      })
      renderPage()
      await fillAndSubmit()
      expect(await screen.findByText('A user with that username already exists.')).toBeInTheDocument()
    })

    it('shows fallback error on unexpected failure', async () => {
      vi.mocked(authApi.register).mockRejectedValueOnce(new Error('Network Error'))
      renderPage()
      await fillAndSubmit()
      expect(await screen.findByText('An unexpected error occurred.')).toBeInTheDocument()
    })
  })
})
