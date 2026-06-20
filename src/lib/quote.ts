/* ============================================================================
 *  Quote engine — shared pricing logic for the customer instant estimate and
 *  the internal staff Quote Builder. Formulas match the .dc.html designs exactly.
 *  Customer-facing code NEVER exposes cost/markup/profit — only the range.
 * ========================================================================== */

// ── Customer instant-quote engine (Home /#quote) ────────────────────────────

export type ProfileKey = 'lap' | 'panel' | 'shingle' | 'artisan'

export interface Profile {
  label: string
  blurb: string
  cost: number
  install: number
  img: string
}

export const PROFILES: Record<ProfileKey, Profile> = {
  lap: { label: 'Lap Siding', blurb: 'Classic horizontal boards', cost: 4.8, install: 5.5, img: '/siding/lap.jpg' },
  panel: { label: 'Board & Batten', blurb: 'Bold vertical lines', cost: 5.0, install: 5.5, img: '/siding/panel.jpg' },
  shingle: { label: 'Shingle', blurb: 'Coastal cottage texture', cost: 11.0, install: 6.5, img: '/siding/shingle.jpg' },
  artisan: { label: 'Artisan V-Rustic', blurb: 'Deep premium shadow', cost: 9.0, install: 8.0, img: '/siding/artisan.jpg' },
}

export type SizeKey = 'small' | 'medium' | 'large' | 'xl'
export const SIZES: Record<SizeKey, { label: string; sub: string; sqft: number }> = {
  small: { label: 'Townhome / Small', sub: '~1,100 sq ft', sqft: 1100 },
  medium: { label: 'Medium Single-Story', sub: '~1,700 sq ft', sqft: 1700 },
  large: { label: 'Two-Story Family', sub: '~2,400 sq ft', sqft: 2400 },
  xl: { label: 'Large / Custom', sub: '~3,300 sq ft', sqft: 3300 },
}

export type CoverageKey = 'whole' | 'frontsides' | 'front'
export const COVERAGE: Record<CoverageKey, { label: string; factor: number }> = {
  whole: { label: 'Whole house', factor: 1 },
  frontsides: { label: 'Front + sides', factor: 0.6 },
  front: { label: 'Front only', factor: 0.35 },
}

/** Internal pricing constants. Owner-tunable copies live in SiteSettings.pricing. */
export interface PricingConstants {
  markup: number
  rangeLow: number
  rangeHigh: number
  installMatPer1000PerStory: number
  permitsPerSqft: number
  debrisPerSqft: number
}

export const DEFAULT_PRICING: PricingConstants = {
  markup: 1.6,
  rangeLow: 0.92,
  rangeHigh: 1.12,
  installMatPer1000PerStory: 1067.39,
  permitsPerSqft: 0.96,
  debrisPerSqft: 2,
}

export interface CustomerEstimateInput {
  profile: ProfileKey
  sqft: number
  stories: number
}

export interface CustomerEstimate {
  sqft: number
  material: number
  install: number
  installMat: number
  permits: number
  debris: number
  totalCost: number
  sale: number
  low: number
  high: number
}

/** Returns the full cost breakdown internally + the public-facing rounded range. */
export function computeCustomerEstimate(
  { profile, sqft, stories }: CustomerEstimateInput,
  pricing: PricingConstants = DEFAULT_PRICING,
  profiles: Record<ProfileKey, Profile> = PROFILES,
): CustomerEstimate {
  const prof = profiles[profile]
  const material = prof.cost * sqft
  const install = prof.install * sqft
  const installMat = (sqft / 1000) * stories * pricing.installMatPer1000PerStory
  const permits = sqft * pricing.permitsPerSqft
  const debris = sqft * pricing.debrisPerSqft
  const totalCost = material + install + installMat + permits + debris
  const sale = totalCost * pricing.markup
  const low = Math.round((sale * pricing.rangeLow) / 100) * 100
  const high = Math.round((sale * pricing.rangeHigh) / 100) * 100
  return { sqft, material, install, installMat, permits, debris, totalCost, sale, low, high }
}

/** Guided square footage = home-size base × coverage factor. */
export function guidedSqft(size: SizeKey, coverage: CoverageKey): number {
  return SIZES[size].sqft * COVERAGE[coverage].factor
}

// ── ColorPlus® finishes (visualizer) ────────────────────────────────────────

export interface SidingColor {
  name: string
  hex: string
}

export const COLORS: SidingColor[] = [
  { name: 'Arctic White', hex: '#E9EAE5' },
  { name: 'Light Mist', hex: '#D3D6CF' },
  { name: 'Pearl Grey', hex: '#B9BCB6' },
  { name: 'Cobble Stone', hex: '#CABFA4' },
  { name: 'Navajo Beige', hex: '#C6B093' },
  { name: 'Monterey Taupe', hex: '#9C8E7B' },
  { name: 'Khaki Brown', hex: '#8B7B68' },
  { name: 'Mountain Sage', hex: '#8C9379' },
  { name: 'Timber Bark', hex: '#6E5D4E' },
  { name: 'Aged Pewter', hex: '#7C807E' },
  { name: 'Grey Slate', hex: '#6E746F' },
  { name: 'Boothbay Blue', hex: '#6E8A95' },
  { name: 'Night Grey', hex: '#4B4E4D' },
  { name: 'Iron Grey', hex: '#3B3D3C' },
  { name: 'Evening Blue', hex: '#3F525A' },
]

// ── Staff Quote Builder (internal) ──────────────────────────────────────────

export interface SidingProduct {
  name: string
  cost: number
  install: number
  unit: string
}

