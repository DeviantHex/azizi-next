import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async () => {
  const urls: { loc: string; lastmod?: string }[] = []
  const today = new Date().toISOString().split('T')[0]

  const addUrl = (loc: string) => { urls.push({ loc, lastmod: today }) }

  // Static pages
  for (const p of ['/', '/about', '/our-team', '/blogs', '/practice-areas', '/contact-us', '/privacy-policy']) {
    addUrl(p)
  }

  // Practice area pages
  for (const a of ['personal-injury', 'employment-law', 'auto-fraud', 'lemon-law']) {
    addUrl(`/practice-areas/${a}`)
  }

  // Employment law sub-topics (22 pages)
  const empSubs = [
    'wrongful-termination', 'workplace-discrimination', 'sexual-harassment',
    'wage-and-hour-disputes', 'whistleblower-protection', 'workplace-retaliation',
    'hostile-work-environment', 'pregnancy-discrimination', 'racial-discrimination',
    'age-discrimination', 'disability-discrimination', 'sexual-orientation-discrimination',
    'gender-discrimination', 'religious-discrimination', 'unpaid-wages',
    'overtime-violations', 'misclassification', 'wrongful-constructive-discharge',
    'breach-of-employment-contract', 'family-medical-leave', 'severance-agreements',
    'non-compete-agreements',
  ]
  for (const s of empSubs) {
    addUrl(`/employment-law/${s}`)
  }

  // City + Employment Law (25 pages)
  const cities = [
    'san-diego', 'los-angeles', 'san-francisco', 'san-jose', 'sacramento',
    'fresno', 'oakland', 'long-beach', 'bakersfield', 'anaheim',
    'riverside', 'santa-ana', 'irvine', 'stockton', 'chula-vista',
    'fremont', 'santa-clarita', 'san-bernardino', 'modesto', 'oxnard',
    'torrance', 'pasadena', 'orange', 'glendale', 'huntington-beach',
  ]
  for (const c of cities) {
    addUrl(`/employment-lawyer/${c}`)
  }

  // City + Car Accident (20 pages)
  const carCities = cities.slice(0, 20)
  for (const c of carCities) {
    addUrl(`/car-accident-lawyer/${c}`)
  }

  // City + Wrongful Death (15 pages)
  const wdCities = cities.slice(0, 15)
  for (const c of wdCities) {
    addUrl(`/wrongful-death-attorney/${c}`)
  }

  // City + Lemon Law (10 pages)
  const llCities = cities.slice(0, 10)
  for (const c of llCities) {
    addUrl(`/lemon-law-attorney/${c}`)
  }

  // FAQ pages (15 pages)
  const faqs = [
    'what-is-wrongful-termination', 'signs-of-workplace-discrimination',
    'how-to-file-wrongful-termination-claim', 'california-at-will-employment',
    'how-much-employment-case-worth', 'california-wage-theft',
    'what-is-hostile-work-environment', 'how-long-employment-case-takes',
    'can-i-sue-for-discrimination', 'car-accident-settlement-california',
    'lemon-law-requirements', 'auto-fraud-consumer-rights',
    'personal-injury-timeline', 'california-statute-of-limitations',
    'contingency-fee-explained',
  ]
  for (const f of faqs) {
    addUrl(`/faq/${f}`)
  }

  // Comparison pages (7 pages)
  const compares = [
    'wrongful-termination-vs-discrimination',
    'employment-lawyer-vs-self-representation',
    'personal-injury-vs-workers-comp',
    'lemon-law-vs-auto-fraud',
    'settlement-vs-trial',
    'at-will-vs-contract-employment',
    'exempt-vs-non-exempt',
  ]
  for (const c of compares) {
    addUrl(`/compare/${c}`)
  }

  // Blog posts from Firestore
  try {
    const db = getFirestore()
    const snapshot = await db.collection('blogs')
      .orderBy('createdDate', 'desc')
      .limit(100)
      .get()

    snapshot.forEach((doc) => {
      const data = doc.data()
      urls.push({
        loc: `/blog/${doc.id}`,
        lastmod: data.updatedDate?._seconds
          ? new Date(data.updatedDate._seconds * 1000).toISOString().split('T')[0]
          : data.createdDate?._seconds
            ? new Date(data.createdDate._seconds * 1000).toISOString().split('T')[0]
          : today,
      })
    })
  } catch {
    // Firestore may be unavailable in some environments
  }

  return urls
})
