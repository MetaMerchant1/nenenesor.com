import { headers } from 'next/headers'

import type { User } from '@/payload-types'
import { getPayload } from './payload'

export async function getCurrentUser(): Promise<User | null> {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await headers() })
  return (user as User) ?? null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export function isEditor(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'editor'
}

export function isExpert(user: User | null): boolean {
  return user?.role === 'expert'
}
