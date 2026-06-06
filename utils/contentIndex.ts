import type { LinkItem } from './seo'

export const employmentSubtopicLinks: LinkItem[] = [
  {
    title: 'California Wrongful Termination Lawyer',
    href: '/employment-law/wrongful-termination',
    description: 'Understand illegal firing claims, deadlines, and available damages under California law.',
  },
  {
    title: 'California Workplace Discrimination Attorney',
    href: '/employment-law/workplace-discrimination',
    description: 'Protected classes, adverse actions, and evidence strategies for discrimination claims.',
  },
  {
    title: 'California Sexual Harassment Lawyer',
    href: '/employment-law/sexual-harassment',
    description: 'Quid pro quo, hostile work environment, and employer liability issues.',
  },
  {
    title: 'California Wage and Hour Disputes',
    href: '/employment-law/wage-and-hour-disputes',
    description: 'Unpaid wages, missed breaks, overtime, and payroll record violations.',
  },
  {
    title: 'California Whistleblower Protection Lawyer',
    href: '/employment-law/whistleblower-protection',
    description: 'Retaliation claims under Labor Code section 1102.5 and related protections.',
  },
  {
    title: 'California Workplace Retaliation Attorney',
    href: '/employment-law/workplace-retaliation',
    description: 'Claims involving protected complaints, leave, wage disputes, and employer retaliation.',
  },
]

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

export const comparePageLinks: LinkItem[] = [
  {
    title: 'Wrongful Termination vs Workplace Discrimination',
    href: '/compare/wrongful-termination-vs-discrimination',
    description: 'How the claims overlap, when they differ, and why many cases involve both.',
  },
  {
    title: 'Employment Lawyer vs Self-Representation',
    href: '/compare/employment-lawyer-vs-self-representation',
    description: 'When contingency representation changes leverage, valuation, and deadlines.',
  },
  {
    title: 'Personal Injury vs Workers Compensation',
    href: '/compare/personal-injury-vs-workers-comp',
    description: 'Two claim paths with different defendants, damages, and proof burdens.',
  },
  {
    title: 'Lemon Law vs Auto Fraud',
    href: '/compare/lemon-law-vs-auto-fraud',
    description: 'Warranty defect claims versus deceptive sales practice claims.',
  },
  {
    title: 'Settlement vs Trial in Employment Cases',
    href: '/compare/settlement-vs-trial',
    description: 'Speed, privacy, risk, leverage, and recovery differences between paths.',
  },
  {
    title: 'At-Will Employment vs Contract Employment in California',
    href: '/compare/at-will-vs-contract-employment',
    description: 'How employment status affects termination rights and contract claims.',
  },
  {
    title: 'Exempt vs Non-Exempt Employees',
    href: '/compare/exempt-vs-non-exempt',
    description: 'Overtime, meal breaks, and misclassification issues under California law.',
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
    employmentSubtopicLinks[0],
    employmentSubtopicLinks[3],
    faqPageLinks[0],
  ]
}
