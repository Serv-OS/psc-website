'use client'

import { useState, type CSSProperties } from 'react'

import { applyUrl, FIN, monthlyPayment, usd } from '@/lib/financing'
import { trackApply } from './track'

type Props = {
  /** Starting loan amount, e.g. a quote total. */
  initialAmount?: number
  initialApr?: number
  initialYears?: number
  /** Where on the site this sits, for tracking. */
  place?: string
  compact?: boolean
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function Slider(props: {
  label: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  display: string
  minLabel: string
  maxLabel: string
  parse: (s: string) => number
  onChange: (v: number) => void
}) {
  const { label, hint, value, min, max, step, display, minLabel, maxLabel, parse, onChange } = props
  const [text, setText] = useState<string | null>(null)
  const pct = ((value - min) / (max - min)) * 100
  const id = `calc-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: 16, fontWeight: 800, color: '#16261c' }}>{label}</label>
      <div style={{ fontSize: 13.5, color: '#6a766d', marginTop: 4 }}>{hint}</div>
      <input
        id={id}
        inputMode="decimal"
        value={text ?? display}
        onFocus={() => setText(display)}
        onChange={(e) => {
          setText(e.target.value)
          const v = parse(e.target.value)
          if (Number.isFinite(v)) onChange(clamp(v, min, max))
        }}
        onBlur={() => setText(null)}
        style={{
          marginTop: 10, width: '100%', fontSize: 16, fontWeight: 600, color: '#16261c',
          padding: '13px 14px', border: '1.5px solid #d6ded6', borderRadius: 10, background: '#fff', outline: 'none',
        }}
      />
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="psc-range"
        style={{ '--fill': `${pct}%` } as CSSProperties}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#8a958c' }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

export function PaymentCalculator({ initialAmount = 30000, initialApr = 9.99, initialYears = 10, place = 'calculator', compact = false }: Props) {
  const [amount, setAmount] = useState(clamp(Math.round(initialAmount), FIN.minLoan, FIN.maxLoan))
  const [apr, setApr] = useState(initialApr)
  const [years, setYears] = useState(initialYears)

  const monthly = monthlyPayment(amount, apr, years)
  const months = Math.round(years * 12)
  const total = monthly * months
  const interest = Math.max(0, total - amount)
  const num = (s: string) => Number(String(s).replace(/[^0-9.]/g, ''))

  return (
    <div className="split" style={{ gridTemplateColumns: compact ? '1fr' : '1.05fr .95fr', gap: compact ? 28 : 48, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Slider
          label="Amount"
          hint="Type the amount or move the slider"
          value={amount}
          min={FIN.minLoan}
          max={FIN.maxLoan}
          step={500}
          display={usd(amount)}
          minLabel={usd(FIN.minLoan)}
          maxLabel={usd(FIN.maxLoan)}
          parse={num}
          onChange={(v) => setAmount(Math.round(v))}
        />
        <Slider
          label="APR*"
          hint="Your rate depends on your credit. Try a few."
          value={apr}
          min={0}
          max={36}
          step={0.01}
          display={`${apr.toFixed(2)}%`}
          minLabel="0%"
          maxLabel="36%"
          parse={num}
          onChange={(v) => setApr(Math.round(v * 100) / 100)}
        />
        <Slider
          label="Loan length"
          hint="Years to pay it back"
          value={years}
          min={1}
          max={20}
          step={1}
          display={`${years} ${years === 1 ? 'year' : 'years'}`}
          minLabel="1 year"
          maxLabel="20 years"
          parse={num}
          onChange={(v) => setYears(Math.max(1, Math.round(v)))}
        />
      </div>

      <div style={{ background: '#fff', border: '1px solid #e7ece7', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 56px rgba(14,52,29,.12)' }}>
        <div style={{ background: 'linear-gradient(135deg,#206a38,#0e341d)', color: '#fff', padding: '26px 28px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#bcd9c2', letterSpacing: '.3px' }}>Estimated monthly payment**</div>
          <div style={{ fontSize: 'clamp(38px,5vw,52px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginTop: 6 }} aria-live="polite">
            {usd(monthly, true)}
          </div>
          <div style={{ fontSize: 14, color: '#d8eadc', marginTop: 6 }}>
            for {months} months at {apr.toFixed(2)}% APR
          </div>
        </div>
        <div style={{ padding: '22px 28px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            ['Borrowed', usd(amount)],
            ['Interest', usd(interest)],
            ['Total repaid', usd(total)],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 12.5, color: '#6a766d', fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#16261c', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0 28px 26px' }}>
          <a
            href={applyUrl(place)}
            target="_blank"
            rel="noopener"
            onClick={() => trackApply(place)}
            className="btn btn-primary"
            style={{ display: 'block', textAlign: 'center', fontSize: 16.5, padding: '16px 20px' }}
          >
            See your personalized offers &rarr;
          </a>
          <div style={{ fontSize: 12.5, color: '#6a766d', textAlign: 'center', marginTop: 10 }}>
            Checking your rate won&apos;t affect your credit score.
          </div>
        </div>
      </div>

      <div style={{ gridColumn: '1 / -1', fontSize: 12, color: '#8a958c', lineHeight: 1.6 }}>
        *Your interest rate will vary based on your credit score and creditworthiness. Rates start from {FIN.lowestApr}% APR.
        <br />
        **This is an estimate for a fixed rate loan, not an offer. Your actual payment, rate and term will be in your specific offer from the lender.
      </div>
    </div>
  )
}
