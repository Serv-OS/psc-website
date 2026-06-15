'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'

import { asMedia } from '@/lib/media'
import type { Media } from '@/payload-types'

const BEFORE_BG = 'repeating-linear-gradient(135deg,#7a7a72 0 18px,#888880 18px 36px)'
const AFTER_BG = 'repeating-linear-gradient(0deg,#4f7a59 0 26px,#456e4f 26px 29px)'

type Props = {
  before?: Media | number | string | null
  after?: Media | number | string | null
  beforeBg?: string
  afterBg?: string
  aspect?: string
  radius?: number
  initial?: number
  big?: boolean
  sizes?: string
  shadow?: boolean
}

/** Drag-to-reveal before/after slider (Home, About, Gallery feature & cards). */
export function BeforeAfter({
  before,
  after,
  beforeBg = BEFORE_BG,
  afterBg = AFTER_BG,
  aspect = '16/11',
  radius = 20,
  initial = 50,
  big = false,
  sizes = '(max-width: 900px) 100vw, 50vw',
  shadow = true,
}: Props) {
  const [pos, setPos] = useState(initial)
  const beforeDoc = asMedia(before)
  const afterDoc = asMedia(after)
  const handle = big ? 48 : 44
  const badge = big ? 13 : 12

  const wrap: CSSProperties = {
    position: 'relative',
    borderRadius: radius,
    overflow: 'hidden',
    aspectRatio: aspect,
    userSelect: 'none',
    boxShadow: shadow ? '0 30px 60px rgba(0,0,0,.4)' : undefined,
  }

  return (
    <div style={wrap}>
      {/* BEFORE (full) */}
      <div style={{ position: 'absolute', inset: 0, background: beforeDoc ? undefined : beforeBg }}>
        {beforeDoc?.url && (
          <Image src={beforeDoc.url} alt={beforeDoc.alt || 'Before'} fill sizes={sizes} style={{ objectFit: 'cover' }} />
        )}
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontFamily: 'ui-monospace, monospace',
            fontSize: badge,
            color: '#fff',
            background: 'rgba(0,0,0,.4)',
            padding: '5px 10px',
            borderRadius: 6,
          }}
        >
          BEFORE
        </span>
      </div>

      {/* AFTER (clipped) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          background: afterDoc ? undefined : afterBg,
        }}
      >
        {afterDoc?.url && (
          <Image src={afterDoc.url} alt={afterDoc.alt || 'After'} fill sizes={sizes} style={{ objectFit: 'cover' }} />
        )}
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontFamily: 'ui-monospace, monospace',
            fontSize: badge,
            color: '#fff',
            background: 'rgba(20,60,32,.6)',
            padding: '5px 10px',
            borderRadius: 6,
          }}
        >
          AFTER
        </span>
      </div>

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 3,
          background: '#fff',
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 14px rgba(0,0,0,.45)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: handle,
            height: handle,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: big ? 18 : 16,
            color: '#206a38',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(0,0,0,.3)',
          }}
        >
          ↔
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(parseFloat(e.target.value))}
        aria-label="Reveal before and after"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'ew-resize',
          margin: 0,
        }}
      />
    </div>
  )
}
