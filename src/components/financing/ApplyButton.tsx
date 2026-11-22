'use client'

import type { CSSProperties, ReactNode } from 'react'

import { applyUrl } from '@/lib/financing'
import { trackApply } from './track'

/** Opens our Enhancify page in a new tab and counts the click. */
export function ApplyButton({ place, children, className = 'btn btn-primary', style }: { place: string; children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <a href={applyUrl(place)} target="_blank" rel="noopener" onClick={() => trackApply(place)} className={className} style={style}>
      {children ?? 'Check your rate'}
    </a>
  )
}
