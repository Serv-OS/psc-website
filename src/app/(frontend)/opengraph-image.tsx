import { ImageResponse } from 'next/og'

// Site-wide default social share image (individual pages, e.g. blog posts, may override).
export const alt = 'Peninsula Siding Company — Bay Area siding experts'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#0e341d 0%,#206a38 100%)',
          color: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Lap-siding plank motif (echoes the favicon/brand) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: i === 0 ? 230 : i === 1 ? 180 : 130, height: 16, background: 'rgba(255,255,255,0.92)', borderRadius: 8 }} />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 2, color: '#bfe0c6', textTransform: 'uppercase' }}>
            Peninsula Siding Company
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 14, maxWidth: 940 }}>
            Bay Area Siding Experts
          </div>
          <div style={{ fontSize: 34, color: '#dfeadf', marginTop: 22, maxWidth: 960 }}>
            James Hardie® fiber cement &amp; cedar siding · installation, repair &amp; replacement
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#00c40a', color: '#0e341d', fontSize: 28, fontWeight: 800, padding: '10px 22px', borderRadius: 999 }}>
            We beat any like-for-like quote by 10%
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
