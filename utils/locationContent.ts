import { CONTACT_EMAIL, FIRM_NAME, OFFICE_ADDRESS, PHONE_NUMBER, joinList, toAbsoluteUrl } from './seo'

export type LocationService =
  | 'employment-lawyer'
  | 'car-accident-lawyer'
  | 'wrongful-death-attorney'
  | 'lemon-law-attorney'

export interface CityProfile {
  city: string
  county: string
  population: string
  court: string
  industries: string[]
  commuterRoutes: string[]
  geo: {
    lat: number
    lng: number
  }
}

export interface LocationInsightSection {
  title: string
  body: string
}

const cityProfiles: Record<string, CityProfile> = {
  'anaheim': { city: 'Anaheim', county: 'Orange County', population: '340,000+', court: 'Orange County Superior Court', industries: ['hospitality', 'healthcare', 'advanced manufacturing', 'distribution'], commuterRoutes: ['I-5', 'SR-57', 'SR-91'], geo: { lat: 33.8366, lng: -117.9143 } },
  'bakersfield': { city: 'Bakersfield', county: 'Kern County', population: '410,000+', court: 'Kern County Superior Court', industries: ['energy', 'agriculture', 'logistics', 'healthcare'], commuterRoutes: ['SR-99', 'I-5', 'SR-58'], geo: { lat: 35.3733, lng: -119.0187 } },
  'chula-vista': { city: 'Chula Vista', county: 'San Diego County', population: '275,000+', court: 'San Diego County Superior Court', industries: ['healthcare', 'education', 'retail', 'cross-border logistics'], commuterRoutes: ['I-5', 'I-805', 'SR-125'], geo: { lat: 32.6401, lng: -117.0842 } },
  'fremont': { city: 'Fremont', county: 'Alameda County', population: '225,000+', court: 'Alameda County Superior Court', industries: ['advanced manufacturing', 'technology', 'warehousing', 'healthcare'], commuterRoutes: ['I-880', 'I-680', 'Dumbarton Bridge'], geo: { lat: 37.5483, lng: -121.9886 } },
  'fresno': { city: 'Fresno', county: 'Fresno County', population: '545,000+', court: 'Fresno County Superior Court', industries: ['agriculture', 'healthcare', 'warehousing', 'public sector'], commuterRoutes: ['SR-99', 'SR-41', 'SR-168'], geo: { lat: 36.7378, lng: -119.7871 } },
  'glendale': { city: 'Glendale', county: 'Los Angeles County', population: '190,000+', court: 'Los Angeles County Superior Court', industries: ['healthcare', 'media', 'professional services', 'retail'], commuterRoutes: ['SR-134', 'I-5', 'SR-2'], geo: { lat: 34.1425, lng: -118.2551 } },
  'huntington-beach': { city: 'Huntington Beach', county: 'Orange County', population: '195,000+', court: 'Orange County Superior Court', industries: ['tourism', 'retail', 'construction', 'marine services'], commuterRoutes: ['Pacific Coast Highway', 'I-405', 'Beach Boulevard'], geo: { lat: 33.6595, lng: -117.9988 } },
  'irvine': { city: 'Irvine', county: 'Orange County', population: '310,000+', court: 'Orange County Superior Court', industries: ['technology', 'biotech', 'education', 'professional services'], commuterRoutes: ['I-405', 'I-5', 'SR-133'], geo: { lat: 33.6846, lng: -117.8265 } },
  'long-beach': { city: 'Long Beach', county: 'Los Angeles County', population: '450,000+', court: 'Los Angeles County Superior Court', industries: ['port logistics', 'healthcare', 'hospitality', 'aerospace'], commuterRoutes: ['I-710', 'I-405', 'Pacific Coast Highway'], geo: { lat: 33.7701, lng: -118.1937 } },
  'los-angeles': { city: 'Los Angeles', county: 'Los Angeles County', population: '3.8 million+', court: 'Los Angeles County Superior Court', industries: ['entertainment', 'healthcare', 'technology', 'logistics'], commuterRoutes: ['I-5', 'I-10', 'US-101', 'I-405'], geo: { lat: 34.0522, lng: -118.2437 } },
  'modesto': { city: 'Modesto', county: 'Stanislaus County', population: '220,000+', court: 'Stanislaus County Superior Court', industries: ['agriculture', 'food processing', 'distribution', 'healthcare'], commuterRoutes: ['SR-99', 'SR-132', 'SR-108'], geo: { lat: 37.6391, lng: -120.9969 } },
  'oakland': { city: 'Oakland', county: 'Alameda County', population: '435,000+', court: 'Alameda County Superior Court', industries: ['port logistics', 'healthcare', 'construction', 'professional services'], commuterRoutes: ['I-880', 'I-580', 'I-980'], geo: { lat: 37.8044, lng: -122.2712 } },
  'orange': { city: 'Orange', county: 'Orange County', population: '140,000+', court: 'Orange County Superior Court', industries: ['healthcare', 'education', 'retail', 'construction'], commuterRoutes: ['SR-55', 'SR-22', 'I-5'], geo: { lat: 33.7879, lng: -117.8531 } },
  'oxnard': { city: 'Oxnard', county: 'Ventura County', population: '200,000+', court: 'Ventura County Superior Court', industries: ['agriculture', 'logistics', 'manufacturing', 'port services'], commuterRoutes: ['US-101', 'Pacific Coast Highway', 'SR-1'], geo: { lat: 34.1975, lng: -119.1771 } },
  'pasadena': { city: 'Pasadena', county: 'Los Angeles County', population: '135,000+', court: 'Los Angeles County Superior Court', industries: ['education', 'healthcare', 'engineering', 'research'], commuterRoutes: ['I-210', 'SR-134', 'SR-110'], geo: { lat: 34.1478, lng: -118.1445 } },
  'riverside': { city: 'Riverside', county: 'Riverside County', court: 'Riverside County Superior Court', population: '320,000+', industries: ['warehousing', 'education', 'healthcare', 'manufacturing'], commuterRoutes: ['SR-91', 'I-215', 'SR-60'], geo: { lat: 33.9806, lng: -117.3755 } },
  'sacramento': { city: 'Sacramento', county: 'Sacramento County', population: '525,000+', court: 'Sacramento County Superior Court', industries: ['state government', 'healthcare', 'education', 'construction'], commuterRoutes: ['I-5', 'US-50', 'I-80'], geo: { lat: 38.5816, lng: -121.4944 } },
  'san-bernardino': { city: 'San Bernardino', county: 'San Bernardino County', population: '220,000+', court: 'San Bernardino County Superior Court', industries: ['logistics', 'warehousing', 'healthcare', 'public sector'], commuterRoutes: ['I-10', 'I-215', 'SR-210'], geo: { lat: 34.1083, lng: -117.2898 } },
  'san-diego': { city: 'San Diego', county: 'San Diego County', population: '1.38 million+', court: 'San Diego County Superior Court', industries: ['biotech', 'healthcare', 'defense', 'hospitality'], commuterRoutes: ['I-5', 'I-8', 'I-15', 'I-805'], geo: { lat: 32.7157, lng: -117.1611 } },
  'san-francisco': { city: 'San Francisco', county: 'San Francisco County', population: '800,000+', court: 'San Francisco Superior Court', industries: ['technology', 'finance', 'hospitality', 'healthcare'], commuterRoutes: ['US-101', 'I-80', 'CA-1'], geo: { lat: 37.7749, lng: -122.4194 } },
  'san-jose': { city: 'San Jose', county: 'Santa Clara County', population: '970,000+', court: 'Santa Clara County Superior Court', industries: ['technology', 'semiconductors', 'healthcare', 'construction'], commuterRoutes: ['US-101', 'I-280', 'I-680', 'SR-87'], geo: { lat: 37.3382, lng: -121.8863 } },
  'santa-ana': { city: 'Santa Ana', county: 'Orange County', population: '310,000+', court: 'Orange County Superior Court', industries: ['government', 'healthcare', 'retail', 'manufacturing'], commuterRoutes: ['I-5', 'SR-55', 'SR-22'], geo: { lat: 33.7455, lng: -117.8677 } },
  'santa-clarita': { city: 'Santa Clarita', county: 'Los Angeles County', population: '230,000+', court: 'Los Angeles County Superior Court', industries: ['logistics', 'healthcare', 'film production', 'construction'], commuterRoutes: ['I-5', 'SR-14'], geo: { lat: 34.3917, lng: -118.5426 } },
  'stockton': { city: 'Stockton', county: 'San Joaquin County', population: '320,000+', court: 'San Joaquin County Superior Court', industries: ['logistics', 'agriculture', 'healthcare', 'distribution'], commuterRoutes: ['I-5', 'SR-99', 'CA-4'], geo: { lat: 37.9577, lng: -121.2908 } },
  'torrance': { city: 'Torrance', county: 'Los Angeles County', population: '145,000+', court: 'Los Angeles County Superior Court', industries: ['healthcare', 'advanced manufacturing', 'retail', 'professional services'], commuterRoutes: ['I-405', 'Pacific Coast Highway', 'Hawthorne Boulevard'], geo: { lat: 33.8358, lng: -118.3406 } },
}

