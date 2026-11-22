/* Financing through Enhancify (Peter, 22 Nov 2026).
 *
 * One place for the link, the figures and the wording, so every page says
 * the same thing. The figures are Enhancify's own, from our branded page.
 *
 * US advertising rule (Truth in Lending, Reg Z): a monthly payment, a term or
 * "0%" may only be shown with the APR, the term and the fact that the rate
 * depends on credit right next to it. Every monthly figure on this site comes
 * from monthlyPayment() and is shown beside the APR and term that made it.
 */

export const ENHANCIFY_URL = 'https://www.enhancify.com/peninsula-siding-company'

/** The apply link, tagged so Enhancify and Analytics can tell where people came from. */
export function applyUrl(place: string): string {
  const u = new URL(ENHANCIFY_URL)
  u.searchParams.set('utm_source', 'peninsulasidingcompany.com')
  u.searchParams.set('utm_medium', 'website')
  u.searchParams.set('utm_campaign', 'financing')
  u.searchParams.set('utm_content', place)
  return u.toString()
}

export const FIN = {
  maxLoan: 200000,
  minLoan: 500,
  lowestApr: 7.99,
  lowestScore: 550,
} as const

export const CREDIT_TIERS = [
  { name: 'Excellent / Good', tone: 'good', range: '$500 to $200,000', apr: '7.99%', note: 'The widest choice of lenders and the lowest rates.' },
  { name: 'Fair', tone: 'fair', range: '$500 to $35,000', apr: '10.05%', note: 'Lenders will usually look at your income and other factors.' },
  { name: 'Building credit', tone: 'low', range: '$500 to $10,000', apr: '15.61%', note: 'Options are still available, usually at higher rates.' },
] as const

export const DISCLOSURE_RATES =
  '*Rates shown are the lowest available. Your interest rate will vary based on your creditworthiness. Final terms are set by the lender after you apply. Rates and terms may vary by lending partner.'

export const DISCLOSURE_LENDER =
  'Financing is offered through Enhancify and its lending partners, subject to credit approval. Peninsula Siding Company is not a lender and does not make credit decisions. Checking your options uses a soft credit inquiry that does not affect your credit score; choosing a loan may need a full credit check by the lender.'

export const REPRESENTATIVE_EXAMPLE =
  'Representative example: borrow $5,000 over 3 years at 10% APR. Monthly payment $161.34. Total repaid $5,808.24, of which $808.24 is interest.'

/** Fixed rate monthly payment. apr in percent, years whole or part. */
export function monthlyPayment(amount: number, apr: number, years: number): number {
  const n = Math.max(1, Math.round(years * 12))
  if (!(amount > 0)) return 0
  const r = apr / 100 / 12
  if (r <= 0) return amount / n
  return (amount * r) / (1 - Math.pow(1 + r, -n))
}

export const usd = (v: number, cents = false) =>
  v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })
