/**
 * Pages built in the page builder before financing existed get the Financing
 * block added automatically, just above the last call to action (or at the
 * end). Once someone places a Financing block in the editor, theirs is used
 * and nothing is added.
 */
type Block = { type?: string; props?: Record<string, unknown> }
type Layout = { content?: Block[]; [k: string]: unknown }

export function withFinancing(layout: unknown, place: string, city?: string): unknown {
  const l = layout as Layout | null
  if (!l || !Array.isArray(l.content)) return layout
  if (l.content.some((b) => b?.type === 'FinancingBlock')) return layout
  const block: Block = { type: 'FinancingBlock', props: { id: `FinancingBlock-auto-${place}`, place, city: city || '' } }
  const content = [...l.content]
  let at = -1
  for (let i = content.length - 1; i >= 0; i--) if (content[i]?.type === 'CallToAction') { at = i; break }
  content.splice(at < 0 ? content.length : at, 0, block)
  return { ...l, content }
}
