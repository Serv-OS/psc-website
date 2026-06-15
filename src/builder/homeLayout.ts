/** Default Home page layout as Puck data — seeded so the builder-rendered home
 *  is populated out of the box and fully editable at /builder. */
export const HOME_LAYOUT = {
  root: { props: {} },
  zones: {},
  content: [
    {
      type: 'Hero',
      props: {
        id: 'Hero-home',
        eyebrow: '5-Star Rated Bay Area Siding Experts',
        heading: 'Siding that protects and transforms your Bay Area home.',
        subheading:
          'Premium James Hardie® materials, expert craftsmanship, and a quote you can build in 60 seconds — with transparent pricing and zero hidden costs.',
        primaryLabel: 'Get my instant estimate',
        primaryHref: '/#quote',
        secondaryLabel: 'Design my exterior',
        secondaryHref: '/#quote',
        image: null,
        background: 'white',
      },
    },
    {
      type: 'Heading',
      props: { id: 'Heading-services', eyebrow: 'What we install', title: 'Complete exterior solutions, built to last', copy: '', background: 'white' },
    },
    {
      type: 'ServicesGrid',
      props: {
        id: 'Services-home',
        columns: '4',
        background: 'white',
        items: [
          { title: 'Fiber Cement Siding', body: 'Durable, low-maintenance James Hardie® board.', image: null },
          { title: 'Real Wood Shingles', body: 'Timeless coastal character and warmth.', image: null },
          { title: 'Wood-Look Fiber Cement', body: 'Authentic grain without the upkeep.', image: null },
          { title: 'Windows & Doors', body: 'Energy-efficient replacements that seal tight.', image: null },
        ],
      },
    },
    {
      type: 'BeforeAfter',
      props: {
        id: 'BA-home',
        eyebrow: 'Before & after',
        heading: 'Old exteriors, reimagined.',
        text: 'Drag the handle to see how Peninsula Siding Company transforms a tired facade into a durable, energy-efficient home. Yours could be next.',
        buttonLabel: 'Get my free estimate',
        buttonHref: '/#quote',
        beforeImage: null,
        afterImage: null,
        background: 'forest',
      },
    },
    {
      type: 'QuoteEngine',
      props: {
        id: 'Quote-home',
        eyebrow: 'Design it · Price it · Book it',
        title: 'Find your perfect James Hardie® siding',
        copy: 'Pick a profile, texture and ColorPlus® finish — then get an instant, accurate estimate for your home. Your selection flows straight into the quote.',
      },
    },
    {
      type: 'Heading',
      props: { id: 'Heading-why', eyebrow: 'Why choose us', title: 'Curb appeal, durability, and confidence that lasts', copy: '', background: 'soft' },
    },
    {
      type: 'FeatureCards',
      props: {
        id: 'Features-home',
        columns: '4',
        background: 'soft',
        items: [
          { icon: '★', title: 'Full Service, Start to Finish', body: 'Every stage managed with seamless coordination and expert craftsmanship.' },
          { icon: '♥', title: 'Local, Family Owned', body: 'A family design-build firm delivering every remodel with integrity and care.' },
          { icon: '✉', title: 'Clear Communication', body: 'Regular updates, transparent pricing, and straightforward guidance throughout.' },
          { icon: '⚮', title: '5-Year Warranty', body: 'Full accountability and lasting confidence in the quality of your remodel.' },
        ],
      },
    },
    {
      type: 'Heading',
      props: { id: 'Heading-reviews', eyebrow: 'What homeowners say', title: 'Trusted across the Peninsula', copy: '', background: 'white' },
    },
    {
      type: 'Reviews',
      props: {
        id: 'Reviews-home',
        background: 'white',
        items: [
          { quote: 'The crew was meticulous and the new Hardie siding completely transformed our curb appeal. Clear pricing, no surprises.', author: 'San Mateo homeowner', projectType: 'Whole-house re-side' },
          { quote: 'Professional from the first call to the final walkthrough. They beat another quote and still delivered top quality.', author: 'Redwood City homeowner', projectType: 'Siding + windows' },
          { quote: 'Communication was excellent throughout. The 5-year warranty gave us real peace of mind. Highly recommend.', author: 'Palo Alto homeowner', projectType: 'Board & batten' },
        ],
      },
    },
    {
      type: 'CallToAction',
      props: {
        id: 'CTA-home',
        heading: 'Ready for your free estimate?',
        copy: "Build your quote in 60 seconds — we'll beat any like-for-like quote by 10%.",
        buttonLabel: 'Start my quote →',
        buttonHref: '/#quote',
        background: 'green',
      },
    },
  ],
}
