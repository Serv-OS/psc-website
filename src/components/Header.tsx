'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type CSSProperties } from 'react'

import type { NavItem } from '@/lib/site'

type Props = {
  announcement: string
  phone: string
  logoUrl: string
  nav: NavItem[]
}

const QUOTE_HREF = '/#quote'

export function Header({ announcement, phone, logoUrl, nav }: Props) {
  const pathname = usePathname()
  // Track which item's dropdown is open (by href) — not a single shared flag,
  // otherwise hovering one item opens every dropdown at once.
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkStyle = (active: boolean): CSSProperties => ({
    color: active ? '#206a38' : '#33433a',
    fontWeight: active ? 700 : 500,
    fontSize: '14.5px',
    paddingBottom: 3,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    borderBottom: active ? '2px solid #206a38' : '2px solid transparent',
  })

  // Bold the promise phrase inside the announcement, if present.
  const promise = 'beat any like-for-like quote by 10%'
  const annParts = announcement.split(promise)

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: '#0e341d', color: '#dfeadf', fontSize: 13, fontWeight: 500, letterSpacing: '.2px' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '9px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#00c40a',
              boxShadow: '0 0 0 3px rgba(0,196,10,.22)',
              flex: '0 0 auto',
            }}
          />
          <span>
            {annParts.length === 2 ? (
              <>
                {annParts[0]}
                <strong style={{ color: '#fff', fontWeight: 700 }}>{promise}</strong>
                {annParts[1]}
              </>
            ) : (
              announcement
            )}
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          background: 'rgba(255,255,255,.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e7ece7',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Peninsula Siding Company — San Mateo & Bay Area siding contractors"
              style={{ height: 38, width: 'auto' }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="nav-desktop">
            {nav.map((item) =>
              'children' in item && item.children && item.children.length > 0 ? (
                <div
                  key={item.href}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setOpenItem(item.href)}
                  onMouseLeave={() => setOpenItem(null)}
                >
                  <Link href={item.href} style={linkStyle(isActive(item.href))}>
                    {item.label} <span style={{ fontSize: 10 }}>▾</span>
                  </Link>
                  {openItem === item.href && (
                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 14 }}>
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #e7ece7',
                          borderRadius: 14,
                          boxShadow: '0 18px 40px rgba(14,52,29,.16)',
                          padding: 8,
                          minWidth: 212,
                        }}
                      >
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            style={{
                              display: 'block',
                              padding: '10px 16px',
                              fontSize: 14,
                              color: '#33433a',
                              fontWeight: 500,
                              borderRadius: 8,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} style={linkStyle(isActive(item.href))}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA / PHONE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <a
              href={`tel:${phone.replace(/[^0-9]/g, '')}`}
              style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '14.5px', fontWeight: 600, color: '#224631' }}
            >
              <span style={{ fontSize: 15 }}>✆</span>
              <span className="header-phone-text" style={{ whiteSpace: 'nowrap' }}>
                {phone}
              </span>
            </a>
            <Link
              href={QUOTE_HREF}
              className="btn btn-primary"
              style={{ fontSize: 14, padding: '11px 20px', borderRadius: 10 }}
            >
              Free Quote
            </Link>
            <button
              className="nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div
            className="mobile-menu"
            style={{ background: '#fff', borderTop: '1px solid #e7ece7', padding: '8px 24px 18px' }}
          >
            {nav.map((item) => (
              <div key={item.href}>
                <Link href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {'children' in item && item.children && item.children.length > 0
                  ? item.children
                      .filter((c) => c.href !== item.href)
                      .map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setMobileOpen(false)}
                          style={{ paddingLeft: 18, fontWeight: 500, color: '#5b675e' }}
                        >
                          {c.label}
                        </Link>
                      ))
                  : null}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  )
}
