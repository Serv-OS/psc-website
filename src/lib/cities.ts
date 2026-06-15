export type CityData = {
  slug: string
  name: string
  h1: string
  intro: string
  localPoints: { title: string; description: string }[]
  closingBlurb: string
  neighborhoods: string[]
}

/** Seeded city content (from City Body.dc.html). Overridden by the ServiceAreas collection. */
export const DEFAULT_CITIES: Record<string, CityData> = {
  'san-mateo': {
    slug: 'san-mateo',
    name: 'San Mateo',
    h1: 'Siding Contractor in San Mateo, CA',
    intro:
      "San Mateo is home base for us — our shop sits right on Polhemus Road. We've spent years re-siding homes from Baywood to Shoreview, so we know exactly how the Peninsula's coastal fog, salt air, and big day-to-night temperature swings test an exterior, and which materials hold up beautifully here.",
    localPoints: [
      { title: 'Coastal moisture, handled', description: 'Fog and damp air are tough on wood. Fiber cement resists moisture, rot and pests, keeping San Mateo exteriors looking sharp through every marine layer.' },
      { title: 'Homes of every era', description: "From 1920s Spanish bungalows to mid-century ranches and new builds, we match the profile, trim and color to your home's architecture." },
      { title: 'Permits & HOAs made easy', description: 'As a local contractor, we handle San Mateo permits and HOA color approvals so your project moves smoothly from quote to completion.' },
    ],
    closingBlurb:
      "Because we're based here, scheduling a sample drop-off or a site visit is genuinely easy — and you'll work with the same local team from first call to final sign-off.",
    neighborhoods: ['Aragon', 'Baywood', 'Hayward Park', 'San Mateo Park', 'Shoreview', 'Sugarloaf', 'North Shoreview', 'Laurelwood'],
  },
  'redwood-city': {
    slug: 'redwood-city',
    name: 'Redwood City',
    h1: 'Siding Contractor in Redwood City, CA',
    intro:
      'From the classic bungalows of Mount Carmel to the newer homes out by Redwood Shores, Redwood City runs the full design gamut. We help RWC homeowners choose siding that fits the street, stands up to bayside humidity, and adds real value in a competitive market.',
    localPoints: [
      { title: 'Bayside humidity ready', description: 'Homes near the water see extra moisture. Engineered fiber cement shrugs off humidity and salt air far better than traditional wood siding.' },
      { title: 'Diverse architecture', description: 'Craftsman, ranch, Mediterranean and modern all share these streets. We tailor texture and color so your exterior feels right for the block.' },
      { title: 'Value in a hot market', description: "In Redwood City's fast-moving market, fresh siding is one of the highest-return exterior upgrades for resale and curb appeal." },
    ],
    closingBlurb:
      "Whether you're refreshing a Roosevelt-area cottage or a home up in Emerald Hills, our friendly local crew delivers the same careful, on-schedule workmanship.",
    neighborhoods: ['Mount Carmel', 'Roosevelt', 'Friendly Acres', 'Redwood Shores', 'Emerald Hills', 'Farm Hills', 'Stambaugh-Heller', 'Centennial'],
  },
  'palo-alto': {
    slug: 'palo-alto',
    name: 'Palo Alto',
    h1: 'Siding Contractor in Palo Alto, CA',
    intro:
      'Palo Alto blends Eichler mid-century modern, Professorville Craftsman, and high-value new construction — and expectations for finish quality are high. We deliver clean, architectural siding work that respects each home’s pedigree and the value it carries.',
    localPoints: [
      { title: 'Built for clean, modern lines', description: 'Eichler and contemporary homes demand crisp panels and exact reveals. Our installers specialize in the precise, architectural look these designs require.' },
      { title: 'Protecting high-value homes', description: "On Palo Alto's premium properties, quality of finish matters. We use top-tier materials and meticulous detailing that protect both the home and its resale value." },
      { title: 'Shade & tree-canopy moisture', description: 'Mature tree cover keeps facades damp and shaded. Moisture-resistant fiber cement prevents the rot and mildew that plague wood in these conditions.' },
    ],
    closingBlurb:
      'From Professorville to Barron Park, we bring a calm, communicative process and a five-year workmanship warranty to every Palo Alto project.',
    neighborhoods: ['Professorville', 'Old Palo Alto', 'Crescent Park', 'College Terrace', 'Midtown', 'Barron Park', 'Green Gables', 'Community Center'],
  },
}

export const CITY_SLUGS = Object.keys(DEFAULT_CITIES)
