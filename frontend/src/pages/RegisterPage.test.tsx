import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'

// Mock the API so tests don't hit the network
vi.mock('../api/auth', () => ({
  register: vi.fn(),
}))

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
})