export const STAFF_PRODUCTS: SidingProduct[] = [
  { name: 'Hardie Primed Lap 8.25" x 12\'', cost: 2.25, install: 4.5, unit: 'SQFT' },
  { name: 'Hardie ColorPlus Lap 8.25" x 12\'', cost: 4.8, install: 5.5, unit: 'SQFT' },
  { name: 'Hardie Artisan V Rustic', cost: 9.0, install: 8, unit: 'SQFT' },
  { name: 'Hardie 12" Primed Lap Siding', cost: 4.6, install: 4.5, unit: 'SQFT' },
  { name: "Hardie 4'x10' Primed Panel", cost: 2.4, install: 5.5, unit: 'SQFT' },
  { name: "Hardie 4'x10' Primed Panel Sierra 8", cost: 3.85, install: 5.5, unit: 'SQFT' },
  { name: "Hardie 4'x10' ColorPlus Panel", cost: 5.0, install: 5.5, unit: 'SQFT' },
  { name: 'Straight Edge Shingles Primed', cost: 8.0, install: 5.5, unit: 'SQFT' },
  { name: 'Straight Edge Shingles ColorPlus', cost: 11.0, install: 6.5, unit: 'SQFT' },
  { name: 'Hardie Primed Battens', cost: 14.0, install: 0, unit: 'Per batten' },
  { name: 'Hardie ColorPlus Battens', cost: 21.0, install: 0, unit: 'Per batten' },
  { name: 'Hardie Primed Trim 3.5 x 5.5', cost: 29.0, install: 0, unit: 'Per length' },
  { name: 'Hardie Primed Trim 5/4 x 6" x 12\'', cost: 60.0, install: 0, unit: 'Per length' },
  { name: 'Hardie Color Trim 3.5', cost: 39.0, install: 0, unit: 'Per length' },
  { name: 'Hardie Color Trim 5.5', cost: 58.0, install: 0, unit: 'Per length' },
  { name: 'Hardie ColorPlus Trim 5/4 x 6" x 12\'', cost: 55.0, install: 0, unit: 'Per length' },
  { name: 'Hardie Primed 5/4 x 10" 12\' Trim', cost: 78.0, install: 0, unit: 'Per length' },
  { name: 'Hardie Primed 5/4 x 12" 12\' Trim', cost: 95.0, install: 0, unit: 'Per length' },
  { name: 'SOFFIT Vented 24 x 8', cost: 45.0, install: 0, unit: 'Per length' },
]

export const INSTALL_MATERIALS: { name: string; cost: number; mult: number }[] = [
  { name: "HardieWrap Weather Barrier 9'x150'", cost: 312.5, mult: 1 },
  { name: 'Fortiflash Butyl 20 mil 6"x75\'', cost: 47.82, mult: 2 },
  { name: 'HardieWrap Seam Tape 2"x165\'', cost: 22.3, mult: 2 },
  { name: 'OSI Quad Max 9.5oz x 12', cost: 152.5, mult: 1 },
  { name: '16ga SF Finish 2-1/2 304SS', cost: 59.86, mult: 2 },
  { name: '18 Gauge 1/4" x 5/8" Staples', cost: 5.0, mult: 1 },
  { name: 'A19 1/4" Staples', cost: 2.5, mult: 1 },
  { name: 'Touch Up Kit', cost: 40.0, mult: 1 },
  { name: '3" Hardie Trim Flat Tabs 100/box', cost: 54.88, mult: 1 },
  { name: 'Coil Siding 2-1/2x.092 Ring Shank', cost: 54.57, mult: 1 },
  { name: 'Moistop Sealant White 10.1oz', cost: 102.48, mult: 1 },
  { name: 'Slip Sheets', cost: 83.0, mult: 1 },
]

export const DEMO_RATES: Record<string, number> = {
  'Demo Siding and Trim': 2.6,
  'Demo Trim': 1,
  'Demo Stucco': 4.35,
}

export interface StaffQuoteInput {
  sqft: number
  stories: number
  demo: string
  markup: number
  /** index → quantity */
  qty: Record<number, number | string>
}

export interface StaffQuoteResult {
  rows: { name: string; unit: string; cost: number; install: number; qty: number; lineTotal: number; i: number }[]
  material: number
  labor: number
  installMat: number
  demoCost: number
  permits: number
  debris: number
  totalCost: number
  sale: number
  profit: number
  margin: number
}

export function computeStaffQuote(
  { sqft, stories, demo, markup, qty }: StaffQuoteInput,
  pricing: PricingConstants = DEFAULT_PRICING,
): StaffQuoteResult {
  let material = 0
  let labor = 0
  const rows = STAFF_PRODUCTS.map((p, i) => {
    const q = parseFloat(String(qty[i] ?? '')) || 0
    const m = p.cost * q
    const ins = p.install * q
    material += m
    labor += ins
    return { name: p.name, unit: p.unit, cost: p.cost, install: p.install, qty: q, lineTotal: m + ins, i }
  })
  let installMat = 0
  for (const im of INSTALL_MATERIALS) {
    installMat += im.cost * ((sqft / 1000) * stories * im.mult)
  }
  const demoCost = demo && DEMO_RATES[demo] ? sqft * DEMO_RATES[demo] : 0
  const permits = sqft * pricing.permitsPerSqft
  const debris = sqft * pricing.debrisPerSqft
  const totalCost = material + installMat + labor + demoCost + permits + debris
  const sale = totalCost * (markup || pricing.markup)
  const profit = sale - totalCost
  const margin = sale > 0 ? (profit / sale) * 100 : 0
  return { rows, material, labor, installMat, demoCost, permits, debris, totalCost, sale, profit, margin }
}

// ── Formatting helpers ──────────────────────────────────────────────────────

export const fmtUSD = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const fmtUSD2 = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
