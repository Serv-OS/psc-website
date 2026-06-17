import type { Metadata } from 'next'

import { builtLayout, getPage } from '@/lib/data'
import { PuckRender } from '@/builder/PuckRender'
import { LegalDoc, H2, P, UL } from '@/components/legal/LegalDoc'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Peninsula Siding Company, including how we handle mobile/SMS information.',
  alternates: { canonical: '/privacy' },
}

export default async function PrivacyPage() {
  let layout = null
  try {
    layout = builtLayout(await getPage('privacy'))
  } catch {
    layout = null
  }
  if (layout) return <PuckRender data={layout} />

  return (
    <LegalDoc title="Privacy Policy">
      <P>
        This Privacy Policy explains how Peninsula Siding Company (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
        or &ldquo;our&rdquo;) collects, uses, and protects your information when you use our website
        at peninsulasidingcompany.com, request a quote, or communicate with us. Text messages are
        sent on our behalf by <strong>Point of Sale Unified Partners</strong>, our messaging service
        provider.
      </P>

      <H2>1. Information we collect</H2>
      <UL>
        <li><strong>Contact details</strong> you provide: name, email address, phone/mobile number, and property address.</li>
        <li><strong>Project information</strong> you share when requesting a quote or service.</li>
        <li><strong>Site usage data</strong> such as pages viewed and basic device/analytics information.</li>
      </UL>

      <H2>2. How we use your information</H2>
      <UL>
        <li>To prepare quotes and estimates and to provide our siding and construction services.</li>
        <li>To schedule and carry out work, and to communicate with you about your enquiry, quote, job, and account &mdash; by phone, email, and text (SMS/MMS).</li>
        <li>To operate, maintain, and improve our website and services.</li>
        <li>To comply with legal obligations.</li>
      </UL>

      <H2>3. SMS / text messaging &amp; your mobile information</H2>
      <P>
        <strong>
          We do not sell, rent, or share your personal information &mdash; including your mobile
          phone number and your consent to receive SMS messages &mdash; with third parties or
          affiliates for their marketing or promotional purposes.
        </strong>{' '}
        Mobile information is used only to deliver the text messages described in our{' '}
        <a href="/terms" style={{ color: '#176a3a', textDecoration: 'underline' }}>Terms &amp; Conditions</a>{' '}
        and is shared only with our messaging service provider (Point of Sale Unified Partners) as
        needed to send those messages on our behalf. You can opt out of texts at any time by replying
        STOP.
      </P>

      <H2>4. How we share information</H2>
      <P>
        We share information only with trusted service providers who help us operate our business
        &mdash; for example our messaging provider, payment processor, and scheduling tools &mdash;
        and only to the extent needed to provide their service to us, under appropriate
        confidentiality obligations. We may disclose information where required by law. We do not sell
        your personal information.
      </P>

      <H2>5. Data retention</H2>
      <P>
        We keep your information only for as long as needed to provide our services, comply with legal
        and accounting requirements, and resolve disputes.
      </P>

      <H2>6. Your rights</H2>
      <P>
        You may request access to, correction of, or deletion of your personal information, and you
        may opt out of marketing communications at any time. To exercise these rights, contact us at
        info@peninsulasidingcompany.com. To stop text messages, reply STOP to any message.
      </P>

      <H2>7. Security</H2>
      <P>
        We use reasonable administrative, technical, and physical safeguards to protect your
        information. No method of transmission or storage is completely secure, however, and we
        cannot guarantee absolute security.
      </P>

      <H2>8. Children&rsquo;s privacy</H2>
      <P>
        Our website and services are intended for adults and are not directed to children. We do not
        knowingly collect personal information from children.
      </P>

      <H2>9. Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. The version posted on the Site is the
        current version, and your continued use of the Site after changes are posted constitutes
        acceptance.
      </P>

      <H2>10. Contact</H2>
      <P>
        Questions about this Privacy Policy? Contact us at info@peninsulasidingcompany.com.
      </P>
    </LegalDoc>
  )
}
