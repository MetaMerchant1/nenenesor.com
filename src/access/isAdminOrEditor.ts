import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}
