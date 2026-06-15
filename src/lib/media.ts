import type { Media, Page } from '@/payload-types'

/**
 * Pure media helpers — safe to import from client components (no server/Node deps).
 * Keep these OUT of lib/data.ts, which pulls in the Node-only Payload client.
 */

/** A Media value may be a populated doc, an id, or null; normalize to the doc. */
export function asMedia(value: unknown): Media | null {
  if (value && typeof value === 'object' && 'url' in (value as Media)) return value as Media
  return null
}

/** Look up a named image slot on a Page doc. */
export function imageSlot(page: Page | null, key: string): Media | null {
  const slot = page?.images?.find((s) => s.key === key)
  return asMedia(slot?.image)
}
