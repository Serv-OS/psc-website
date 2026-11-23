/**
 * Send a website lead to the CRM (psc-crm forms-public). Shared by the live
 * form route and the one off resend route.
 */
// Forward each lead into the ServOS CRM (psc-crm) for lead management. Public,
// no-auth ingest endpoint; overridable via env for other environments.
const CRM_FORMS_URL =
  process.env.CRM_FORMS_URL ||
  'https://xxazlzkhwraqfeqjzviz.supabase.co/functions/v1/forms-public'

const usdRange = (lo?: number, hi?: number) => {
  const f = (n?: number) => (typeof n === 'number' ? '$' + Math.round(n).toLocaleString('en-US') : '')
  return lo || hi ? `${f(lo)} – ${f(hi)}`.trim() : ''
}

// Best-effort: never let a CRM hiccup break the website form.
export async function forwardToCrm(args: {
  type: 'contact' | 'quote'
  name: string
  email: string
  phone: string
  c: any
  body: any
}) {
  const { type, name, email, phone, c, body } = args
  const parts = name.trim().split(/\s+/)
  const first_name = parts[0] || ''
  const last_name = parts.slice(1).join(' ')

  let slug: string
  let data: Record<string, any>
  if (type === 'contact') {
    slug = 'website-contact'
    data = {
      first_name, last_name, email, phone,
      address: c.address, city: c.city, zip: c.zip,
      interest: body?.interest, message: body?.message,
    }
  } else {
    slug = 'website-estimate'
    const sel = body?.selection || {}
    const proj = body?.project || {}
    const est = body?.estimate || {}
    data = {
      first_name, last_name, email, phone,
      address: c.address,
      profile: sel.profile, texture: sel.texture, color: sel.color,
      sqft: proj.sqft, stories: proj.stories,
      estimate_range: usdRange(est.low, est.high),
      notes: c.notes || body?.notes,
    }
  }
  data.sms_consent = body?.sms_consent === true
  if (['yes', 'maybe', 'no'].includes(body?.financing)) data.financing = body.financing

  for (const k of Object.keys(data)) {
    if (data[k] === undefined || data[k] === null || data[k] === '') delete data[k]
  }

  // The CRM refuses a form without reCAPTCHA unless the request proves it is
  // this website's own server (CRM_WEBSITE_SECRET, matched against the CRM's
  // server_settings). Until 23 Nov 2026 no secret was sent and the answer was
  // never read, so every contact form was refused without anyone knowing.
  try {
    const res = await fetch(CRM_FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CRM_WEBSITE_SECRET ? { 'x-website-secret': process.env.CRM_WEBSITE_SECRET } : {}),
      },
      body: JSON.stringify({ slug, data, page_url: body?.page_url || null }),
    })
    if (!res.ok) {
      console.error(`CRM lead forward REFUSED (${slug}): HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
      return false
    }
    return true
  } catch (e) {
    console.error('CRM lead forward failed', e)
    return false
  }
}
