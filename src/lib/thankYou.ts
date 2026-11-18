/**
 * After a form is sent, go to a real /thank-you page so Google Ads can count
 * the sign up (Peter, 18 Nov 2026: "no thank you page ... we cannot track
 * signups"). A full page load, not a client route change, so a URL based
 * conversion and the conversion tag both see it.
 *
 * The visitor's first name and estimate travel in sessionStorage, never in the
 * address: anything in the URL ends up in Google's reports.
 */
export type ThankYouForm = 'contact' | 'quote' | 'instant-quote'
export type ThankYouDetails = { first?: string; estimate?: string; note?: string }

export const THANKS_KEY = 'psc_thank_you'

export function goToThankYou(form: ThankYouForm, details: ThankYouDetails = {}) {
  try { sessionStorage.setItem(THANKS_KEY, JSON.stringify({ form, ...details, at: Date.now() })) } catch { /* private mode: the page still says thanks */ }
  window.location.assign(`/thank-you?form=${form}`)
}
