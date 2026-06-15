'use client'

import { useRef, useState } from 'react'

export type ImageValue = { id?: number | string; url?: string; alt?: string } | null

/**
 * Custom Puck field: upload an image straight into the Payload media library and
 * store { id, url, alt }. Used by blocks that show photos.
 */
export function ImageField({ value, onChange }: { value: ImageValue; onChange: (v: ImageValue) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const upload = async (file: File) => {
    setBusy(true)
    setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, '') }))
      const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' })
      if (!res.ok) throw new Error(`Upload failed (${res.status})`)
      const json = await res.json()
      const doc = json?.doc
      if (!doc?.url) throw new Error('No URL returned')
      onChange({ id: doc.id, url: doc.url, alt: doc.alt || '' })
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value?.url ? (
        <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e1e1e1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.url} alt={value.alt || ''} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
        </div>
      ) : (
        <div style={{ height: 90, borderRadius: 8, border: '2px dashed #cdd9ce', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa69d', fontSize: 12 }}>
          No image
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
        }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          style={{ flex: 1, padding: '8px 10px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid #206a38', background: '#206a38', color: '#fff', cursor: 'pointer', opacity: busy ? 0.7 : 1 }}
        >
          {busy ? 'Uploading…' : value?.url ? 'Replace image' : '⬆ Upload image'}
        </button>
        {value?.url && (
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{ padding: '8px 10px', fontSize: 13, fontWeight: 600, borderRadius: 8, border: '1px solid #d6ded6', background: '#fff', color: '#56635a', cursor: 'pointer' }}
          >
            Remove
          </button>
        )}
      </div>
      {err && <div style={{ fontSize: 12, color: '#c0392b' }}>{err}</div>}
    </div>
  )
}
