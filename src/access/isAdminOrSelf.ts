import type { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admin can access everything
  if (user.role === 'admin') return true

  // Regular user can access their own document
  return {
    id: {
      equals: user.id,
    },
  }
}
