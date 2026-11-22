'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FIN } from '@/lib/financing'

/** Thin strip on every page: financing exists, and where to learn more. */
export function FinancingBar() {
  const path = usePathname()
  if (path?.startsWith('/financing')) return null
  return (
    <Link
      href="/financing"
      style={{
        display: 'block', background: '#eef6ef', borderBottom: '1px solid #dbe8dd', color: '#16261c',
        textAlign: 'center', fontSize: 13.5, padding: '8px 16px', lineHeight: 1.4,
      }}
    >
      <strong style={{ color: '#206a38' }}>Financing available.</strong> Rates from {FIN.lowestApr}% APR*, and checking won&apos;t affect your credit score.{' '}
      <span style={{ fontWeight: 700, color: '#206a38', textDecoration: 'underline' }}>Check your rate</span>
    </Link>
  )
}
