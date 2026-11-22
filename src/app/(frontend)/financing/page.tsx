import Link from 'next/link'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/ui/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQ } from '@/components/ui/FAQ'
import { PaymentCalculator } from '@/components/financing/PaymentCalculator'
import { ApplyButton } from '@/components/financing/ApplyButton'
import { breadcrumbLd } from '@/lib/jsonld'
import { CREDIT_TIERS, DISCLOSURE_LENDER, DISCLOSURE_RATES, FIN, REPRESENTATIVE_EXAMPLE } from '@/lib/financing'

export const metadata: Metadata = {
  title: 'Siding Financing | Rates from 7.99% APR',
  description:
    'Finance your new siding with monthly payments. Loans from $500 to $200,000, rates from 7.99% APR, and checking your rate will not affect your credit score. Bay Area homeowners apply in minutes.',
  alternates: { canonical: '/financing' },
}

const GAUGE: Record<string, { color: string; from: number; to: number; needle: number }> = {
  good: { color: '#2e9e4f', from: 50, to: 90, needle: 62 },
  fair: { color: '#e2b322', from: -20, to: 20, needle: 0 },
  low: { color: '#d9534f', from: -90, to: -50, needle: -62 },
}

// A point on the dial: angle in degrees from straight up, clockwise.
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180
  return `${(40 + r * Math.sin(a)).toFixed(2)} ${(50 - r * Math.cos(a)).toFixed(2)}`
}

/** A small speedometer: the coloured band shows where the needle sits. */
function Gauge({ tone }: { tone: string }) {
  const g = GAUGE[tone]
  const band = `M${pt(g.from, 32)} A32 32 0 0 1 ${pt(g.to, 32)} L${pt(g.to, 22)} A22 22 0 0 0 ${pt(g.from, 22)} Z`
  return (
    <svg width="104" height="66" viewBox="0 0 80 58" aria-hidden="true">
      <path d={band} fill={g.color} />
      <path d={`M${pt(-90, 32)} A32 32 0 0 1 ${pt(90, 32)}`} fill="none" stroke="#3c5a4a" strokeWidth="2" />
      <path d={`M${pt(-90, 22)} A22 22 0 0 1 ${pt(90, 22)}`} fill="none" stroke="#3c5a4a" strokeWidth="2" />
      {[-90, -50, -20, 20, 50, 90].map((a) => (
        <path key={a} d={`M${pt(a, 22)} L${pt(a, 32)}`} stroke="#3c5a4a" strokeWidth="2" />
      ))}
      <path d={`M40 50 L${pt(g.needle, 26)}`} stroke="#3c5a4a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="50" r="4" fill="#fff" stroke="#3c5a4a" strokeWidth="2" />
    </svg>
  )
}

const WHY = [
  ['✓', 'See your options with a soft credit check that won’t affect your score'],
  ['⌂', 'No home equity or appraisal needed for personal loans'],
  ['◷', 'Results in about 2 minutes'],
  ['▦', 'Money in as little as 2 to 3 business days'],
  ['$', `Borrow from $500 up to $${FIN.maxLoan.toLocaleString('en-US')}^`],
  ['%', `Rates from ${FIN.lowestApr}% APR^`],
  ['★', `Credit scores from ${FIN.lowestScore} can apply^`],
  ['☶', 'Covers your whole project: siding, trim, insulation and more'],
  ['↻', 'Compare offers from several lenders in one place'],
]

const STEPS = [
  ['Get your quote', 'Use our instant quote or book a free consultation so you know your project cost.'],
  ['Check your rate', 'Fill in one short form with Enhancify. Seeing your offers uses a soft check, so your score is safe.'],
  ['Pick your offer', 'Choose the monthly payment that suits you. Funds can arrive in 2 to 3 business days.'],
  ['We get to work', 'We schedule your install and you pay the lender month by month.'],
]

