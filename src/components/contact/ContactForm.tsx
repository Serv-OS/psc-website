'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const INTERESTS = [
  'Siding Installation',
  'James Hardie® Siding',
  'Wood / Cedar Siding',
  'Siding Repair',
  'Siding Replacement',
  'Windows & Doors',
  'Not sure yet',
]

const labelStyle: CSSProperties = { fontSize: '12.5px', fontWeight: 600, color: '#56635a', display: 'block', marginBottom: 6 }

function input(invalid: boolean): CSSProperties {
  return {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 11,
    fontSize: '14.5px',
    fontFamily: 'inherit',
    border: invalid ? '2px solid #e0a59c' : '2px solid #e6ece6',
    background: invalid ? '#fdf4f2' : '#fff',
  }
}

function chip(active: boolean): CSSProperties {
  return {
    cursor: 'pointer',
    padding: '9px 16px',
    borderRadius: 999,
    fontSize: '13.5px',
    fontWeight: 600,
    background: active ? '#206a38' : '#fff',
    color: active ? '#fff' : '#3a4a40',
    border: active ? '2px solid #206a38' : '2px solid #e0e7e0',
    fontFamily: 'inherit',
  }
}

export function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '', interest: '', message: '', hp: '' })
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }))

  const emailBad = error && !EMAIL_RE.test(f.email)

  const submit = async () => {
    if (!f.name.trim() || !EMAIL_RE.test(f.email) || !f.phone.trim()) {
      setError(true)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          company: f.hp,
          customer: { name: f.name, email: f.email, phone: f.phone, address: f.address, city: f.city, zip: f.zip },
          interest: f.interest,
          message: f.message,
          source: 'contact-form',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, boxShadow: 'var(--shadow-soft)', padding: 34 }}>
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 18px', borderRadius: '50%', background: '#e7f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#206a38' }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#16261c' }}>Thanks, {f.name.split(' ')[0]}!</h2>
          <p style={{ maxWidth: 420, margin: '10px auto 0', fontSize: 15, color: '#56635a', lineHeight: 1.6 }}>
            Your request is in. A Peninsula Siding specialist will reach out within one business day to book your free consultation. For anything urgent, call us at{' '}
            <a href="tel:6509105521" style={{ color: '#206a38', fontWeight: 600 }}>650-910-5521</a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, boxShadow: 'var(--shadow-soft)', padding: 34 }}>
      <h2 style={{ fontSize: 21, fontWeight: 800, color: '#16261c', letterSpacing: '-.4px' }}>Request your free consultation</h2>
      <p style={{ fontSize: 14, color: '#6a766d', marginTop: 6 }}>Fields marked * are required.</p>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="cols-2">
        <div>
          <label style={labelStyle}>Name *</label>
          <input value={f.name} onChange={set('name')} placeholder="Full name" style={input(error && !f.name.trim())} />
        </div>
        <div>
          <label style={labelStyle}>Phone *</label>
          <input value={f.phone} onChange={set('phone')} placeholder="(650) 000-0000" style={input(error && !f.phone.trim())} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input value={f.email} onChange={set('email')} placeholder="email@example.com" style={input(emailBad)} />
        </div>
        <div>
          <label style={labelStyle}>Property address</label>
          <input value={f.address} onChange={set('address')} placeholder="Street address" style={input(false)} />
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input value={f.city} onChange={set('city')} placeholder="San Mateo" style={input(false)} />
        </div>
        <div>
          <label style={labelStyle}>Zip code</label>
          <input value={f.zip} onChange={set('zip')} placeholder="94402" style={input(false)} />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={{ ...labelStyle, marginBottom: 10 }}>I&apos;m interested in</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {INTERESTS.map((it) => (
            <button key={it} style={chip(f.interest === it)} onClick={() => setF((s) => ({ ...s, interest: s.interest === it ? '' : it }))}>
              {it}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={labelStyle}>Tell us more about your project</label>
        <textarea value={f.message} onChange={set('message')} rows={4} placeholder="Project type, size, timeline, anything you'd like us to know..." style={{ ...input(false), resize: 'vertical' }} />
      </div>

      {/* honeypot */}
      <input value={f.hp} onChange={set('hp')} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      {error && (
        <div style={{ marginTop: 16, background: '#fdecea', border: '1px solid #f3c9c2', borderRadius: 11, padding: '12px 16px', fontSize: '13.5px', color: '#c0392b', fontWeight: 500 }}>
          Please add your name, a valid email, and a phone number so we can reach you.
        </div>
      )}

      <button onClick={submit} disabled={submitting} className="btn btn-primary" style={{ marginTop: 22, width: '100%', padding: 16, fontSize: 16, border: 'none', borderRadius: 13, opacity: submitting ? 0.7 : 1 }}>
        {submitting ? 'Sending…' : 'Send my request'}
      </button>
      <p style={{ marginTop: 14, fontSize: '12.5px', color: '#8a958c', textAlign: 'center', lineHeight: 1.5 }}>
        Prefer a number first? <Link href="/instant-quote" style={{ color: '#206a38', fontWeight: 600 }}>Build an instant estimate</Link> in 60 seconds.
      </p>
    </div>
  )
}
