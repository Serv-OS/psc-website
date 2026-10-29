/**
 * One-off copy fix for the live CMS content (29 Oct 2026, v0.5.35).
 *
 * Peter: PSC no longer sells windows, so every mention goes, and the site is
 * US so the spelling is US ("stories" not "storeys", "color" not "colour").
 * The code defaults were edited too, but the live pages render the builder
 * layouts saved in the database, so those need the same edit.
 *
 * Re-seeding the layouts would wipe builder edits, so this changes ONLY the
 * listed sentences and the "Windows & Doors" service card, in place. It runs
 * from onInit, is idempotent (no write once the text is clean) and never
 * throws. Safe to delete once it has run on production.
 */
import type { Payload } from 'payload'

const PHRASES: [string, string][] = [
  ['the best siding, window, and exterior solutions', 'the best siding and exterior solutions'],
  ['the perfect siding, trim and window styles', 'the perfect siding and trim styles'],
  ['discuss styles, colors and any window or door changes.', 'discuss styles, colors and trim details.'],
  ['vented soffit that frame windows, define edges', 'vented soffit that define edges'],
  ['HardieTrim around a window', 'HardieTrim detail'],
  ['Siding + windows', 'Siding replacement'],
  ['favourite', 'favorite'],
  ['customisable', 'customizable'],
  ['Soft greys', 'Soft grays'],
  ['oastal-grey', 'oastal-gray'],
  ['homes favour ', 'homes favor '],
]

function fixText(s: string): string {
  let out = s
  for (const [a, b] of PHRASES) out = out.split(a).join(b)
  return out.replace(/\bcolour/g, 'color').replace(/\bColour/g, 'Color')
}

function fixValue(v: unknown): unknown {
  if (typeof v === 'string') return fixText(v)
  if (Array.isArray(v)) return v.map(fixValue)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fixValue(x)]))
  return v
}

type Block = { type?: string; props?: { items?: { title?: string }[]; columns?: string } }

/** Drop the Windows & Doors card and tighten the grid so no gap is left. */
function dropWindowCards(layout: { content?: Block[] }) {
  for (const b of layout.content || []) {
    if (b.type !== 'ServicesGrid' || !Array.isArray(b.props?.items)) continue
    // '2' used to render as 4 columns (the grid only knew 3 and 4). Keep any
    // existing grid looking exactly as it did now that '2' really means 2.
    if (b.props.columns === '2' && b.props.items.length > 2) b.props.columns = '4'
    const kept = b.props.items.filter((i) => i?.title !== 'Windows & Doors')
    if (kept.length === b.props.items.length) continue
    b.props.items = kept
    b.props.columns = String(Math.min(4, Math.max(2, kept.length)))
  }
}

export async function applyCopyFix(payload: Payload) {
  try {
    const pages = await payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false })
    for (const page of pages.docs) {
      const before = JSON.stringify(page.layout ?? null)
      if (before === 'null') continue
      const layout = fixValue(JSON.parse(before)) as { content?: Block[] }
      dropWindowCards(layout)
      if (JSON.stringify(layout) === before) continue
      await payload.update({ collection: 'pages', id: page.id, data: { layout } as never, overrideAccess: true })
      payload.logger.info(`copyFix: updated page ${page.slug}`)
    }

    const quotes = await payload.find({ collection: 'testimonials', limit: 100, depth: 0, pagination: false })
    for (const t of quotes.docs as { id: string | number; projectType?: string | null }[]) {
      if (!t.projectType || fixText(t.projectType) === t.projectType) continue
      await payload.update({ collection: 'testimonials', id: t.id, data: { projectType: fixText(t.projectType) } as never, overrideAccess: true })
    }
  } catch (err) {
    payload.logger.error(`copyFix failed: ${(err as Error).message}`)
  }
}
