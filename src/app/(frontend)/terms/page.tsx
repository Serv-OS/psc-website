import type { Metadata } from 'next'

import { builtLayout, getPage } from '@/lib/data'
import { PuckRender } from '@/builder/PuckRender'
import { LegalDoc, H2, P, UL } from '@/components/legal/LegalDoc'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms & Conditions for Peninsula Siding Company, including SMS/text messaging terms.',
  alternates: { canonical: '/terms' },
}

export default async function TermsPage() {
  // Render the builder (Puck) layout if the owner has built one; otherwise show
  // the compliant fallback so the page is always live and review-ready.
  let layout = null
  try {
    layout = builtLayout(await getPage('terms'))
  } catch {
    layout = null
  }
  if (layout) return <PuckRender data={layout} />

  return (
    <LegalDoc title="Terms & Conditions">
      <P>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the website at
        peninsulasidingcompany.com (the &ldquo;Site&rdquo;) and the products, estimates, and services
        provided by Peninsula Siding Company (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        By using the Site, requesting a quote, or communicating with us, you agree to these Terms.
      </P>

      <H2>1. Services, quotes &amp; estimates</H2>
      <P>
        We provide siding and related exterior construction products and services. Quotes and
        estimates are based on the information available at the time and are not a binding contract
        until accepted in writing by both parties; they may change if the scope, site conditions, or
        material costs change. Online &ldquo;instant estimates&rdquo; are approximate ranges for
        guidance only and are not a formal quote.
      </P>

      <H2>2. SMS / text messaging terms</H2>
      <P>
        <strong>Program description.</strong> By providing your mobile telephone number to Peninsula
        Siding Company &mdash; for example when you request a quote, complete a form on our Site, or
        contact us by phone or text &mdash; you agree to receive text (SMS/MMS) messages from us
        related to our services. This is a transactional and customer-care messaging program. Text
        messages are sent on our behalf by <strong>Point of Sale Unified Partners</strong>, our
        messaging service provider and the registered sender for this messaging program.
      </P>
      <UL>
        <li><strong>Types of messages:</strong> appointment and installation scheduling and reminders, job and project status updates, quote and invoice notifications, account and service notices, and one-to-one replies from our team.</li>
        <li><strong>Message frequency</strong> varies based on your interactions with us.</li>
        <li><strong>Message and data rates may apply.</strong> We do not charge for the messages, but your mobile carrier&rsquo;s standard rates may apply.</li>
        <li><strong>Opt-out:</strong> reply <strong>STOP</strong> at any time to stop messages. We will send a one-time confirmation and will not send further texts unless you opt back in by replying <strong>START</strong>.</li>
        <li><strong>Help:</strong> reply <strong>HELP</strong>, or contact us at info@peninsulasidingcompany.com.</li>
        <li>Mobile carriers are not liable for delayed or undelivered messages, and carrier support may vary.</li>
      </UL>
      <P>
        Your information is handled in accordance with our{' '}
        <a href="/privacy" style={{ color: '#176a3a', textDecoration: 'underline' }}>Privacy Policy</a>.
        We do <strong>not</strong> sell or share your mobile information, or your consent to receive
        text messages, with third parties or affiliates for their own marketing purposes.
      </P>

      <H2>3. Use of the Site</H2>
      <P>
        You agree to use the Site lawfully and not to disrupt it, access it without authorization, or
        use it to infringe the rights of others. We may suspend or withdraw access to the Site at any
        time without notice.
      </P>

      <H2>4. Intellectual property</H2>
      <P>
        All content on the Site (text, images, logos, and design) is owned by or licensed to
        Peninsula Siding Company and may not be copied or reused without our prior written permission.
      </P>

      <H2>5. Disclaimers &amp; limitation of liability</H2>
      <P>
        The Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, to
        the fullest extent permitted by law. We are not liable for any indirect, incidental, or
        consequential damages arising from your use of the Site. Workmanship and product warranties
        for services we perform are governed by the separate written agreement for that work.
      </P>

      <H2>6. Governing law</H2>
      <P>
        These Terms are governed by the laws of the State of California, USA, and you agree to the
        exclusive jurisdiction of the state and federal courts located in California for any dispute
        arising from them.
      </P>

      <H2>7. Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. The version posted on the Site is the current
        version, and your continued use after changes are posted constitutes acceptance.
      </P>

      <H2>8. Contact</H2>
      <P>Questions about these Terms? Contact us at info@peninsulasidingcompany.com.</P>
    </LegalDoc>
  )
}
