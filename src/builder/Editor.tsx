'use client'

import { Puck, type Data } from '@measured/puck'
import '@measured/puck/puck.css'
import { useState } from 'react'

import { config } from './puck.config'

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  'about-us': 'About Us',
  services: 'Services',
  'design-inspirations': 'Design Inspirations',
  'quality-pricing': 'Quality Pricing',
  gallery: 'Gallery',
  benefits: 'Benefits',
  'contact-us': 'Contact Us',
  resources: 'Resources',
}

export function Editor({ slug, initialData }: { slug: string; initialData: Data | null }) {
  const [toast, setToast] = useState('')

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
      setToast('Published ✓ — changes are live')
    } catch (e) {
      setToast(`Save failed: ${e instanceof Error ? e.message : String(e)}`)
    }
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <>
      <Puck
        config={config}
        data={initialData || ({ content: [], root: {} } as Data)}
        onPublish={save}
        headerTitle={`Editing: ${PAGE_LABELS[slug] || slug}`}
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
