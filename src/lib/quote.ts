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

// ── What we're replacing (demolition) ───────────────────────────────────────
export type DemoKey = 'siding' | 'stucco' | 'trim' | 'newbuild'
export const DEMO_OPTIONS: Record<DemoKey, { label: string; sub: string; ratePerSqft: number }> = {
  siding: { label: 'Existing siding', sub: 'Wood, fiber-cement, vinyl, aluminium or similar', ratePerSqft: 2.6 },
  stucco: { label: 'Stucco', sub: 'Cement stucco — heavier tear-off & disposal', ratePerSqft: 4.35 },
  trim: { label: 'Trim only', sub: 'Existing siding stays; we replace the trim', ratePerSqft: 1 },
  newbuild: { label: 'New build', sub: 'Nothing to remove — bare sheathing', ratePerSqft: 0 },
}

// ── Surface textures per profile (visual only — no price difference) ─────────
export interface Texture { key: string; label: string }
export const TEXTURES: Record<ProfileKey, Texture[]> = {
  lap: [
    { key: 'cedarmill', label: 'Select Cedarmill (Wood Grain)' },
    { key: 'smooth', label: 'Smooth' },
  ],
  panel: [
    { key: 'cedarmill', label: 'Cedarmill (Wood Grain)' },
    { key: 'smooth', label: 'Smooth' },
    { key: 'stucco', label: 'Stucco' },
    { key: 'sierra8', label: 'Sierra 8' },
  ],
  shingle: [
    { key: 'straight', label: 'Straight Edge' },
    { key: 'staggered', label: 'Staggered Edge' },
  ],
  artisan: [
    { key: 'lap', label: 'Artisan Lap' },
    { key: 'vgroove', label: 'V-Groove' },
    { key: 'shiplap', label: 'Shiplap' },
  ],
}

// ── Finish: ColorPlus® (factory) vs Primed for paint ────────────────────────
export type FinishKey = 'colorplus' | 'primed'
/** Per-profile material + install $/sqft by finish (sourced from STAFF_PRODUCTS). */
export const FINISH_PRICING: Record<ProfileKey, Record<FinishKey, { cost: number; install: number }>> = {
  lap: { colorplus: { cost: 4.8, install: 5.5 }, primed: { cost: 2.25, install: 4.5 } },
  panel: { colorplus: { cost: 5.0, install: 5.5 }, primed: { cost: 2.4, install: 5.5 } },
  shingle: { colorplus: { cost: 11.0, install: 6.5 }, primed: { cost: 8.0, install: 5.5 } },
  artisan: { colorplus: { cost: 9.0, install: 8.0 }, primed: { cost: 9.0, install: 8.0 } },
}

export const PRIMED_WARNING =
  'Primed James Hardie® siding ships pre-primed but not painted, so it must be finished with a quality 100% acrylic exterior topcoat within 180 days of installation per the manufacturer’s guidelines. Please schedule your painter within this window — painting on time protects the boards from moisture and keeps your product warranty intact.'
export const COLORPLUS_NOTE =
  'ColorPlus® Technology is a factory baked-on finish — it arrives in your chosen colour, never needs field painting, and carries a 15-year limited finish warranty against peeling, cracking and chipping.'

// ── Board & batten: batten count + cost ─────────────────────────────────────
// Battens run vertically; standard look is 16" on-centre (HardieTrim batten is
// 0.75" × 2.5" × 12 ft). runs = floor(width×12 / spacing) + 1; boards = runs ×
// ceil(height / 12ft) + 10% waste. Battens only apply to the 'panel' profile.
export const BATTEN_SPACING_IN = 16
export const BATTEN_UNIT_COST: Record<FinishKey, number> = { colorplus: 21, primed: 14 }
export function battenBoardCount(perimeterFt: number, stories: number, coverageFactor: number, spacingIn = BATTEN_SPACING_IN): number {
  if (!perimeterFt) return 0
  const widthFt = perimeterFt * coverageFactor
  const runs = Math.floor((widthFt * 12) / spacingIn) + 1
  const boardsPerRun = Math.ceil((9 * stories) / 12)
  return Math.ceil(runs * boardsPerRun * 1.1)
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
  finish?: FinishKey
  demoKey?: DemoKey
  /** Number of 12-ft batten boards (board & batten only). */
  battenBoards?: number
}

