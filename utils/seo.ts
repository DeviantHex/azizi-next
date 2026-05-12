export interface LinkItem {
  title: string
  href: string
  description?: string
}

export const SITE_URL = 'https://theazizifirm.com'
export const FIRM_NAME = 'The Azizi Firm'
export const PHONE_NUMBER = '+1 858-829-3962'
export const PHONE_URI = 'tel:+18588293962'
export const CONTACT_EMAIL = 'aa@theazizifirm.com'
export const OFFICE_ADDRESS = {
  streetAddress: '401 West A Street, Suite 1150',
  addressLocality: 'San Diego',
  addressRegion: 'CA',
  postalCode: '92101',
  addressCountry: 'US',
}
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://share.google/OkaFpBV3m6amwfSWL'
export const ORGANIZATION_SAME_AS = [GOOGLE_BUSINESS_PROFILE_URL]
export const CONTENT_LAST_UPDATED = '2026-05-10'

export function toAbsoluteUrl(path = '') {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function formatIsoDate(dateString = CONTENT_LAST_UPDATED) {
  return new Date(`${dateString}T00:00:00Z`).toISOString()
}

export function formatDisplayDate(dateString = CONTENT_LAST_UPDATED) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateString}T00:00:00Z`))
}

export function joinList(items: string[]) {
  if (items.length <= 1) return items[0] || ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`
}

export function dedupeLinks(links: LinkItem[]) {
  const seen = new Set<string>()
  return links.filter((link) => {
    if (seen.has(link.href)) return false
    seen.add(link.href)
    return true
  })
}
