/** Count every financing Apply click in Google Analytics / Ads. */
export function trackApply(place: string) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    w.gtag?.('event', 'financing_apply_click', { place })
  } catch {
    /* tracking must never block the link */
  }
}