export function getCityProfile(citySlug: string) {
  return cityProfiles[citySlug]
}

export function buildLocationInsightSections(service: LocationService, citySlug: string): LocationInsightSection[] {
  const profile = getCityProfile(citySlug)
  if (!profile) return []

  const industries = joinList(profile.industries)
  const commuterRoutes = joinList(profile.commuterRoutes)

  if (service === 'employment-lawyer') {
    return [
      {
        title: `Workplace issues we see in ${profile.city}`,
        body: `${profile.city} workers are heavily concentrated in ${industries}. That mix regularly produces disputes involving classification, overtime, leave, retaliation, discrimination, and terminations tied to performance metrics or restructuring. We build employment cases around the records and management structures common in ${profile.county}.`,
      },
      {
        title: `Where ${profile.city} employment disputes are usually handled`,
        body: `Claims arising in ${profile.city} may involve the California Civil Rights Department, the Labor Commissioner's Office, and ${profile.court}. We help clients choose the right sequence: internal complaint, agency filing, demand package, settlement negotiations, or civil litigation.`,
      },
      {
        title: `What evidence matters most in a ${profile.city} employment case`,
        body: `Strong claims usually start with pay records, schedules, commission statements, HR complaints, performance reviews, handbook policies, and messages with supervisors. In ${profile.city}, documentation tied to ${industries} employers can be especially important when the dispute involves leave, scheduling, productivity tracking, or multi-location teams.`,
      },
    ]
  }

  if (service === 'car-accident-lawyer') {
    return [
      {
        title: `Crash patterns we investigate in ${profile.city}`,
        body: `${profile.city} traffic commonly funnels through ${commuterRoutes}. Serious crashes often involve congestion, unsafe lane changes, distracted driving, commercial vehicles, rideshare activity, and speed-related impacts during peak commute periods. We investigate roadway conditions, vehicle damage, black-box data, and available video right away.`,
      },
      {
        title: `Why early documentation matters after a ${profile.city} collision`,
        body: `Medical records, scene photos, witness details, repair estimates, towing records, and employer wage records all affect leverage. In dense urban corridors like ${profile.city}, video footage and incident reports can disappear quickly, so fast action often makes a major difference.`,
      },
      {
        title: `How ${profile.city} injury claims typically move forward`,
        body: `Many cases begin with insurance claims but escalate when the insurer minimizes fault, disputes medical treatment, or ignores long-term earning losses. If the case does not resolve fairly, we are prepared to file in ${profile.court} and push the case through discovery, mediation, and trial preparation.`,
      },
    ]
  }

  if (service === 'wrongful-death-attorney') {
    return [
      {
        title: `Wrongful death claims require a thorough local investigation`,
        body: `In ${profile.city}, these cases often turn on police reports, medical records, scene evidence, witness accounts, and financial support documentation. We work quickly to preserve the proof a family needs before memories fade and records become harder to obtain.`,
      },
      {
        title: `What families in ${profile.city} usually need to prove`,
        body: `A strong wrongful death case should show how the loss has affected household income, caregiving, services, and companionship. We help families document those losses carefully and present them in a way that is clear and credible to insurers, defense counsel, and ${profile.court}.`,
      },
      {
        title: `Compassionate case handling without unnecessary delay`,
        body: `Families in ${profile.city} should not have to manage insurers, deadlines, and legal procedure alone. We take over communication, coordinate supporting records, and pursue a strategy that honors your family while still pressing for full accountability.`,
      },
    ]
  }

  return [
    {
      title: `Why local dealership and repair records matter in ${profile.city}`,
      body: `Lemon law cases are won with records: repair orders, warranty history, purchase paperwork, out-of-service days, and manufacturer communications. When a vehicle has been serviced repeatedly in ${profile.city}, we organize that history to show the defect was substantial and the repair opportunities were more than reasonable.`,
    },
    {
      title: `What qualifies many ${profile.city} lemon law claims`,
      body: `California's lemon law often applies when a warranted vehicle has a serious safety issue that was not fixed after a small number of attempts, or when a substantial defect keeps returning despite repeated service visits. Electrical failures, transmission issues, braking problems, engine defects, and persistent warning lights are common examples.`,
    },
    {
      title: `How we pursue manufacturer relief for ${profile.city} consumers`,
      body: `Many cases begin with a demand package and negotiation backed by the repair history. If the manufacturer still refuses to provide a buyback, replacement, or fair cash resolution, we are prepared to litigate and pursue fee-shifting remedies that can require the manufacturer to pay attorney fees.`,
    },
  ]
}

