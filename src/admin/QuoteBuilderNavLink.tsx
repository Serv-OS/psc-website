import Link from 'next/link'

/** Adds a "Quote Builder" link to the admin sidebar nav. */
export function QuoteBuilderNavLink() {
  return (
    <Link
      href="/admin/quote-builder"
      style={{ display: 'block', padding: '8px 0', fontWeight: 600, color: 'var(--theme-success-500,#206a38)' }}
    >
      ＄ Quote Builder
    </Link>
  )
}

export default QuoteBuilderNavLink
