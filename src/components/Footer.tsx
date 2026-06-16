import Link from 'next/link'

import type { Biz, FooterColumn } from '@/lib/site'

const colTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#fff',
  textTransform: 'uppercase',
  letterSpacing: '.8px',
  marginBottom: 16,
}
const colLink: React.CSSProperties = { color: '#9fb6a4', textDecoration: 'none' }
const colWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, color: '#9fb6a4' }

export function Footer({ biz, logoUrl, columns }: { biz: Biz; logoUrl: string; columns: FooterColumn[] }) {
  const year = 2026
  return (
    <footer style={{ background: '#0b2417', color: '#cdddd0' }}>
      <div
        className="footer-grid"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '64px 24px 30px',
          display: 'grid',
          gridTemplateColumns: `1.6fr ${columns.map(() => '1fr').join(' ')}`,
          gap: 40,
        }}
      >
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Peninsula Siding Company"
            style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
          />
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 18, color: '#9fb6a4' }}>
            {biz.name}
            <br />
            {biz.street}
            <br />
            {biz.city}, {biz.region} {biz.zip}
            <br />
            {biz.hours}
          </p>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            <a href={`tel:${biz.phone.replace(/[^0-9]/g, '')}`} style={{ color: '#e6f1e8', fontWeight: 600 }}>
              ✆ {biz.phone}
            </a>
            <a href={`mailto:${biz.email}`} style={{ color: '#9fb6a4' }}>
              {biz.email}
            </a>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 14, fontSize: 13, color: '#9fb6a4', flexWrap: 'wrap' }}>
            <a href={biz.socials.facebook} style={colLink}>Facebook</a>
            <a href={biz.socials.instagram} style={colLink}>Instagram</a>
            <a href={biz.socials.yelp} style={colLink}>Yelp</a>
            <a href={biz.socials.pinterest} style={colLink}>Pinterest</a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <div style={colTitle}>{col.heading}</div>
            <div style={colWrap}>
              {col.links.map((l) => (
                <Link key={`${l.label}-${l.href}`} href={l.href} style={colLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            fontSize: '12.5px',
            color: '#7f9a85',
          }}
        >
          <span>Peninsula Siding Company &copy; {year}. All rights reserved.</span>
          <span>Elite Preferred James Hardie&reg; Contractor &middot; Licensed, bonded &amp; insured</span>
        </div>
      </div>
    </footer>
  )
}
