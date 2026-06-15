import Link from 'next/link'

/** Adds an "Edit pages (Builder)" link to the admin sidebar nav. */
export function BuilderNavLink() {
  return (
    <Link
      href="/builder"
      style={{ display: 'block', padding: '8px 0', fontWeight: 600, color: 'var(--theme-success-500,#206a38)' }}
    >
      ✎ Edit pages (Builder)
    </Link>
  )
}

export default BuilderNavLink
