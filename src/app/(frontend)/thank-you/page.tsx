import type { Metadata } from 'next'
import { ThankYou } from '@/components/ThankYou'

// Where every website form lands once it is sent, so Google Ads can count the
// sign up by URL ("contains /thank-you") or by the conversion tag fired here.
export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return <ThankYou />
}
