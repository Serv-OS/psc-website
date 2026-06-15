import type { Access, FieldAccess } from 'payload'

/** Public read. */
export const anyone: Access = () => true

/** Any signed-in staff member. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Admins only (owner). Editors are blocked. */
export const adminOnly: Access = ({ req: { user } }) => user?.role === 'admin'

/** Field-level: admins only. */
export const adminFieldOnly: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
