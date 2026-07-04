import type { Access, FieldAccess } from 'payload'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}

export const isAdminOrEditorFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}