export interface CustomerEstimate {
  sqft: number
  material: number
  install: number
  installMat: number
  permits: number
  debris: number
  demo: number
  batten: number
  totalCost: number
  sale: number
  low: number
  high: number
}

/** Returns the full cost breakdown internally + the public-facing rounded range. */
export function computeCustomerEstimate(
  { profile, sqft, stories, finish = 'colorplus', demoKey, battenBoards = 0 }: CustomerEstimateInput,
  pricing: PricingConstants = DEFAULT_PRICING,
): CustomerEstimate {
  const fin = FINISH_PRICING[profile][finish]
  const material = fin.cost * sqft
  const install = fin.install * sqft
  const installMat = (sqft / 1000) * stories * pricing.installMatPer1000PerStory
  const permits = sqft * pricing.permitsPerSqft
  const debris = sqft * pricing.debrisPerSqft
  const demo = demoKey ? sqft * DEMO_OPTIONS[demoKey].ratePerSqft : 0
  const batten = profile === 'panel' ? battenBoards * BATTEN_UNIT_COST[finish] : 0
  const totalCost = material + install + installMat + permits + debris + demo + batten
  const sale = totalCost * pricing.markup
  const low = Math.round((sale * pricing.rangeLow) / 100) * 100
  const high = Math.round((sale * pricing.rangeHigh) / 100) * 100
  return { sqft, material, install, installMat, permits, debris, demo, batten, totalCost, sale, low, high }
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

/** James Hardie Statement Collection® — 19 colours (hex approximated for the on-screen visualiser). */
export const COLORS: SidingColor[] = [
  { name: 'Arctic White', hex: '#ECEBE4' },
  { name: 'Cobble Stone', hex: '#C9BCA0' },
  { name: 'Navajo Beige', hex: '#C2AE8E' },
  { name: 'Khaki Brown', hex: '#8C7B66' },
  { name: 'Monterey Taupe', hex: '#9C8E7B' },
  { name: 'Timber Bark', hex: '#6E5D4E' },
  { name: 'Rich Espresso', hex: '#4A3B30' },
  { name: 'Mountain Sage', hex: '#8C9379' },
  { name: 'Light Mist', hex: '#D3D6CF' },
  { name: 'Pearl Gray', hex: '#B9BCB6' },
  { name: 'Gray Slate', hex: '#6E746F' },
  { name: 'Boothbay Blue', hex: '#6E8A95' },
  { name: 'Evening Blue', hex: '#3F525A' },
  { name: 'Deep Ocean', hex: '#2E4654' },
  { name: 'Aged Pewter', hex: '#7C807E' },
  { name: 'Night Gray', hex: '#4B4E4D' },
  { name: 'Iron Gray', hex: '#3B3D3C' },
  { name: 'Countrylane Red', hex: '#7E3B34' },
  { name: 'Midnight Black', hex: '#23231F' },
]

// ── "What's included" copy (customer-facing) ────────────────────────────────
export const INCLUDED = {
  removalDisposal:
    'When we’re replacing existing siding, our crew handles the complete removal of your current cladding and hauls every bit of it away for proper disposal — no debris left in your yard and no dump runs for you to manage. We leave your home clean and fully prepared for the new James Hardie® system.',
  permits:
    'We pull every permit your project requires and coordinate all inspections from start to finish, working directly with your local building department. There’s no paperwork or red tape for you to navigate, and the installation stays fully compliant and on schedule.',
  installation:
    'Complete, professional installation built to James Hardie’s published specification: a weather-resistive barrier (such as HardieWrap®), proper flashing at every penetration and transition, manufacturer-approved fasteners, quality sealant and caulking, and finished trim throughout. Every material and all the labour needed to finish the job to spec is included.',
  dryRotExclusion:
    'Replacement of underlying plywood or sheathing is not included in this estimate. Occasionally hidden dry rot or structural damage is only revealed once the old siding is removed; if we find any, we’ll document it, walk you through it, and provide a separate quote to repair it before we proceed. In most cases our on-site assessor can flag the likelihood of this during your assessment, so you’ll have a clear picture well before the project begins.',
}

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
