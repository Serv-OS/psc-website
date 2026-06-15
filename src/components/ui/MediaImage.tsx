import Image from 'next/image'
import type { CSSProperties } from 'react'

import { asMedia } from '@/lib/media'
import type { Media } from '@/payload-types'

type Props = {
  /** Populated Media doc, an id, or null. */
  media?: Media | number | string | null
  alt?: string
  /** Label shown inside the placeholder when no image is set (mirrors the design). */
  label?: string
  className?: string
  /** Wrapper style — set aspect-ratio / height here so `fill` images render. */
  style?: CSSProperties
  /** Placeholder gradient background (mimics the .dc.html mock). */
  placeholderStyle?: CSSProperties
  sizes?: string
  priority?: boolean
  rounded?: number | string
  objectFit?: CSSProperties['objectFit']
}

const DEFAULT_PLACEHOLDER =
  'repeating-linear-gradient(0deg,#dde7dd 0 22px,#e7ede7 22px 25px)'

/**
 * Renders a Media record with next/image. When no image is assigned yet, falls
 * back to the design's labeled placeholder so the layout stays intact and the
 * owner can drop an image into the slot from the admin.
 */
export function MediaImage({
  media,
  alt,
  label,
  className,
  style,
  placeholderStyle,
  sizes = '(max-width: 900px) 100vw, 50vw',
  priority,
  rounded,
  objectFit = 'cover',
}: Props) {
  const doc = asMedia(media)
  const wrap: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: rounded,
    ...style,
  }

  if (doc?.url) {
    return (
      <div className={className} style={wrap}>
        <Image
          src={doc.url}
          alt={doc.alt || alt || ''}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit }}
        />
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        ...wrap,
        background: DEFAULT_PLACEHOLDER,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 16,
        ...placeholderStyle,
      }}
    >
      {label ? (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#8a988c' }}>
          [ {label} ]
        </span>
      ) : null}
    </div>
  )
}