const FAQS = [
  { q: 'Will checking my rate hurt my credit score?', a: 'No. Seeing your options uses a soft credit inquiry, which does not affect your score. If you choose a loan, the lender may then do a full credit check to finalize it.' },
  { q: 'Who provides the financing?', a: 'Financing is arranged through Enhancify, which matches you with its network of lending partners. Peninsula Siding Company is not a lender and does not make credit decisions. Your loan agreement is with the lender you choose.' },
  { q: 'How much can I borrow?', a: `From $500 up to $${FIN.maxLoan.toLocaleString('en-US')}, depending on your credit and the lender. Higher amounts usually need good or excellent credit.` },
  { q: 'What rate will I get?', a: `Rates start from ${FIN.lowestApr}% APR for the strongest credit. Your actual rate depends on your credit score, income and the lender, and you will see it before you accept anything.` },
  { q: 'Do I need equity in my home?', a: 'Not for personal loans. There is no appraisal and your home is not used as security. Some homeowners also choose to see home equity offers, which is optional.' },
  { q: 'How long does it take?', a: 'Most people see their options in about 2 minutes. Once you accept an offer, funds can arrive in as little as 2 to 3 business days.' },
  { q: 'Can I finance only part of the project?', a: 'Yes. You choose the amount you apply for, so you can pay part up front and finance the rest.' },
  { q: 'Is there a penalty for paying early?', a: 'That depends on the lender. Check the terms of the offer you choose before you accept it.' },
]

