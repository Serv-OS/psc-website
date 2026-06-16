'use client'

import { Puck, type Data } from '@measured/puck'
import '@measured/puck/puck.css'
import { useMemo, useRef, useState } from 'react'

import { config } from './puck.config'

type PageOption = { label: string; value: string }

const builderHref = (slug: string) => `/builder/${slug === 'home' ? '' : slug}`

export function Editor({
  slug,
  initialData,
  pages,
}: {
  slug: string
  initialData: Data | null
  pages: PageOption[]
}) {
  const [toast, setToast] = useState('')
  // Track unsaved edits so switching pages doesn't silently discard them.
  // A ref (not state) keeps the Puck `overrides` object stable across renders.
  const dirtyRef = useRef(false)
  const sawFirstChange = useRef(false)

  const currentLabel = pages.find((p) => p.value === slug)?.label || slug

  const save = async (data: Data) => {
    setToast('Saving…')
    try {
      const res = await fetch('/api/builder/save', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, data }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      dirtyRef.current = false
      setToast('Published ✓ — changes are live')
    } catch (e) {
      setToast(`Save failed: ${e instanceof Error ? e.message : String(e)}`)
    }
    setTimeout(() => setToast(''), 4000)
  }

  const switchPage = (next: string) => {
    if (next === slug) return
    if (
      dirtyRef.current &&
      !window.confirm('You have unsaved changes on this page. Switch anyway and discard them?')
    ) {
      return
    }
    window.location.href = builderHref(next)
  }

  // Inject a page picker into Puck's header, before the default Publish action.
  const overrides = useMemo(
    () => ({
      headerActions: ({ children }: { children: React.ReactNode }) => (
        <>
          <label
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, fontSize: 13, fontWeight: 600 }}
          >
            <span style={{ opacity: 0.7 }}>Page:</span>
            <select
              value={slug}
              onChange={(e) => switchPage(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: 8,
                border: '1px solid var(--puck-color-grey-09, #ccc)',
                background: 'var(--puck-color-white, #fff)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                maxWidth: 220,
              }}
            >
              {pages.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          {children}
        </>
      ),
    }),
    // slug/pages are fixed for the lifetime of this editor instance; switchPage reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <>
      <Puck
        config={config}
        data={initialData || ({ content: [], root: {} } as Data)}
        onPublish={save}
        onChange={() => {
          // Puck fires onChange once on mount; ignore that, mark dirty after.
          if (sawFirstChange.current) dirtyRef.current = true
          else sawFirstChange.current = true
        }}
        overrides={overrides}
        headerTitle={`Editing: ${currentLabel}`}
        headerPath={`/${slug === 'home' ? '' : slug}`}
      />
      {toast && (
        <div style={{ position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: '#16261c', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 99999, boxShadow: '0 10px 30px rgba(0,0,0,.3)' }}>
          {toast}
        </div>
      )}
    </>
  )
}

export default Editor
