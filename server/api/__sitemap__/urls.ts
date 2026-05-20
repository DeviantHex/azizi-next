import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async () => {
  const urls: { loc: string; lastmod?: string }[] = []
  const today = new Date().toISOString().split('T')[0]

  const addUrl = (loc: string) => { urls.push({ loc, lastmod: today }) }

  // Static pages
  for (const p of ['/', '/about', '/our-team', '/blogs', '/contact-us', '/privacy-policy']) {
    addUrl(p)
  }

  // Practice area pages
  const practiceAreas = ['employment-law', 'personal-injury', 'auto-fraud', 'lemon-law']
  for (const p of practiceAreas) {
    addUrl(`/practice-areas/${p}`)
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
