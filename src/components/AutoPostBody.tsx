import { CONTENT_PUBLIC, type AutoBlock } from '@/lib/autopilot'

/** Renders an autopilot blog post body (plain text blocks, no HTML). */
export function AutoPostBody({ body, images }: { body: AutoBlock[] | null; images: string[] }) {
  if (!Array.isArray(body)) return null
  return (
    <>
      {body.map((b, i) => {
        if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>
        if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>
        if (b.type === 'quote') return <blockquote key={i}>{b.text}</blockquote>
        if (b.type === 'ul') return <ul key={i}>{(b.items || []).map((x, j) => <li key={j}>{x}</li>)}</ul>
        if (b.type === 'img') {
          const path = images?.[b.photo]
          if (!path) return null
          return (
            <figure key={i} style={{ margin: '28px 0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CONTENT_PUBLIC + path} alt={b.alt || ''} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: 16 }} />
              {b.caption ? <figcaption style={{ fontSize: 13.5, color: '#6a766d', marginTop: 8 }}>{b.caption}</figcaption> : null}
            </figure>
          )
        }
        return <p key={i}>{b.text}</p>
      })}
    </>
  )
}
