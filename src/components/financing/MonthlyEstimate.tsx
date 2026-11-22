import Link from 'next/link'

import { EXAMPLE_APR, EXAMPLE_YEARS, monthlyPayment, usd } from '@/lib/financing'

/**
 * "Or about $A to $B a month" under a price range. The APR and term that made
 * the figure are always printed with it (Truth in Lending advertising rule).
 */
export function MonthlyEstimate({ low, high, compact = false }: { low: number; high: number; compact?: boolean }) {
  if (!(high > 0)) return null
  const a = monthlyPayment(low, EXAMPLE_APR, EXAMPLE_YEARS)
  const b = monthlyPayment(high, EXAMPLE_APR, EXAMPLE_YEARS)
  return (
    <div style={{ marginTop: compact ? 8 : 12 }}>
      <div style={{ fontSize: compact ? 14 : 15, fontWeight: 700, color: '#206a38' }}>
        or about {usd(a)} to {usd(b)} a month*
      </div>
      <div style={{ fontSize: 11, color: '#8a958c', marginTop: 3, lineHeight: 1.45 }}>
        *Example at {EXAMPLE_APR}% APR over {EXAMPLE_YEARS} years ({EXAMPLE_YEARS * 12} payments). Your rate depends on your credit; not an offer.{' '}
        <Link href="/financing" style={{ color: '#206a38', fontWeight: 600 }}>See financing</Link>
      </div>
    </div>
  )
}
