import type { LinkItem } from './seo'

export const faqPageLinks: LinkItem[] = [
  {
    title: 'What Is Wrongful Termination in California?',
    href: '/faq/what-is-wrongful-termination',
    description: 'Definitions, examples, evidence, and deadlines for wrongful termination claims.',
  },
  {
    title: 'Signs of Workplace Discrimination in California',
    href: '/faq/signs-of-workplace-discrimination',
    description: 'Common red flags, documentation tips, and next steps for employees.',
  },
  {
    title: 'How to File a Wrongful Termination Claim in California',
    href: '/faq/how-to-file-wrongful-termination-claim',
    description: 'Agency filing steps, timing rules, and what to gather before you act.',
  },
  {
    title: 'California At-Will Employment: Exceptions and Rights',
    href: '/faq/california-at-will-employment',
    description: 'What at-will means and when a firing still breaks California law.',
  },
  {
    title: 'How Much Is My Employment Case Worth?',
    href: '/faq/how-much-employment-case-worth',
    description: 'Key damages categories and the facts that influence case value.',
  },
  {
    title: 'California Wage Theft: Know Your Rights',
    href: '/faq/california-wage-theft',
    description: 'Unpaid wages, off-the-clock work, deductions, and enforcement options.',
  },
  {
    title: 'What Is a Hostile Work Environment Under California Law?',
    href: '/faq/what-is-hostile-work-environment',
    description: 'When workplace conduct becomes unlawful harassment and what to document.',
  },
  {
    title: 'How Long Does an Employment Lawsuit Take in California?',
    href: '/faq/how-long-employment-case-takes',
    description: 'Typical timelines from intake through settlement, mediation, or trial.',
  },
  {
    title: 'Can I Sue My Employer for Discrimination in California?',
    href: '/faq/can-i-sue-for-discrimination',
    description: 'Who can sue, what must be filed first, and what outcomes may be available.',
  },
  {
    title: 'Average Car Accident Settlement in California',
    href: '/faq/car-accident-settlement-california',
    description: 'The damages that drive injury claim value and why averages can mislead.',
  },
  {
    title: 'California Lemon Law Requirements: What Qualifies',
    href: '/faq/lemon-law-requirements',
    description: 'Repair attempts, warranty coverage, and out-of-service rules.',
  },
  {
    title: 'California Auto Fraud: Consumer Rights and Remedies',
    href: '/faq/auto-fraud-consumer-rights',
    description: 'Dealer misrepresentation, concealment, and available consumer claims.',
  },
  {
    title: 'How Long Does a Personal Injury Case Take in California?',
    href: '/faq/personal-injury-timeline',
    description: 'Case stages, common delays, and what affects the time to resolution.',
  },
  {
    title: 'California Personal Injury Statute of Limitations',
    href: '/faq/california-statute-of-limitations',
    description: 'Filing deadlines and why acting quickly protects evidence and leverage.',
  },
  {
    title: 'How Contingency Fees Work: No Fees Unless We Win',
    href: '/faq/contingency-fee-explained',
    description: 'How contingency arrangements work and what clients can expect financially.',
  },
]

export function getBlogRelatedLinks(title = '', content = ''): LinkItem[] {
  const text = `${title} ${content}`.toLowerCase()

  if (text.includes('lemon') || text.includes('vehicle') || text.includes('dealer')) {
    return [
      { title: 'California Lemon Law', href: '/practice-areas/lemon-law' },
      { title: 'California Auto Fraud', href: '/practice-areas/auto-fraud' },
      faqPageLinks.find((link) => link.href === '/faq/lemon-law-requirements')!,
    ]
  }

  if (text.includes('injury') || text.includes('accident') || text.includes('collision')) {
    return [
      { title: 'California Personal Injury Lawyer', href: '/practice-areas/personal-injury' },
      { title: 'Average Car Accident Settlement in California', href: '/faq/car-accident-settlement-california' },
      faqPageLinks.find((link) => link.href === '/faq/personal-injury-timeline')!,
    ]
  }

  return [
    { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law' },
    faqPageLinks.find((link) => link.href === '/faq/what-is-wrongful-termination')!,
    faqPageLinks[0],
  ]
}