export default function FinancingPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Financing', url: '/financing' }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg,#fbfcfa 0%,#eef4ee 100%)' }}>
        <div className="container" style={{ padding: '30px 24px 0' }}>
          <div style={{ fontSize: 13, color: '#6a766d', fontWeight: 500 }}>
            <Link href="/" style={{ color: '#6a766d' }}>Home</Link> <span style={{ margin: '0 6px', color: '#b8c4ba' }}>/</span> <span style={{ color: '#206a38', fontWeight: 600 }}>Financing</span>
          </div>
        </div>
        <div className="split container" style={{ padding: '40px 24px 64px', gridTemplateColumns: '1.1fr .9fr', gap: 50 }}>
          <div style={{ animation: 'psc-fade .6s ease both' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '1.5px', color: '#206a38', textTransform: 'uppercase' }}>Siding financing</div>
            <h1 style={{ fontSize: 'clamp(32px,4.2vw,54px)', fontWeight: 800, letterSpacing: '-1.4px', lineHeight: 1.05, color: '#16261c', marginTop: 12 }}>
              New siding now,<br /><span style={{ color: '#206a38' }}>easy monthly payments.</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.65, color: '#46544a', maxWidth: 540 }}>
              Protect your home without spending all your savings. Borrow from $500 to ${FIN.maxLoan.toLocaleString('en-US')}, with rates from {FIN.lowestApr}% APR*. Checking your rate takes about 2 minutes and won&apos;t affect your credit score.
            </p>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <ApplyButton place="financing-hero" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Check your rate &rarr;</ApplyButton>
              <a href="#calculator" className="btn btn-ghost" style={{ fontSize: '15.5px', padding: '15px 28px' }}>Estimate my payment</a>
            </div>
            <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: '8px 22px', fontSize: 14, color: '#3a4a40', fontWeight: 600 }}>
              <span>✓ Soft credit check</span><span>✓ Results in 2 minutes</span><span>✓ Funds in 2 to 3 days</span>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 22, padding: 30, boxShadow: '0 24px 56px rgba(14,52,29,.14)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6a766d', textTransform: 'uppercase', letterSpacing: '1px' }}>At a glance</div>
            {[
              ['Loan amounts', `$500 to $${FIN.maxLoan.toLocaleString('en-US')}`],
              ['Rates from', `${FIN.lowestApr}% APR*`],
              ['Credit scores from', `${FIN.lowestScore}`],
              ['Time to see offers', 'About 2 minutes'],
              ['Funding', '2 to 3 business days'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid #eef2ee', fontSize: 15 }}>
                <span style={{ color: '#56635a' }}>{k}</span><strong style={{ color: '#16261c' }}>{v}</strong>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#8a958c', marginTop: 14, lineHeight: 1.5 }}>Through Enhancify and its lending partners. Subject to credit approval.</div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" style={{ background: '#fff', scrollMarginTop: 90 }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Payment calculator" title="Turn your project into a monthly payment" maxWidth={760} />
          <PaymentCalculator place="financing-calculator" />
        </div>
      </section>

      {/* CREDIT TIERS */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Every credit score" title="What can I borrow with my credit?" maxWidth={720} />
          <div className="cols-3">
            {CREDIT_TIERS.map((t) => (
              <div key={t.name} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 20, padding: '30px 26px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Gauge tone={t.tone} />
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#16261c', marginTop: 12 }}>{t.name}</h3>
                <div style={{ marginTop: 16, fontSize: 15.5, fontWeight: 700, color: '#26362c' }}>Loan amounts: {t.range}</div>
                <div style={{ marginTop: 8, fontSize: 15.5, fontWeight: 700, color: '#26362c' }}>APR from {t.apr}*</div>
                <p style={{ marginTop: 14, fontSize: 14.5, color: '#56635a', lineHeight: 1.55, flex: 1 }}>{t.note}</p>
                <ApplyButton place={`financing-tier-${t.tone}`} style={{ marginTop: 22, width: '100%', textAlign: 'center', padding: '14px 20px', fontSize: 16 }}>Check your rate</ApplyButton>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: 12.5, color: '#8a958c', lineHeight: 1.6 }}>{DISCLOSURE_RATES}</p>
        </div>
      </section>

      {/* WHY */}
      <section style={{ background: '#fff' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="Why finance with us" title="Simple, fast and safe for your credit" maxWidth={720} />
          <div className="cols-3" style={{ rowGap: 30 }}>
            {WHY.map(([i, t]) => (
              <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto', width: 52, height: 52, borderRadius: 14, background: '#e7f1e8', color: '#206a38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }}>{i}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#26362c', lineHeight: 1.45 }}>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <ApplyButton place="financing-why" style={{ fontSize: 17, padding: '17px 40px' }}>Start your application</ApplyButton>
            <div style={{ fontSize: 12.5, color: '#8a958c', marginTop: 12 }}>^Rates and terms may vary by lending partner.</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#f4f6f3' }}>
        <div className="container" style={{ padding: '84px 24px' }}>
          <SectionHeader eyebrow="How it works" title="From quote to new siding in four steps" maxWidth={720} />
          <div className="cols-4">
            {STEPS.map(([t, d], i) => (
              <div key={t} style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 18, padding: 26 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#206a38', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#16261c', marginTop: 16 }}>{t}</h3>
                <p style={{ fontSize: 14.5, color: '#56635a', lineHeight: 1.55, marginTop: 8 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff' }}>
        <div className="container-narrow" style={{ padding: '84px 24px', maxWidth: 860 }}>
          <SectionHeader eyebrow="Questions" title="Financing FAQs" maxWidth={720} />
          <FAQ items={FAQS} soft />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 72px' }}>
          <div style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)', borderRadius: 22, padding: 48, textAlign: 'center', color: '#fff' }}>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800, letterSpacing: '-.8px' }}>Know your price, then your payment</h2>
            <p style={{ maxWidth: 580, margin: '14px auto 0', fontSize: 16, color: '#bcd9c2', lineHeight: 1.6 }}>
              Get your instant siding quote in minutes, then check your financing rate with no effect on your credit score.
            </p>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/instant-quote" className="btn btn-light" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13 }}>Build my instant quote &rarr;</Link>
              <ApplyButton place="financing-cta" className="btn" style={{ fontSize: 16, padding: '16px 30px', borderRadius: 13, background: 'rgba(255,255,255,.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,.3)' }}>Check your rate</ApplyButton>
            </div>
          </div>
          <div style={{ marginTop: 22, fontSize: 12, color: '#8a958c', lineHeight: 1.65 }}>
            <p>{DISCLOSURE_LENDER}</p>
            <p style={{ marginTop: 8 }}>{REPRESENTATIVE_EXAMPLE}</p>
            <p style={{ marginTop: 8 }}>{DISCLOSURE_RATES}</p>
          </div>
        </div>
      </section>
    </>
  )
}
