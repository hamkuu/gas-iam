import axios from 'axios'
import type { components } from '../types/api'

type LoginPayload = components['schemas']['Login']
type JWTResponse = components['schemas']['JWT']
type RegisterPayload = components['schemas']['Register']

const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

export async function login(payload: LoginPayload): Promise<JWTResponse> {
  const { data } = await client.post<JWTResponse>('/api/auth/login/', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<void> {
  await client.post('/accounts/api/register/', payload)
}
