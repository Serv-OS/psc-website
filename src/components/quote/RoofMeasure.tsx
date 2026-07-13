'use client'

// Address search + satellite + draw-the-building measurement. Outputs the
// building FOOTPRINT area (ft²) and PERIMETER (ft) from real map coordinates,
// which the instant-quote page turns into siding wall area (perimeter × stories).
//
// Drawing is done with click-to-add-vertex on a google.maps.Polygon — the old
// DrawingManager library was removed in Maps JS v3.65, so we build the polygon
// ourselves (also gives a cleaner, editable result). Phase 2 will pre-fill the
// outline from Google's building data (Solar API).

import { useEffect, useRef, useState, useCallback } from 'react'

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
const M2_TO_FT2 = 10.763910417
const M_TO_FT = 3.280839895

// Load the Maps JS API once (places + geometry — no drawing), shared across mounts.
let mapsPromise: Promise<any> | null = null
function loadMaps(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if ((window as any).google?.maps?.geometry) return Promise.resolve((window as any).google)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    if (!KEY) { reject(new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')); return }
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places,geometry&v=weekly`
    s.async = true
    s.onload = () => resolve((window as any).google)
    s.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(s)
  })
  return mapsPromise
}

export type Measurement = { areaFt2: number; perimeterFt: number; address: string }

export function RoofMeasure({ onMeasure }: { onMeasure: (m: Measurement | null) => void }) {
  const mapEl = useRef<HTMLDivElement>(null)
  const searchEl = useRef<HTMLInputElement>(null)
  const mapRef = useRef<any>(null)
  const polyRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const drawModeRef = useRef(false)
  const addressRef = useRef('')
  const [ready, setReady] = useState(false)
  const [err, setErr] = useState('')
  const [drawing, setDrawing] = useState(false)
  const [measure, setMeasure] = useState<Measurement | null>(null)

  const recompute = useCallback(() => {
    const g = (window as any).google
    const poly = polyRef.current
    if (!poly || !g) return
    const path = poly.getPath()
    if (path.getLength() < 3) { setMeasure(null); onMeasure(null); return }
    const areaM2 = g.maps.geometry.spherical.computeArea(path)
    let perimM = g.maps.geometry.spherical.computeLength(path)
    perimM += g.maps.geometry.spherical.computeDistanceBetween(path.getAt(path.getLength() - 1), path.getAt(0))
    const m: Measurement = {
      areaFt2: Math.round(areaM2 * M2_TO_FT2),
      perimeterFt: Math.round(perimM * M_TO_FT),
      address: addressRef.current,
    }
    setMeasure(m)
    onMeasure(m)
  }, [onMeasure])

  const clearMarkers = () => { markersRef.current.forEach((mk) => mk.setMap(null)); markersRef.current = [] }

  const clearPoly = useCallback(() => {
    if (polyRef.current) { polyRef.current.setMap(null); polyRef.current = null }
    clearMarkers()
    setMeasure(null); onMeasure(null)
  }, [onMeasure])

  const startDraw = useCallback(() => {
    clearPoly()
    drawModeRef.current = true
    setDrawing(true)
  }, [clearPoly])

  const finishDraw = useCallback(() => {
    drawModeRef.current = false
    setDrawing(false)
    clearMarkers()
    const g = (window as any).google
    const poly = polyRef.current
    if (poly && poly.getPath().getLength() >= 3) {
      poly.setEditable(true)
      const path = poly.getPath()
      ;['set_at', 'insert_at', 'remove_at'].forEach((ev) => g.maps.event.addListener(path, ev, recompute))
      recompute()
    } else {
      clearPoly()
    }
  }, [clearPoly, recompute])

  useEffect(() => {
    let cancelled = false
    loadMaps().then((g) => {
      if (cancelled || !mapEl.current) return
      const map = new g.maps.Map(mapEl.current, {
        center: { lat: 37.5629, lng: -122.3255 }, // San Mateo, CA
        zoom: 19, mapTypeId: 'satellite', tilt: 0, disableDefaultUI: true,
        zoomControl: true, gestureHandling: 'greedy',
      })
      mapRef.current = map

      // Click to add a vertex while in draw mode.
      g.maps.event.addListener(map, 'click', (e: any) => {
        if (!drawModeRef.current || !e.latLng) return
        if (!polyRef.current) {
          polyRef.current = new g.maps.Polygon({
            map, paths: [e.latLng], editable: false, clickable: false,
            fillColor: '#206a38', fillOpacity: 0.25, strokeColor: '#206a38', strokeWeight: 2,
          })
        } else {
          polyRef.current.getPath().push(e.latLng)
        }
        markersRef.current.push(new g.maps.Marker({
          position: e.latLng, map, clickable: false,
          icon: { path: g.maps.SymbolPath.CIRCLE, scale: 4, fillColor: '#fff', fillOpacity: 1, strokeColor: '#206a38', strokeWeight: 2 },
        }))
        recompute()
      })

      if (searchEl.current) {
        const ac = new g.maps.places.Autocomplete(searchEl.current, {
          fields: ['geometry', 'formatted_address'],
          types: ['address'],
          componentRestrictions: { country: 'us' },
        })
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          addressRef.current = place.formatted_address || ''
          if (place.geometry?.location) {
            map.setCenter(place.geometry.location)
            map.setZoom(20)
            clearPoly()
          }
        })
      }
      setReady(true)
    }).catch((e) => setErr(e.message))
    return () => { cancelled = true }
  }, [clearPoly, recompute])

  if (!KEY) {
    return (
      <div style={{ border: '1px dashed #c9d3c9', borderRadius: 16, padding: 28, textAlign: 'center', color: '#5b675e', background: '#fbfcfa' }}>
        <div style={{ fontWeight: 700, color: '#16261c', marginBottom: 6 }}>Map measurement not configured yet</div>
        <div style={{ fontSize: 14 }}>Add a Google Maps API key (<code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>) to enable the satellite measure tool.</div>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={searchEl}
        placeholder="Enter your home address…"
        style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid #d6ded6', fontSize: 15, marginBottom: 10, fontFamily: 'inherit' }}
      />
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #e7ece7' }}>
        <div ref={mapEl} style={{ width: '100%', height: 380 }} />
        {!ready && !err && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b675e', background: '#f1f5f0' }}>Loading map…</div>}
        {err && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c', background: '#fef2f2', padding: 20, textAlign: 'center' }}>{err}</div>}
        {drawing && <div style={{ position: 'absolute', top: 10, left: 10, right: 10, background: 'rgba(14,52,29,.92)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 12px', borderRadius: 10, textAlign: 'center' }}>Click each corner of the house, then press “Finish outline”.</div>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 12 }}>
        {!drawing && (
          <button type="button" onClick={startDraw} disabled={!ready} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>
            {measure ? 'Redraw outline' : 'Draw the building outline'}
          </button>
        )}
        {drawing && (
          <button type="button" onClick={finishDraw} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>Finish outline</button>
        )}
        {measure && !drawing && (
          <button type="button" onClick={clearPoly} className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 14 }}>Clear</button>
        )}
        {measure && (
          <span style={{ fontSize: 14, color: '#16261c' }}>
            Footprint: <strong>{measure.areaFt2.toLocaleString('en-US')} sq ft</strong> · Perimeter: <strong>{measure.perimeterFt.toLocaleString('en-US')} ft</strong>
          </span>
        )}
      </div>
      <div style={{ fontSize: 12.5, color: '#6a766d', marginTop: 8 }}>
        Search your address, click around the edge of your roof to trace it, then Finish. Drag the points to fine‑tune.
      </div>
    </div>
  )
}
