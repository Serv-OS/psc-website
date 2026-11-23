/**
 * Blog posts written by the CRM's content autopilot (Peter, 23 Nov 2026).
 * They live in the CRM (content_posts) and appear here once their publish
 * time has passed; the CRM's public read rule only lets due blog posts out.
 * Pages revalidate every 5 minutes, so a post goes live within minutes of
 * its time with nobody touching anything.
 */
const CRM_URL = 'https://xxazlzkhwraqfeqjzviz.supabase.co'
// The CRM's public (anon) key: already public in the CRM app.
const CRM_ANON = process.env.CRM_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4YXpsemtod3JhcWZlcWp6dml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTk3NjksImV4cCI6MjA5NzE5NTc2OX0.bLsr74xXnlOtJ9BaQXK_K7ZBEV0aaBJkvRN4eZP0f3g'
export const CONTENT_PUBLIC = `${CRM_URL}/storage/v1/object/public/content/`

export type AutoBlock =
  | { type: 'p' | 'h2' | 'h3' | 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'img'; photo: number; alt?: string; caption?: string }

export type AutoPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  seo_title: string | null
  seo_description: string | null
  body: AutoBlock[] | null
  image_paths: string[]
  topic: string | null
  publish_at: string
  updated_at: string
}

const FIELDS = 'id,title,slug,excerpt,seo_title,seo_description,body,image_paths,topic,publish_at,updated_at'

async function crm(query: string): Promise<AutoPost[]> {
  try {
    const r = await fetch(`${CRM_URL}/rest/v1/content_posts?${query}`, {
      headers: { apikey: CRM_ANON, Authorization: `Bearer ${CRM_ANON}` },
      next: { revalidate: 300 },
    })
    if (!r.ok) return []
    return (await r.json()) as AutoPost[]
  } catch {
    return [] // the blog must never fail because the CRM is slow
  }
}

export const getAutoPosts = () =>
  crm(`select=${FIELDS}&kind=eq.blog&order=publish_at.desc&limit=200`)

export const getAutoPost = async (slug: string): Promise<AutoPost | null> =>
  (await crm(`select=${FIELDS}&kind=eq.blog&slug=eq.${encodeURIComponent(slug)}&limit=1`))[0] ?? null

export const autoCategory = (p: AutoPost) => (p.topic === 'project' ? 'Project' : 'Guide')
export const autoHero = (p: AutoPost) => (p.image_paths?.[0] ? CONTENT_PUBLIC + p.image_paths[0] : null)
