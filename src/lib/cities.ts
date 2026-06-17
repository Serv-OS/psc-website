export type CityData = {
  slug: string
  name: string
  h1: string
  intro: string
  localPoints: { title: string; description: string }[]
  closingBlurb: string
  neighborhoods: string[]
}

/** Seeded city content. Overridden per-city by the ServiceAreas collection. */
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
  'pacifica': {
    slug: 'pacifica',
    name: 'Pacifica',
    h1: 'Siding Contractor in Pacifica, CA',
    intro: "Pacifica is a surf town strung along the cliffs, and the ocean doesn't go easy on a house here. From Linda Mar to Rockaway Beach, exteriors take a steady beating from wind-driven rain, salt spray, and a marine layer that can sit for days. We pick and install siding that shrugs off that constant moisture instead of slowly soaking it up.",
    localPoints: [
      { title: 'Wind off the open ocean', description: 'Pacifica gusts come straight off the Pacific with nothing to slow them down. We fasten and flash siding for real wind loads, especially on west-facing walls in Pedro Point and Sharp Park.' },
      { title: 'Fog that never fully lifts', description: 'Constant damp is the enemy of wood and paint. Fiber cement and proper rain-screen detailing keep walls breathing so moisture never gets trapped behind the cladding.' },
      { title: 'Salt-tolerant finishes', description: 'Salt air strips coatings fast near the beach. We use marine-grade fasteners and factory-finished products built to hold color through Pacifica seasons.' },
    ],
    closingBlurb: "Whether you're up in Vallemar or down near the Linda Mar beachfront, we'll help your home stand up to everything the coast throws at it.",
    neighborhoods: ['Linda Mar', 'Rockaway Beach', 'Sharp Park', 'Pedro Point', 'Vallemar', 'Park Pacifica', 'Fairmont', 'Pacific Manor'],
  },
  'montara': {
    slug: 'montara',
    name: 'Montara',
    h1: 'Siding Contractor in Montara, CA',
    intro: "Montara is a small, unincorporated stretch of coast where homes sit right in the path of heavy salt spray rolling off the water. Many houses here are older or one-of-a-kind custom builds, and their exteriors weather hard between the wind, the fog, and the brine in the air. We treat each one individually, matching durable siding to how exposed the wall actually is.",
    localPoints: [
      { title: 'Heavy salt spray', description: "Being this close to the surf means corrosive salt coats everything. We spec corrosion-resistant fasteners and finishes that won't streak or fail early in this environment." },
      { title: 'Older and custom homes', description: 'Montara has a lot of unique, hand-built houses. We replace and repair siding sympathetically, keeping the character of the home while upgrading its protection.' },
      { title: 'Exposed hillside walls', description: 'Homes climbing the slopes catch more wind and weather than those tucked lower. We adjust materials and detailing wall by wall based on exposure.' },
    ],
    closingBlurb: "From the homes along the highway to the quiet lanes climbing toward Montara Mountain, we keep coastside exteriors solid.",
    neighborhoods: ['Montara', 'Farallone View', 'Le Conte', 'Montara Mountain', 'Sunshine Valley', 'Eighth Street'],
  },
  'moss-beach': {
    slug: 'moss-beach',
    name: 'Moss Beach',
    h1: 'Siding Contractor in Moss Beach, CA',
    intro: "Moss Beach is a tiny coastal hamlet best known for the tide pools at Fitzgerald Marine Reserve, and homes here live right at the edge of the elements. The cool, wet marine air and relentless salt mean exteriors need materials chosen for the ocean's front row. We focus on cladding that holds up to persistent damp without rotting or peeling.",
    localPoints: [
      { title: 'Front-row coastal exposure', description: 'Near the Fitzgerald Marine Reserve, homes sit close to the water with little shelter. We use moisture-managing systems designed for high-humidity, high-salt conditions.' },
      { title: 'Rot-resistant by design', description: 'Wood siding struggles where the air rarely dries out. Fiber cement gives Moss Beach homeowners the coastal look they want without the constant rot risk.' },
      { title: 'Careful repairs on small lots', description: 'Many Moss Beach homes are modest, tucked-in coastal cottages. We handle tight-access siding repairs and replacements without disrupting the neighborhood feel.' },
    ],
    closingBlurb: "From the bluffs near the marine reserve to the quiet streets inland, we keep Moss Beach homes weather-tight and looking their best.",
    neighborhoods: ['Seal Cove', 'Marine Boulevard', 'Juliana', 'Etheldore', 'Moss Beach Highlands', 'Nevada Avenue'],
  },
  'el-granada': {
    slug: 'el-granada',
    name: 'El Granada',
    h1: 'Siding Contractor in El Granada, CA',
    intro: "El Granada climbs the hillside above Pillar Point Harbor on its distinctive curving, Spanish-style street grid. Homes here look out over the water and catch the steady coastal wind that funnels in off the harbor. That exposure, paired with damp marine air, makes solid siding and tight detailing essential, which is exactly where we come in.",
    localPoints: [
      { title: 'Harbor-facing wind', description: 'Wind pours in off Pillar Point Harbor and up the slope. We fasten and flash siding to handle sustained coastal gusts on the most exposed elevations.' },
      { title: 'Hillside views, harsh angles', description: "The terraced street grid means many homes have walls fully open to the weather. We tailor material and trim choices to each home's position on the hill." },
      { title: 'Color that lasts in salt air', description: 'Salt and sun fade ordinary finishes quickly here. We install factory-finished, fade-resistant products so your exterior keeps its look for years.' },
    ],
    closingBlurb: "From the streets overlooking Pillar Point Harbor to the homes higher up the grade, we help El Granada exteriors weather the coast beautifully.",
    neighborhoods: ['The Avenues', 'El Granada Highlands', 'Coral Reef', 'Mirada Road', 'Surf Beach', 'Quarry Park area'],
  },
  'half-moon-bay': {
    slug: 'half-moon-bay',
    name: 'Half Moon Bay',
    h1: 'Siding Contractor in Half Moon Bay, CA',
    intro: "Half Moon Bay blends a historic downtown of coastal Victorians with newer neighborhoods stretching toward the beach and the farms beyond. Whether it's a century-old home off Main Street or a modern build near Ocean Colony, every exterior here contends with fog, salt air, and wet coastal winters. We match the right siding to each home's era and exposure.",
    localPoints: [
      { title: 'Historic homes done right', description: 'The Victorians near Main Street deserve siding that respects their detailing. We replicate traditional profiles while upgrading weather protection underneath.' },
      { title: 'Beachfront exposure at Miramar', description: 'Homes in Miramar and Princeton-by-the-Sea sit right on the water and take the full brunt of salt and spray. We spec coastal-grade materials for that punishing front line.' },
      { title: 'Wet-winter moisture control', description: 'Half Moon Bay sees real rain alongside the fog. Proper flashing and rain-screen installation keep water out of walls in every neighborhood, from town to Ocean Colony.' },
    ],
    closingBlurb: "From the Victorians downtown to the beach homes in Miramar, we help Half Moon Bay homeowners protect what makes their houses special.",
    neighborhoods: ['Downtown / Main Street', 'Miramar', 'Princeton-by-the-Sea', 'Ocean Colony', 'Alsace Lorraine', 'Casa del Mar', 'Highland Park'],
  },
  'daly-city': {
    slug: 'daly-city',
    name: 'Daly City',
    h1: 'Siding Contractor in Daly City, CA',
    intro: "They don't call it \"the fog city\" for nothing — Daly City takes the brunt of the marine layer rolling straight off the Pacific, with damp, wind-driven moisture most of the year. From the tightly packed Doelger tract rows in Westlake to the homes up around Crocker, that constant salt air and humidity is exactly why fiber cement holds up here when wood and stucco struggle.",
    localPoints: [
      { title: 'Engineered for the fog belt', description: 'Few places on the Peninsula stay this wet this often. We favor James Hardie fiber cement here because it shrugs off the persistent moisture that swells and rots organic siding.' },
      { title: 'Wind-rated installs', description: 'Ocean wind funnels hard over the western ridges and into Serramonte. We fasten and seal to stand up to the gusts these neighborhoods see year-round.' },
      { title: 'Respecting the Doelger look', description: "Westlake's mid-century tract homes share a distinct rhythm. We re-side in a way that keeps that clean, original character intact rather than fighting it." },
    ],
    closingBlurb: "Whether you're in Westlake, St. Francis Heights, or up toward Broadmoor, we know how to build an exterior that beats Daly City's fog.",
    neighborhoods: ['Westlake', 'Serramonte', 'Crocker', 'St. Francis Heights', 'Broadmoor', 'Original Daly City'],
  },
  'colma': {
    slug: 'colma',
    name: 'Colma',
    h1: 'Siding Contractor in Colma, CA',
    intro: "Colma may be best known for its rolling memorial parks, but tucked among them is a genuine residential community in Sterling Park where families have lived for generations. Sitting right beside Daly City, these homes share the same fog, wind, and salt-laden air sweeping in from the coast — conditions that make a moisture-tough exterior more than a nice-to-have.",
    localPoints: [
      { title: 'Big-town weather, small-town service', description: "Colma sees the same coastal fog and damp as its larger neighbor. We bring fiber cement's moisture resistance to a town that doesn't always get attention from larger contractors." },
      { title: 'Sterling Park specialists', description: 'The residential pocket here is compact and well-established. We work cleanly and considerately on streets where neighbors know each other.' },
      { title: 'Low-maintenance by design', description: "For homeowners who'd rather not repaint every few years in this climate, we install siding that holds its finish far longer than wood." },
    ],
    closingBlurb: "If you're a homeowner in Sterling Park, we'd be glad to help you upgrade an exterior built for Colma's coastal damp.",
    neighborhoods: ['Sterling Park', 'Colma Town Center', 'Olivet'],
  },
  'brisbane': {
    slug: 'brisbane',
    name: 'Brisbane',
    h1: 'Siding Contractor in Brisbane, CA',
    intro: "Brisbane is one of the Peninsula's true originals — a tight-knit hillside town climbing the slopes of San Bruno Mountain, with eclectic, often owner-built homes looking out over the bay. Those exposed hillside lots catch serious wind and weather, and the mix of custom architecture means no two re-siding jobs here look quite the same.",
    localPoints: [
      { title: 'Built for hillside exposure', description: "Homes climbing San Bruno Mountain take wind and weather from every direction. We detail and fasten for elevations that don't get the shelter flatland homes enjoy." },
      { title: 'Comfortable with the custom and quirky', description: 'Central Brisbane is full of one-of-a-kind, individually built homes. We adapt our siding work to unconventional shapes rather than forcing a cookie-cutter approach.' },
      { title: 'Bay-facing durability', description: 'Properties looking out toward Sierra Point get steady wind and humidity off the water. Fiber cement gives those facades real staying power.' },
    ],
    closingBlurb: "From the hillside streets of Central Brisbane to the lots up in Brisbane Acres, we love working on this town's one-of-a-kind homes.",
    neighborhoods: ['Central Brisbane', 'Brisbane Acres', 'Sierra Point'],
  },
  'san-bruno': {
    slug: 'san-bruno',
    name: 'San Bruno',
    h1: 'Siding Contractor in San Bruno, CA',
    intro: "San Bruno sits right at the gap where coastal fog and wind push through from the ocean toward the bay, so neighborhoods from Crestmoor up against the hills to Belle Air down on the flats all feel the weather differently. It's a city of solid, established mid-century homes — exactly the kind of housing stock that benefits most from a durable re-side.",
    localPoints: [
      { title: 'Wind through the gap', description: 'San Bruno catches the marine air funneling through the gap in the hills. We install with that steady wind exposure in mind, especially up in Crestmoor and Rollingwood.' },
      { title: 'Renewing mid-century stock', description: "Much of San Bruno's housing dates to the postwar boom. Re-siding with fiber cement modernizes the look and the performance in one move." },
      { title: 'Hillside and flatland alike', description: 'From Portola Highlands on the slopes to The Avenues below, we tailor each install to how that particular street sits in the weather.' },
    ],
    closingBlurb: "Whether your home is in Belle Air, Rollingwood, or up in the Portola Highlands, we'll give it an exterior built for San Bruno's wind.",
    neighborhoods: ['Belle Air', 'Crestmoor', 'Rollingwood', 'Portola Highlands', 'The Avenues', 'Mills Park'],
  },
  'millbrae': {
    slug: 'millbrae',
    name: 'Millbrae',
    h1: 'Siding Contractor in Millbrae, CA',
    intro: "Millbrae is a quietly well-kept city of ranch and mid-century homes nestled between the hills and the bay, with neighborhoods like Mills Estate and Green Hills prized for their pride of ownership. Sitting just below the fog line and near the airport, homes here see fog, sun, and temperature swings in turn — a cycle that's hard on aging wood and stucco exteriors.",
    localPoints: [
      { title: 'Made for the swing', description: 'Millbrae cycles between fog, sun, and cooler hillside air. Fiber cement handles that expansion and contraction without the cracking and warping older siding shows.' },
      { title: 'Honoring the ranch aesthetic', description: 'The long, low ranch homes in Mills Estate and Millbrae Meadows have a clean horizontal feel. We choose profiles and reveals that complement, not clash with, that style.' },
      { title: 'Hillside homes near Green Hills', description: 'Properties tucked up toward the hills get more shade and moisture. We detail those exteriors to keep damp out where the sun reaches less.' },
    ],
    closingBlurb: "From Millbrae Meadows to the streets up around Green Hills, we help homeowners protect some of the Peninsula's best-kept homes.",
    neighborhoods: ['Millbrae Meadows', 'Mills Estate', 'Green Hills', 'Highlands', 'Capuchino'],
  },
  'burlingame': {
    slug: 'burlingame',
    name: 'Burlingame',
    h1: 'Siding Contractor in Burlingame, CA',
    intro: "Burlingame is the Peninsula at its leafiest — wide, tree-shaded streets in Burlingame Park and the Easton Addition lined with beautifully kept Craftsman bungalows and Tudors. Those mature trees are gorgeous but cast deep shade and trap moisture against the house, and on homes this architecturally significant, the siding work has to be as careful as the original craftsmanship.",
    localPoints: [
      { title: 'Working under the canopy', description: "Burlingame's mature trees keep facades shaded and damp longer than open lots. We specify siding and detailing that resist the moisture that shade invites." },
      { title: 'Respecting period architecture', description: "The Craftsman and Tudor homes of the Easton Addition deserve siding that honors their original lines. We match profiles and trim to the home's era, not a generic template." },
      { title: 'Meeting the standard', description: 'Burlingame neighborhoods hold high expectations for how a home presents. Our finish work and reveals are done to the level these streets are known for.' },
    ],
    closingBlurb: "From the historic blocks of Burlingame Park to the homes up in Burlingame Hills, we bring craftsmanship worthy of the neighborhood.",
    neighborhoods: ['Burlingame Park', 'Easton Addition', 'Lyon-Hoag', 'Ray Park', 'Burlingame Hills', 'Burlingables'],
  },
  'hillsborough': {
    slug: 'hillsborough',
    name: 'Hillsborough',
    h1: 'Siding Contractor in Hillsborough, CA',
    intro: "Hillsborough is the Peninsula's address for grand estates — large custom homes set well back on wooded lots across Lower, Central, and Upper Hillsborough, where the town's strict architectural guidelines shape everything that gets built. Re-siding here means meeting exacting design standards while protecting substantial homes from the moisture their mature, wooded settings hold in.",
    localPoints: [
      { title: 'Built for design review', description: "Hillsborough's architectural guidelines are among the strictest on the Peninsula. We plan and execute siding work that satisfies the town's design expectations." },
      { title: 'Estate-scale craftsmanship', description: 'Large custom homes demand long, consistent runs and flawless detailing. Our installers hold the precision these properties require across every elevation.' },
      { title: 'Wooded-lot moisture control', description: 'Heavily treed estate lots keep facades shaded and humid. Fiber cement and proper detailing protect these homes where damp lingers longest.' },
    ],
    closingBlurb: "From the established estates of Lower Hillsborough to the secluded lots near Tobin Clark, we deliver siding worthy of these homes.",
    neighborhoods: ['Lower Hillsborough', 'Central Hillsborough', 'Upper Hillsborough', 'Tobin Clark'],
  },
  'belmont': {
    slug: 'belmont',
    name: 'Belmont',
    h1: 'Siding Contractor in Belmont, CA',
    intro: "Belmont rises into wooded hills, where mid-century homes and custom builds perch on the slopes among heavy tree canopy from Belmont Heights up toward Water Dog Lake. All that greenery means shade and trapped moisture against north-facing walls, while flatter neighborhoods like Sterling Downs sit closer to the bay — so siding here has to suit very different exposures across one city.",
    localPoints: [
      { title: 'Canopy and shade', description: "Belmont's wooded slopes keep many walls shaded and slow to dry. We use fiber cement and careful flashing to keep that persistent moisture out." },
      { title: 'Siding the slopes', description: 'Hillside homes in Belmont Heights and the Hallmark area sit on grade and catch wind along the ridges. We detail those elevations for the exposure they actually face.' },
      { title: 'From hills to flats', description: 'Sterling Downs near the bay weathers differently than the Cipriani hillsides. We tailor each install to where the home sits in Belmont’s varied terrain.' },
    ],
    closingBlurb: "Whether you're up in Belmont Heights near Water Dog Lake or down in Sterling Downs, we'll build an exterior suited to your slope and shade.",
    neighborhoods: ['Belmont Heights', 'Hallmark', 'Sterling Downs', 'Cipriani', 'Water Dog Lake area', 'Belmont Woods'],
  },
  'atherton': {
    slug: 'atherton',
    name: 'Atherton',
    h1: 'Siding Contractor in Atherton, CA',
    intro: "Atherton is a town of gated, estate-scale homes set far back on wooded acre lots, where the bar for finish quality is as high as anywhere in the country. Projects here move through careful architectural and design review, and the siding has to read as flawless from the street and up close.",
    localPoints: [
      { title: 'Held to design-review standards', description: "Atherton's planning and design guidelines are exacting. We plan, document and execute siding work that clears review and matches the home's architecture exactly." },
      { title: 'Estate-scale precision', description: 'Long wall runs and bespoke detailing leave nowhere to hide. Our installers hold tight, consistent reveals across every elevation of a large home.' },
      { title: 'Wooded-lot protection', description: 'Mature, private lots keep facades shaded and damp. Fiber cement and meticulous flashing guard these homes where moisture lingers.' },
    ],
    closingBlurb: 'From Lindenwood to West Atherton, we bring estate-level craftsmanship and a calm, discreet process to every project.',
    neighborhoods: ['Lindenwood', 'Lloyden Park', 'West Atherton', 'Las Lomitas', 'Lindenwood Park'],
  },
  'menlo-park': {
    slug: 'menlo-park',
    name: 'Menlo Park',
    h1: 'Siding Contractor in Menlo Park, CA',
    intro: "Menlo Park runs from the storybook Craftsman charm of Allied Arts and Felton Gables to ranch homes in West Menlo and newer builds toward Sharon Heights. With mature street trees shading many facades, we help homeowners pick siding that fits the neighborhood's character and keeps moisture out year-round.",
    localPoints: [
      { title: 'Character that fits the block', description: 'From Felton Gables cottages to West Menlo ranches, we match profile, trim and color so a re-side looks like it always belonged.' },
      { title: 'Shade and tree moisture', description: "Menlo Park's leafy streets keep walls damp and slow to dry. Moisture-resistant fiber cement prevents the rot and mildew wood is prone to here." },
      { title: 'From cottages to new builds', description: 'We work across eras — restoring period homes and cladding contemporary ones with equal care across every Menlo Park neighborhood.' },
    ],
    closingBlurb: "Whether you're in Allied Arts, Linfield Oaks or out toward Sharon Heights, our local crew delivers careful, on-schedule work.",
    neighborhoods: ['Allied Arts', 'Felton Gables', 'West Menlo Park', 'Sharon Heights', 'Linfield Oaks', 'Suburban Park', 'Belle Haven'],
  },
  'woodside': {
    slug: 'woodside',
    name: 'Woodside',
    h1: 'Siding Contractor in Woodside, CA',
    intro: "Woodside is rural and wooded — ranch estates, equestrian properties and custom homes tucked under heavy tree cover from Central Woodside up toward Skylonda and Kings Mountain. The dense canopy and wildland setting make moisture management and fire-resistant materials genuinely important out here.",
    localPoints: [
      { title: 'Fire-resistant for the wildland edge', description: 'Much of Woodside sits in a wildland-urban interface. Non-combustible James Hardie fiber cement adds a meaningful layer of protection over wood siding.' },
      { title: 'Built for heavy tree canopy', description: 'Shaded, wooded lots keep exteriors damp for long stretches. We detail and flash to keep that persistent moisture out of the walls.' },
      { title: 'Natural, architectural looks', description: 'Woodside homes favor a warm, natural aesthetic. We deliver wood-look profiles and cedar-style finishes that suit the rural setting without the upkeep.' },
    ],
    closingBlurb: 'From Central Woodside to the homes up around Kings Mountain, we protect rural exteriors against moisture and fire alike.',
    neighborhoods: ['Central Woodside', 'Skylonda', 'Kings Mountain', 'Woodside Heights', 'Family Farm', 'Mountain Home Road'],
  },
  'portola-valley': {
    slug: 'portola-valley',
    name: 'Portola Valley',
    h1: 'Siding Contractor in Portola Valley, CA',
    intro: "Portola Valley is a wooded, semi-rural town of hillside homes designed to sit lightly in the landscape, from Ladera to Westridge and the Portola Valley Ranch. With its forested, fire-prone setting and a strong design ethos, siding choices here have to balance natural looks, moisture resistance and fire safety.",
    localPoints: [
      { title: 'Wildfire-aware materials', description: 'Set against open space and woodland, Portola Valley homes benefit from non-combustible fiber cement that holds up far better than wood in a fire zone.' },
      { title: 'Designed to fit the land', description: "The town's aesthetic favors natural, low-profile exteriors. We choose textures and colors that complement the hillside rather than stand out against it." },
      { title: 'Hillside moisture and shade', description: 'Tree cover and north-facing slopes keep walls damp. Proper detailing and fiber cement prevent the rot these conditions invite.' },
    ],
    closingBlurb: 'From Ladera to Westridge, we help Portola Valley homeowners protect homes built to live in harmony with the woods.',
    neighborhoods: ['Ladera', 'Westridge', 'Brookside', 'Portola Valley Ranch', 'Los Trancos Woods', 'Alpine Hills'],
  },
  'emerald-hills': {
    slug: 'emerald-hills',
    name: 'Emerald Hills',
    h1: 'Siding Contractor in Emerald Hills, CA',
    intro: "Emerald Hills is a leafy, unincorporated community climbing the slopes above Redwood City, full of custom homes that hug the hillside and capture the views. The mix of steep lots, mature trees and individual architecture means each re-side here is its own puzzle — exactly the kind we enjoy.",
    localPoints: [
      { title: 'Siding the slopes', description: 'Hillside homes near Emerald Lake sit on grade and catch wind and weather from open angles. We detail and fasten for the exposure each elevation actually faces.' },
      { title: 'Canopy and shade', description: 'Heavy tree cover keeps walls shaded and slow to dry. Fiber cement and careful flashing keep that moisture from settling into the structure.' },
      { title: 'One-of-a-kind homes', description: 'Emerald Hills is full of individual, custom houses. We tailor profiles, trim and color to each home rather than forcing a single template.' },
    ],
    closingBlurb: 'From the streets near Emerald Lake to the homes up around Handley Rock, we bring careful workmanship to the hillside.',
    neighborhoods: ['Emerald Lake Hills', 'Edgewood', 'Handley Rock', 'Tartan Trail', 'Jefferson Avenue area'],
  },
  'los-altos': {
    slug: 'los-altos',
    name: 'Los Altos',
    h1: 'Siding Contractor in Los Altos, CA',
    intro: "Los Altos is known for its tree-lined streets, generous lots and beautifully kept ranch and custom homes from Old Los Altos to the Country Club area. Finish expectations are high here, and mature landscaping keeps many facades shaded — so we pair top-tier materials with detailing worthy of the neighborhood.",
    localPoints: [
      { title: 'Finish that meets the standard', description: 'Los Altos homeowners expect a flawless exterior. Our reveals, trim and color matching are done to the high bar these streets are known for.' },
      { title: 'Suited to the ranch aesthetic', description: 'The low, horizontal ranch homes here have a clean, calm feel. We choose profiles and proportions that complement that classic Los Altos look.' },
      { title: 'Shade-driven moisture', description: 'Mature trees and deep eaves keep walls damp longer. Fiber cement resists the rot and mildew that shade encourages on wood siding.' },
    ],
    closingBlurb: 'From Old Los Altos to the Country Club neighborhood, we deliver siding that fits the home and holds its finish for years.',
    neighborhoods: ['Old Los Altos', 'North Los Altos', 'Country Club', 'Loyola Corners', 'Highlands', 'Springer'],
  },
  'mountain-view': {
    slug: 'mountain-view',
    name: 'Mountain View',
    h1: 'Siding Contractor in Mountain View, CA',
    intro: "Mountain View mixes classic bungalows in Old Mountain View, Eichler tracts in Monta Loma, and a steady wave of newer infill homes. That range of eras means very different siding needs from street to street — and we tailor each project to the home's age and architecture.",
    localPoints: [
      { title: 'Eichler-ready precision', description: 'Monta Loma Eichlers need crisp panels and exact reveals. Our installers specialize in the clean, architectural look mid-century moderns demand.' },
      { title: 'From bungalows to new builds', description: 'Old Mountain View bungalows and contemporary infill call for different profiles. We match the right material and detailing to each home.' },
      { title: 'Low-maintenance value', description: 'In a high-value market, durable fiber cement that holds its finish is one of the smartest exterior upgrades a Mountain View homeowner can make.' },
    ],
    closingBlurb: 'From Cuesta Park to Waverly Park, we bring precise, era-appropriate siding work to every Mountain View neighborhood.',
    neighborhoods: ['Old Mountain View', 'Cuesta Park', 'Waverly Park', 'Monta Loma', 'Rex Manor', 'Sylvan Park', 'Willowgate'],
  },
  'sunnyvale': {
    slug: 'sunnyvale',
    name: 'Sunnyvale',
    h1: 'Siding Contractor in Sunnyvale, CA',
    intro: "Sunnyvale is dense with ranch homes and Eichler tracts, from the Heritage District to Birdland and Cherry Chase. Inland from the coast, it sees hot, sunny summers — and that steady UV and heat are tough on older wood and stucco exteriors, which is where a durable re-side pays off.",
    localPoints: [
      { title: 'Built for heat and UV', description: "Sunnyvale summers bake exteriors with sun and heat. Factory-finished fiber cement resists fading and won't crack or warp the way sun-baked wood does." },
      { title: 'Eichler and ranch expertise', description: "From Birdland Eichlers to Cherry Chase ranches, we choose profiles and reveals that respect each tract's original design." },
      { title: 'Tidy work on close lots', description: "Sunnyvale's suburban streets sit close together. We keep job sites clean and considerate, with minimal disruption to neighbors." },
    ],
    closingBlurb: 'From the Heritage District to Ortega Park, we give Sunnyvale homes an exterior built for the South Bay sun.',
    neighborhoods: ['Heritage District', 'Birdland', 'Cherry Chase', 'Ortega Park', 'Sunnyvale West', 'Raynor', 'Lakewood'],
  },
  'santa-clara': {
    slug: 'santa-clara',
    name: 'Santa Clara',
    h1: 'Siding Contractor in Santa Clara, CA',
    intro: "Santa Clara pairs the historic charm of the Old Quad near the University with established ranch neighborhoods and newer communities like Rivermark. Inland heat and strong sun test exteriors here, so we focus on durable, fade-resistant siding that keeps these homes looking sharp through the South Bay summers.",
    localPoints: [
      { title: 'Sun- and heat-resistant', description: "Santa Clara's inland climate brings real heat and UV. Fiber cement with a baked-on finish holds its color and shape where sun punishes wood and paint." },
      { title: 'Respecting the Old Quad', description: 'The historic homes near the University have distinct period detailing. We re-side them sympathetically, preserving character while improving protection.' },
      { title: 'Ranch and newer homes alike', description: "From Forest Park ranches to Rivermark's newer builds, we tailor profiles and color to suit each neighborhood's style." },
    ],
    closingBlurb: 'From the Old Quad to Rivermark, we help Santa Clara homeowners protect their exteriors against the South Bay sun.',
    neighborhoods: ['Old Quad', 'Forest Park', 'Rivermark', 'Killarney Farms', 'Santa Clara University area', 'Pomeroy'],
  },
}

export const CITY_SLUGS = Object.keys(DEFAULT_CITIES)

/** All cities as an array, for static params, sitemap, and the service-areas hub. */
export const ALL_CITIES: CityData[] = Object.values(DEFAULT_CITIES)