export function buildLocationSchema(options: {
  citySlug: string
  pagePath: string
  pageTitle: string
  pageDescription: string
  parentName: string
  parentPath: string
  serviceLabel: string
  faq?: Array<{ question: string; answer: string }>
}) {
  const profile = getCityProfile(options.citySlug)
  if (!profile) return []

  const pageUrl = toAbsoluteUrl(options.pagePath)

  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: toAbsoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: options.parentName, item: toAbsoluteUrl(options.parentPath) },
        { '@type': 'ListItem', position: 3, name: options.pageTitle, item: pageUrl },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${pageUrl}#local-business`,
      name: FIRM_NAME,
      url: pageUrl,
      email: CONTACT_EMAIL,
      telephone: PHONE_NUMBER,
      address: {
        '@type': 'PostalAddress',
        ...OFFICE_ADDRESS,
      },
      areaServed: {
        '@type': 'City',
        name: profile.city,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: profile.county,
        },
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: profile.geo.lat,
        longitude: profile.geo.lng,
      },
      image: toAbsoluteUrl('/assets/images/header-logo.svg'),
      description: options.pageDescription,
    },
    {
      '@type': 'LegalService',
      '@id': `${pageUrl}#legal-service`,
      name: `${FIRM_NAME} ${options.serviceLabel}`,
      url: pageUrl,
      serviceType: options.serviceLabel,
      description: options.pageDescription,
      provider: {
        '@id': 'https://theazizifirm.com/#organization',
      },
      areaServed: {
        '@type': 'City',
        name: profile.city,
      },
    },
    ...(options.faq?.length
      ? [{
          '@type': 'FAQPage',
          mainEntity: options.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }]
      : []),
  ]
}
