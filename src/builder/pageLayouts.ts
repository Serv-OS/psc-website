/**
 * Puck layouts for the marketing pages, transcribed from the finished
 * hand-coded designs so the visual builder opens populated and fully editable.
 * Seeded via `scripts/seed-layouts.ts` (POSTs each to /api/builder/save).
 */

const block = (type: string, id: string, props: Record<string, unknown>) => ({ type, props: { id, ...props } })
const layout = (content: Array<ReturnType<typeof block>>) => ({ root: { props: {} }, zones: {}, content })
/** Image field value pointing at a migrated Media file (served by Payload). */
const img = (file: string, alt: string) => ({ url: `/api/media/file/${file}`, alt })

/* ───────────────────────── About Us ───────────────────────── */
const aboutUs = layout([
  block('CenteredHero', 'hero-about', {
    badge: 'EST. 2012 · A DIVISION OF SEA CONSTRUCTION (1989)',
    heading: 'Bay Area siding, done the right way.',
    subheading:
      'We specialize in premium exterior siding that protects your home, elevates curb appeal, and delivers long-term value — backed by decades of construction expertise and a focused commitment to siding excellence.',
    stats: [
      { value: '35+', label: 'Years building Bay Area exteriors' },
      { value: '2012', label: 'Siding division founded' },
      { value: 'Elite Preferred', label: 'James Hardie® installer' },
      { value: '5.0★', label: 'Yelp, Google & Houzz' },
    ],
    background: 'forest',
  }),
  block('SplitContent', 'story-about', {
    eyebrow: 'Our story',
    heading: 'A specialist born from decades of craftsmanship',
    body:
      'Peninsula Siding Company was founded in 2012 as the dedicated exterior division of SEA Construction, Inc. — a full-service design and remodeling firm established in 1989. After decades of building and renovating homes across the Bay Area, we recognized the need for a siding specialist focused purely on quality exterior solutions.\n\nToday we’re a trusted local contractor and an Elite Preferred installer of James Hardie® products, proudly serving homeowners throughout San Mateo, Redwood City, Palo Alto, and the greater Bay Area — continuing a legacy built on craftsmanship, integrity, and long-term performance.',
    cardEyebrow: 'Our mission',
    cardText:
      'To help homeowners protect and elevate their homes through high-quality siding solutions delivered with honesty, craftsmanship, and care.',
    checklist: [
      { text: 'Industry-leading materials, including James Hardie® products' },
      { text: 'Expert installation engineered to last for decades' },
      { text: 'A stress-free, transparent experience — every home treated like our own' },
    ],
    background: 'white',
  }),
  block('BeforeAfter', 'ba-about', {
    eyebrow: 'See it happen',
    heading: 'Old siding to new exterior.',
    text:
      'Drag the handle to see how we transform outdated exteriors into beautiful, durable, energy-efficient homes built for Bay Area living — and yours could be next.',
    buttonLabel: 'Get a free siding estimate',
    buttonHref: '/instant-quote',
    beforeImage: img('3-before.jpg', 'Bay Area home — before new siding'),
    afterImage: img('3-after.jpg', 'Bay Area home — after new siding'),
    background: 'forest',
  }),
  block('MaterialsTabs', 'materials-about', {
    eyebrow: 'Premium materials',
    title: 'The best siding brands, expertly installed',
    copy: 'We partner with trusted manufacturers to deliver exteriors that stand up to Bay Area weather and add lasting value.',
    background: 'white',
    tabs: [
      { label: 'James Hardie®', title: 'James Hardie® Fiber Cement Siding', body: 'Durable and low-maintenance, James Hardie siding resists fire, termites, and extreme weather. Made from a composite of sand, cement, and cellulose fibers, it mimics real wood while providing superior protection. As a James Hardie Elite Preferred Contractor, we guarantee precise installation and expert craftsmanship.', tags: '30-year siding warranty\n15-year ColorPlus® finish\nFire & termite resistant\nElite Preferred install', image: null },
      { label: 'Cedar Valley', title: 'Cedar Valley Cedar Siding', body: 'For the natural beauty of Western Red Cedar, Cedar Valley siding provides exceptional strength and durability. High-quality cedar shingles mounted on a plywood backer with a fiberglass laminate protect your home while allowing for hundreds of factory-finished colors and stains — a personalized, elegant exterior.', tags: 'Western Red Cedar\nHundreds of finishes\nFiberglass-backed\nFactory finished', image: null },
      { label: 'Shakertown®', title: 'Shakertown® Cedar Siding', body: 'Featuring Western Red Cedar, Shakertown siding combines traditional beauty with efficient installation. Eight-foot panels reduce material waste and installation time while creating a seamless, natural wood look. Available in pre-stained finishes that enhance curb appeal with long-lasting durability.', tags: '8-ft panels\nLess material waste\nPre-stained finishes\nSeamless wood look', image: null },
    ],
  }),
  block('Heading', 'why-about', {
    eyebrow: 'Why choose us',
    title: 'What sets Peninsula Siding apart in San Mateo',
    copy: '',
    background: 'soft',
  }),
  block('FeatureCards', 'whycards-about', {
    columns: '3',
    background: 'soft',
    items: [
      { icon: '30+', title: 'Experienced Professionals', body: 'Over three decades handling projects of every size, from single homes to large renovations.', highlight: false },
      { icon: '★', title: 'Top-Quality Materials', body: 'Partnered with James Hardie®, Cedar Valley, and Shakertown® for premium, lasting results.', highlight: false },
      { icon: '◆', title: 'Custom Solutions', body: 'A personalized consultation tailors every project to your style, budget, and vision.', highlight: false },
      { icon: '✓', title: 'Attention to Detail', body: 'From precise measurements to flawless installation — accuracy and quality, every time.', highlight: false },
      { icon: '⚮', title: 'Licensed & Insured', body: 'A fully licensed, bonded, and insured Bay Area contractor — accountability on every project.', highlight: false },
      { icon: '', title: 'Backed by a 5-year workmanship warranty', body: 'Plus full manufacturer warranties — lasting confidence in every exterior we build.', highlight: true },
    ],
  }),
  block('NumberedCards', 'services-about', {
    eyebrow: 'Our siding services',
    title: 'Installation, replacement & full-wall repair',
    columns: '3',
    background: 'white',
    items: [
      { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with an extensive selection of fiber cement, wood, and more — installed with precise, high-quality craftsmanship." },
      { n: '02', title: 'Siding Replacement', body: 'Outdated or damaged siding replaced for a fresh, modern look — we help you select the perfect materials and deliver a flawless, long-lasting result.' },
      { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner and dirt to roof, blending seamlessly with your exterior. (We do not offer patchwork or a few-board repairs.)' },
    ],
  }),
  block('CallToAction', 'cta-about', {
    heading: 'Let’s protect and elevate your home.',
    copy: "Build your quote in 60 seconds — we'll beat any like-for-like quote by 10%.",
    buttonLabel: 'Start my free quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────────── Services ───────────────────────── */
const services = layout([
  block('Hero', 'hero-services', {
    eyebrow: '',
    heading: 'Siding in the Bay Area — installation, repair & replacement.',
    subheading:
      'As the region’s trusted siding specialists, we deliver expert workmanship using high-quality materials to enhance your home’s beauty, durability, and value — exteriors built to last.',
    primaryLabel: 'Get my free estimate',
    primaryHref: '/instant-quote',
    secondaryLabel: 'Explore materials',
    secondaryHref: '#materials',
    image: img('6-after.jpg', 'Finished James Hardie siding project in the Bay Area'),
    background: 'white',
  }),
  block('ServiceFinderBlock', 'finder-services', {
    eyebrow: 'Our services',
    title: 'Not sure what you need? Start here.',
    copy: '',
    background: 'white',
    services: [
      { n: '01', title: 'Siding Installation', body: "Transform your home's appearance and durability with fiber cement, wood, and more — installed with precise, high-quality craftsmanship.", label: 'Siding Installation', image: null },
      { n: '02', title: 'Siding Replacement', body: 'Outdated, damaged, or failing siding replaced for a fresh, modern look with long-lasting protection.', label: 'Siding Replacement', image: null },
      { n: '03', title: 'Siding Repair', body: 'Full-wall repairs from corner to corner, restoring weather-, pest-, or age-affected siding.', label: 'Siding Repair', image: null },
    ],
  }),
  block('Heading', 'materials-head-services', {
    eyebrow: 'Premium materials we install',
    title: 'Built for Bay Area homes',
    copy: '',
    background: 'soft',
  }),
  block('ServicesGrid', 'materials-services', {
    columns: '3',
    background: 'soft',
    items: [
      { title: 'James Hardie® Fiber Cement', body: 'Resists fire, termites, and extreme weather. A 30-year warranty and 15-year ColorPlus® finish make it a long-lasting investment — installed by an Elite Preferred Contractor.', image: img('13-after-768x768.jpg', 'James Hardie fiber cement siding') },
      { title: 'Cedar Valley Cedar', body: 'The natural beauty of Western Red Cedar — shingles on a fiberglass-laminate backer, available in hundreds of factory-finished colors and stains for a personalized, elegant exterior.', image: img('12-after-768x768.jpg', 'Cedar Valley cedar siding') },
      { title: 'Shakertown® Cedar', body: 'Western Red Cedar in efficient 8-ft panels — less waste, faster installation, and a seamless natural wood look, available in durable pre-stained finishes.', image: img('7-after-768x768.jpg', 'Shakertown cedar siding') },
    ],
  }),
  block('Heading', 'explore-head-services', {
    eyebrow: 'Explore further',
    title: 'Design & pricing, made simple',
    copy: '',
    background: 'white',
  }),
  block('FeatureCards', 'explore-services', {
    columns: '3',
    background: 'white',
    items: [
      { icon: '◆', title: 'Design Inspirations', body: 'Browse textures, profiles, and ColorPlus® palettes to picture your home’s next exterior.', highlight: false },
      { icon: '$', title: 'Quality Pricing', body: 'Transparent, fair pricing with no hidden costs — and our promise to beat any like-for-like quote by 10%.', highlight: false },
    ],
  }),
  block('Heading', 'trust-head-services', {
    eyebrow: '',
    title: 'Local San Mateo siding experts you can trust',
    copy: 'Deep roots on the Peninsula and hands-on knowledge of Bay Area homes, weather, and design — on every project.',
    background: 'forest',
  }),
  block('CheckList', 'trust-services', {
    eyebrow: '',
    title: '',
    columns: '3',
    background: 'forest',
    items: [
      { title: 'Experienced', body: '30+ years, projects of every size' },
      { title: 'Top materials', body: 'Hardie®, Cedar Valley, Shakertown®' },
      { title: 'Custom solutions', body: 'Tailored to your style & budget' },
      { title: 'Detail-driven', body: 'Precise, flawless, stress-free' },
      { title: 'Licensed & insured', body: 'Fully bonded & accountable' },
    ],
  }),
  block('AreasWeServe', 'areas-services', {
    eyebrow: 'Areas we serve',
    title: 'Trusted across the Peninsula since 2012',
    copy: 'Based in San Mateo and serving the greater Bay Area. If your city isn’t listed, reach out — we likely serve your area.',
    background: 'white',
  }),
  block('CallToAction', 'cta-services', {
    heading: 'Request your free siding consultation',
    copy: 'A detailed, no-obligation quote — we’ll review your needs, material options, and design preferences to find the best solution for durability, curb appeal, and long-term value.',
    buttonLabel: 'Build my instant quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ─────────────────── Design Inspirations ─────────────────── */
const designInspirations = layout([
  block('CenteredHero', 'hero-design', {
    badge: 'DESIGN INSPIRATIONS',
    heading: 'Picture your home’s perfect new exterior.',
    subheading:
      'Every home has a style. Explore the textures, profiles and ColorPlus® palettes that bring out the best in yours — then take it straight into an instant quote.',
    stats: [],
    background: 'forest',
  }),
  block('StyleExplorerBlock', 'explorer-design', {
    eyebrow: 'Design by home style',
    title: 'Start with your architecture',
    copy: "Pick the style closest to your home and we'll suggest a siding profile and a curated palette. Tap any swatch to preview it.",
    background: 'soft',
  }),
  block('Heading', 'collections-head-design', {
    eyebrow: 'The collections',
    title: 'Premium siding lines we design with',
    copy: 'Four trusted collections, each with its own character — from engineered fiber cement to authentic Western Red Cedar.',
    background: 'white',
  }),
  block('ServicesGrid', 'collections-design', {
    columns: '4',
    background: 'white',
    items: [
      { title: 'James Hardie® Collection', body: 'Premium fiber cement engineered to resist moisture, pests and environmental wear. Most products feature ColorPlus® Technology, plus a 30-year limited product warranty. Choose the Statement Collection’s 15 curated colors, the Dream Collection’s 700+ options, or primed boards for custom paint.', image: null },
      { title: 'Woodtone Rustic Series', body: 'Developed with James Hardie, the Rustic Series blends the authentic look of natural wood with the durability of fiber cement — rich wood-grain textures and warm tones that resist fading, rot, pests and moisture.', image: null },
      { title: 'Cedar Valley', body: 'The timeless beauty of real cedar in a pre-assembled panel system that simplifies installation while preserving premium craftsmanship — customizable with stains or finishes to match your design.', image: null },
      { title: 'Shakertown® Cedar Siding', body: 'A distinctive, timeless exterior in premium cedar shingles and shakes — rich texture and handcrafted quality, naturally resistant to decay and insects, with multiple finish options.', image: null },
    ],
  }),
  block('NumberedCards', 'colorplus-design', {
    eyebrow: 'ColorPlus® Technology',
    title: 'Three ways to choose your color',
    columns: '3',
    background: 'soft',
    items: [
      { n: '15', title: 'Statement Collection', body: 'Fifteen regionally curated colors, pre-selected to flatter local architecture — the easiest place to start.' },
      { n: '700+', title: 'Dream Collection', body: 'Over seven hundred customizable colors for full creative control — match a mood board or your existing palette exactly.' },
      { n: '∞', title: 'Primed & Custom', body: 'Prefer a one-of-a-kind shade? Primed products are engineered to hold any paint color your heart desires.' },
    ],
  }),
  block('CheckList', 'guide-design', {
    eyebrow: 'Designing for the Bay Area',
    title: 'Choices that look right and last',
    columns: '3',
    background: 'white',
    items: [
      { title: 'Built for coastal moisture & fog', body: 'Fiber cement resists moisture and rot, and mid-tone ColorPlus® finishes hide fog-borne grime between washes — keeping your exterior looking fresh year-round.' },
      { title: 'Wildfire-conscious materials', body: 'In fire-aware Bay Area communities, non-combustible fiber cement is a smart, design-forward choice — a wood look while meeting tougher exterior standards.' },
      { title: 'Curb appeal & resale value', body: "Pairing the right profile with your home's architecture lifts curb appeal and protects long-term value — especially in competitive Peninsula neighborhoods." },
    ],
  }),
  block('FAQBlock', 'faq-design', {
    eyebrow: 'Common questions',
    title: 'Siding design, answered',
    background: 'soft',
    items: [
      { q: 'What are the most popular siding colors for Bay Area homes?', a: "Soft greys, sage greens, warm taupes and crisp whites are the most requested ColorPlus® finishes on the Peninsula. They complement coastal light, hide fog-borne grime well, and suit the region's mix of Craftsman, Ranch and modern architecture." },
      { q: 'Can James Hardie siding be painted a custom color?', a: 'Yes. James Hardie offers primed products engineered to hold paint, so you can match any custom color. For lower long-term maintenance, most homeowners choose factory-applied ColorPlus® finishes, which resist fading and rarely need repainting.' },
      { q: 'What is the difference between the ColorPlus Statement and Dream Collections?', a: 'The Statement Collection features 15 regionally curated colors chosen to suit local architecture, while the Dream Collection offers over 700 customizable colors for full creative control. Both are backed by a 15-year ColorPlus® finish warranty.' },
      { q: 'Which siding style suits a Craftsman or modern home?', a: 'Craftsman homes shine with horizontal lap siding plus shingle accents in earthy tones, while modern homes favor smooth panels or board-and-batten in bold, dark colors with crisp white trim.' },
      { q: 'Does siding color affect home value or energy efficiency?', a: 'Color strongly influences curb appeal and resale value, and lighter ColorPlus® finishes reflect more heat, which can help keep homes cooler. Durable factory finishes also protect the surface, extending the life and look of your siding.' },
    ],
  }),
  block('CallToAction', 'cta-design', {
    heading: 'Found a look you love?',
    copy: 'Take your style and color straight into an instant estimate — or book a free design consultation with product samples at your home.',
    buttonLabel: 'Build my instant quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────── Quality & Pricing ───────────────────── */
const qualityPricing = layout([
  block('Hero', 'hero-pricing', {
    eyebrow: '',
    heading: 'Honest pricing. Detailed proposals. Zero hidden costs.',
    subheading:
      'Every proposal is built around your home’s real needs and laid out line by line — so you know exactly what you’re paying for, and why. And we’ll beat any like-for-like quote by 10%.',
    primaryLabel: 'See how pricing works',
    primaryHref: '#estimate',
    secondaryLabel: 'Get my instant estimate',
    secondaryHref: '/instant-quote',
    image: img('9-after.jpg', 'Detailed Bay Area siding proposal and finished project'),
    background: 'white',
  }),
  block('EstimateSliderBlock', 'estimate-pricing', {
    eyebrow: 'Transparent by design',
    title: 'What goes into your price',
    copy: 'Slide to your approximate home size for a ballpark range — then see exactly what every proposal includes.',
    background: 'forest',
  }),
  block('CheckList', 'included-pricing', {
    eyebrow: '',
    title: 'Every proposal includes',
    columns: '2',
    background: 'forest',
    items: [
      { title: 'Premium materials', body: 'James Hardie® fiber cement or natural cedar, your chosen profile and color.' },
      { title: 'Professional installation', body: 'In-house craftsmen, precise reveals, clean detailing.' },
      { title: 'Weather barriers & flashing', body: 'Proper moisture protection behind every board — never skipped.' },
      { title: 'Permits', body: 'We handle the paperwork with your local Bay Area building department.' },
      { title: 'Debris removal & cleanup', body: 'Old siding hauled away; your property left spotless.' },
      { title: 'Workmanship warranty', body: 'Our 5-year guarantee plus full manufacturer warranties.' },
    ],
  }),
  block('NumberedCards', 'process-pricing', {
    eyebrow: 'Our measurement & proposal process',
    title: 'From first call to clear proposal',
    columns: '4',
    background: 'white',
    items: [
      { n: '1', title: 'Book your visit', body: "Call or submit our form and we'll schedule a convenient time to come to your home." },
      { n: '2', title: 'Precise measurement', body: 'We measure accurately, review your existing siding’s condition, and discuss styles, colors and any window or door changes.' },
      { n: '3', title: 'Detailed proposal', body: 'We email a clear, itemized proposal — every potential cost outlined, plus the safety precautions we’ll take.' },
      { n: '4', title: 'Understand before you sign', body: "We walk you through products, process and warranties so you're fully confident in your investment." },
    ],
  }),
  block('Heading', 'honest-pricing', {
    eyebrow: '',
    title: 'We’ll never recommend siding you don’t need',
    copy: 'Not sure if it’s time for new siding? Our experts give honest guidance on the condition of your siding and trim. Sometimes a fresh coat of paint is all you need — and when that’s the case, we’ll happily refer you to a trusted Bay Area painter. We treat your home like our own.',
    background: 'soft',
  }),
  block('FAQBlock', 'faq-pricing', {
    eyebrow: 'Pricing questions',
    title: 'Straight answers on cost',
    background: 'white',
    items: [
      { q: 'Is my siding quote really free?', a: "Yes. We provide a free, no-obligation in-home measurement and a detailed written proposal by email. There's never any pressure or cost to find out where you stand." },
      { q: 'How accurate is the online instant estimate?', a: 'Our instant estimate gives a close ballpark range based on your home size, style and material. We confirm the exact price during a free on-site visit, where we take precise measurements and check the condition of your existing siding.' },
      { q: 'Do you really beat any like-for-like quote by 10%?', a: "Yes. Bring us a genuine, comparable written quote for the same scope and materials and we'll beat it by 10%. Our goal is the best value on the Peninsula without cutting corners." },
      { q: "What's included in the price — are there hidden costs?", a: "Every proposal is fully itemized: materials, professional installation, weather barriers and flashing, permits, debris removal and cleanup, and our workmanship warranty. You'll understand every line before you sign anything." },
      { q: "What if I don't actually need new siding?", a: "We'll tell you honestly. We never recommend siding you don't need — sometimes a fresh coat of paint is enough, and we're happy to refer you to a trusted Bay Area painter when that's the right call." },
    ],
  }),
  block('CallToAction', 'cta-pricing', {
    heading: 'Request your free siding consultation',
    copy: 'A detailed, no-obligation proposal tailored to your home and goals — and our promise to beat any like-for-like quote by 10%.',
    buttonLabel: 'Build my instant quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────────── Gallery ───────────────────────── */
const gallery = layout([
  block('CenteredHero', 'hero-gallery', {
    badge: 'OLD SIDING TO NEW EXTERIOR — SEE IT HAPPEN',
    heading: 'Bay Area siding transformations',
    subheading: 'Drag any photo to reveal the before and after. Real homes, real craftsmanship — from San Mateo to Palo Alto.',
    stats: [],
    background: 'soft',
  }),
  block('GalleryBlock', 'grid-gallery', { eyebrow: '', title: '', copy: '', background: 'white' }),
  block('CallToAction', 'cta-gallery', {
    heading: 'Start your transformation',
    copy: 'See what premium new siding could do for your home — get an instant estimate in 60 seconds.',
    buttonLabel: 'Start my transformation →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────────── Benefits ───────────────────────── */
const benefits = layout([
  block('Hero', 'hero-benefits', {
    eyebrow: '',
    heading: 'Your home, protected & transformed to last.',
    subheading:
      'Bay Area homeowners trust Peninsula Siding Company for expert installation, premium materials, and results built to stand up to Northern California for decades.',
    primaryLabel: 'See our work',
    primaryHref: '/gallery',
    secondaryLabel: 'Get a free consultation',
    secondaryHref: '/contact-us',
    image: img('7-after.jpg', 'Protected, transformed Bay Area home exterior'),
    background: 'white',
  }),
  block('Heading', 'pillars-head-benefits', {
    eyebrow: 'Why it pays off',
    title: 'Three ways new siding works harder for you',
    copy: '',
    background: 'white',
  }),
  block('FeatureCards', 'pillars-benefits', {
    columns: '3',
    background: 'white',
    items: [
      { icon: '✎', title: 'Expert Design & Consultation', body: 'Visualize your finished exterior before work begins · In-house installation team — no subcontractors · Custom colors, styles, and accent guidance · 3D exterior renderings available', highlight: false },
      { icon: '☶', title: 'Premium Materials & Installation', body: 'James Hardie® and LP® SmartSide® authorized installer · Class 1A fire-rated product options · Energy-efficient insulation upgrades available · Backed by strong manufacturer warranties', highlight: false },
      { icon: '☀', title: 'Built for Northern California', body: 'Fade-resistant finishes rated for NorCal sun & heat · Pest and moisture protection built in · Wildfire defense upgrade options · Proven to increase home resale value', highlight: false },
    ],
  }),
  block('CheckList', 'trust-benefits', {
    eyebrow: '',
    title: '',
    columns: '2',
    background: 'soft',
    items: [
      { title: 'Elite Preferred', body: 'James Hardie® installer' },
      { title: 'LP® SmartSide®', body: 'Authorized installer' },
      { title: 'Class 1A', body: 'Fire-rated options' },
      { title: '5-Year', body: 'Workmanship warranty' },
    ],
  }),
  block('FireTestBlock', 'firetest-benefits', {
    eyebrow: 'Real-world fire test',
    title: 'Fire-resistant siding, demonstrated',
    copy: 'In a real fire test, exterior materials are exposed to direct flame and extreme heat. Traditional materials ignite — while fiber cement siding stays stable and does not catch. See the difference for yourself.',
    background: 'forest',
  }),
  block('CallToAction', 'cta-benefits', {
    heading: 'Protect and transform your home',
    copy: 'Get a free consultation and a detailed quote — and see how the right siding pays you back in protection, efficiency, and resale value.',
    buttonLabel: 'Build my instant quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────────── Contact Us ───────────────────────── */
const contactUs = layout([
  block('CenteredHero', 'hero-contact', {
    badge: '',
    heading: 'Let’s discuss your project',
    subheading:
      'Not sure where to start? Share your ideas and we’ll help you explore the best siding, window, and exterior solutions for your Bay Area home. No pressure, ever.',
    stats: [],
    background: 'soft',
  }),
  block('ContactBlock', 'form-contact', {
    eyebrow: 'Request a free consultation',
    title: 'Tell us about your project',
    copy: 'Share a few details and we’ll get right back to you — usually the same day.',
    background: 'white',
  }),
  block('CheckList', 'details-contact', {
    eyebrow: '',
    title: 'Get in touch directly',
    columns: '3',
    background: 'soft',
    items: [
      { title: 'Call us', body: '650-910-5521' },
      { title: 'Email', body: 'info@peninsulasidingcompany.com' },
      { title: 'Visit (by appointment)', body: '763 Polhemus Road, Suite 2, San Mateo, CA 94402' },
    ],
  }),
  block('NumberedCards', 'cover-contact', {
    eyebrow: "What we'll cover",
    title: 'Your consultation, step by step',
    columns: '3',
    background: 'white',
    items: [
      { n: '01', title: 'Project details', body: 'We review the service you need — installation, replacement, repair or remodel — and the size, style and location of your home.' },
      { n: '02', title: 'Design preferences', body: "Share materials, colors, styles or reference photos. We'll guide you to energy-efficient, durable, fire-resistant options that suit your home." },
      { n: '03', title: 'Timeline & budget', body: 'Tell us your ideal start date and budget range so we can recommend the best solutions that maximize value and efficiency.' },
    ],
  }),
  block('CheckList', 'working-contact', {
    eyebrow: 'From hello to handover',
    title: 'What working with us looks like',
    columns: '3',
    background: 'soft',
    items: [
      { title: 'Design consultation', body: 'An expert visits with product samples, walks you through options, and helps you visualize the perfect siding, trim and window styles for your home.' },
      { title: 'Detailed quote', body: 'A clear, transparent quote outlining every part of your project — materials, steps and costs — so there are no surprises.' },
      { title: 'Expert installation', body: 'Skilled craftsmen install with precision, backed by our 5-year workmanship guarantee and full manufacturer warranties.' },
    ],
  }),
  block('CallToAction', 'cta-contact', {
    heading: 'Prefer to see a number first?',
    copy: 'Build an instant estimate in 60 seconds — then book your free consultation. We’ll beat any like-for-like quote by 10%.',
    buttonLabel: 'Build my instant quote →',
    buttonHref: '/instant-quote',
    background: 'green',
  }),
])

/* ───────────────────────── Resources ───────────────────────── */
const resources = layout([
  block('CenteredHero', 'hero-resources', {
    badge: 'SIDING RESOURCES',
    heading: 'Guides, costs & design ideas',
    subheading: 'Practical advice on siding materials, cost, color and care — written for Bay Area homeowners.',
    stats: [],
    background: 'forest',
  }),
  block('BlogListBlock', 'list-resources', { eyebrow: '', title: '', copy: '', background: 'white' }),
])

/* ───────────────────────── Terms & Conditions ───────────────────────── */
const terms = layout([
  block('CenteredHero', 'terms-hero', {
    badge: 'Legal',
    heading: 'Terms & Conditions',
    subheading:
      'These Terms govern your use of peninsulasidingcompany.com and the products, estimates and services provided by Peninsula Siding Company. By using the site, requesting a quote, or communicating with us, you agree to these Terms.',
    stats: [],
    background: 'soft',
  }),
  block('Text', 'terms-services', {
    content:
      'Services, quotes & estimates. We provide siding and related exterior construction services. Quotes and estimates are based on the information available at the time and are not a binding contract until accepted in writing by both parties; they may change if the scope, site conditions, or material costs change. Online instant estimates are approximate ranges for guidance only and are not a formal quote.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'terms-sms-1', {
    content:
      'SMS / text messaging. By providing your mobile telephone number to Peninsula Siding Company — for example when you request a quote, complete a form, or contact us by phone or text — you agree to receive text (SMS/MMS) messages from us related to our services. This is a transactional and customer-care messaging program. Text messages are sent on our behalf by Point of Sale Unified Partners, our messaging service provider and the registered sender for this messaging program.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'terms-sms-2', {
    content:
      'Message types include appointment and installation scheduling and reminders, job and project status updates, quote and invoice notifications, account and service notices, and one-to-one replies from our team. Message frequency varies. Message and data rates may apply — we do not charge for the messages, but your mobile carrier’s standard rates may apply. To stop messages, reply STOP at any time; you will receive a one-time confirmation and can opt back in by replying START. For help, reply HELP, email info@peninsulasidingcompany.com, or call 650-910-5521. Mobile carriers are not liable for delayed or undelivered messages.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'terms-sms-3', {
    content:
      'We do not sell or share your mobile information, or your consent to receive text messages, with third parties or affiliates for their own marketing purposes. Your information is handled in accordance with our Privacy Policy at peninsulasidingcompany.com/privacy.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'terms-rest', {
    content:
      'Use of the site: you agree to use the site lawfully and not to disrupt it or access it without authorization. Intellectual property: all content on the site is owned by or licensed to Peninsula Siding Company and may not be reused without our prior written permission. Disclaimers: the site is provided “as is” without warranties to the fullest extent permitted by law; workmanship and product warranties are governed by the separate written agreement for your work. Governing law: these Terms are governed by the laws of the State of California, USA. Changes: we may update these Terms, and the version posted on the site is the current version. Contact: info@peninsulasidingcompany.com.',
    align: 'left',
    background: 'soft',
  }),
])

/* ───────────────────────── Privacy Policy ───────────────────────── */
const privacy = layout([
  block('CenteredHero', 'priv-hero', {
    badge: 'Legal',
    heading: 'Privacy Policy',
    subheading:
      'How Peninsula Siding Company collects, uses, and protects your information. Text messages are sent on our behalf by Point of Sale Unified Partners, our messaging service provider.',
    stats: [],
    background: 'soft',
  }),
  block('Text', 'priv-collect', {
    content:
      'Information we collect. Contact details you provide (name, email, phone/mobile number, property address); project information you share when requesting a quote or service; and basic website usage and analytics data.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'priv-use', {
    content:
      'How we use it. To prepare quotes and estimates and provide our siding and construction services; to schedule and carry out work and communicate with you by phone, email and text (SMS/MMS) about your enquiry, quote, job and account; to operate and improve our website; and to comply with legal obligations.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'priv-sms', {
    content:
      'SMS / text messaging & your mobile information. We do not sell, rent, or share your personal information — including your mobile phone number and your consent to receive SMS messages — with third parties or affiliates for their marketing or promotional purposes. Mobile information is used only to deliver the text messages described in our Terms & Conditions and is shared only with our messaging service provider (Point of Sale Unified Partners) as needed to send those messages on our behalf. You can opt out of texts at any time by replying STOP.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'priv-share', {
    content:
      'How we share information. We share information only with trusted service providers who help us operate — such as our messaging provider, payment processor, and scheduling tools — and only to the extent needed to provide their service to us, under appropriate confidentiality obligations, or where required by law. We do not sell your personal information.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'priv-rights', {
    content:
      'Data retention & your rights. We keep your information only as long as needed to provide our services and meet legal requirements. You may request access to, correction of, or deletion of your personal information, and may opt out of marketing at any time, by contacting info@peninsulasidingcompany.com; to stop texts, reply STOP. We use reasonable safeguards to protect your information, and our services are intended for adults and not directed to children.',
    align: 'left',
    background: 'white',
  }),
  block('Text', 'priv-contact', {
    content:
      'Changes & contact. We may update this Privacy Policy, and the version posted on the site is the current version. Questions? Contact info@peninsulasidingcompany.com or 650-910-5521, 763 Polhemus Road, Suite 2, San Mateo, CA 94402.',
    align: 'left',
    background: 'soft',
  }),
])

export const PAGE_LAYOUTS: Record<string, ReturnType<typeof layout>> = {
  'about-us': aboutUs,
  services,
  'design-inspirations': designInspirations,
  'quality-pricing': qualityPricing,
  gallery,
  benefits,
  'contact-us': contactUs,
  resources,
  terms,
  privacy,
}
