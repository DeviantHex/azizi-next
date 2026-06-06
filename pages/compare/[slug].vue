<template>
  <VContainer v-if="detail" class="detail-page">
    <div class="content">
      <div class="text-block">
        <h1>{{ detail.pageTitle }}</h1>
        <PageMetaBar />
        <p>{{ detail.intro }}</p>
      </div>

      <div v-for="section in detail.sections" :key="section.heading" class="text-block">
        <h2 class="text-secondary">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </div>

      <div class="text-block">
        <h2 class="text-secondary">When To Get Legal Advice</h2>
        <p>{{ detail.contactUsText }}</p>
      </div>

      <div class="text-block">
        <h2 class="text-secondary">Related Guides</h2>
        <div class="related-links">
          <NuxtLink v-for="link in relatedLinks" :key="link.href" :to="link.href">
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { comparePageLinks, faqPageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, dedupeLinks, formatIsoDate, toAbsoluteUrl, type LinkItem } from '~/utils/seo'

type ComparePage = {
  pageTitle: string
  metaDescription: string
  intro: string
  sections: Array<{ heading: string, body: string }>
  contactUsText: string
  relatedLinks: LinkItem[]
}

const route = useRoute()
const slug = route.params.slug as string

const comparePages: Record<string, ComparePage> = {
  'wrongful-termination-vs-discrimination': {
    pageTitle: 'Wrongful Termination vs Workplace Discrimination',
    metaDescription: 'Understand the difference between wrongful termination and workplace discrimination claims under California law.',
    intro: 'Wrongful termination and workplace discrimination often overlap, but they are not the same legal theory. The right claim depends on why the employer acted and what happened before the termination or adverse action.',
    sections: [
      {
        heading: 'Wrongful Termination',
        body: 'A wrongful termination claim focuses on an unlawful firing. The employer may have fired someone for reporting misconduct, taking protected leave, refusing illegal conduct, or another reason that violates public policy or statute.',
      },
      {
        heading: 'Workplace Discrimination',
        body: 'A discrimination claim focuses on adverse treatment tied to a protected characteristic such as race, sex, disability, age, religion, pregnancy, or another protected category. A person can face discrimination even if they were not fired.',
      },
      {
        heading: 'Why The Distinction Matters',
        body: 'The distinction affects deadlines, evidence, and whether administrative filing is required before going to court. Many California employment cases involve both theories, so the facts should be evaluated together rather than in isolation.',
      },
    ],
    contactUsText: 'If you were fired or targeted at work and are not sure which claim fits your facts, an employment lawyer can identify the strongest legal path and preserve filing deadlines.',
    relatedLinks: dedupeLinks([
      faqPageLinks.find((link) => link.href === '/faq/what-is-wrongful-termination')!,
      faqPageLinks.find((link) => link.href === '/faq/can-i-sue-for-discrimination')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of wrongful termination, retaliation, harassment, and wage-dispute representation.' },
    ]),
  },
  'employment-lawyer-vs-self-representation': {
    pageTitle: 'Employment Lawyer vs Self-Representation',
    metaDescription: 'Compare hiring an employment lawyer against representing yourself in a California employment case.',
    intro: 'Employees can represent themselves, but employment disputes are document-heavy, deadline-driven, and usually defended by experienced counsel. The decision affects leverage long before trial.',
    sections: [
      {
        heading: 'What A Lawyer Changes',
        body: 'An employment lawyer helps frame claims correctly, preserve evidence, calculate damages, handle agency filings, and negotiate from a stronger position. That work often shapes the case value early.',
      },
      {
        heading: 'Risks Of Going Alone',
        body: 'Self-represented plaintiffs often miss procedural requirements, undervalue damages, or respond poorly to employer explanations and settlement pressure. Even strong facts can be weakened by process mistakes.',
      },
      {
        heading: 'How To Decide',
        body: 'If the case involves termination, discrimination, retaliation, unpaid wages, or a looming filing deadline, legal advice usually pays for itself by preventing avoidable errors and preserving leverage.',
      },
    ],
    contactUsText: 'A quick consultation can clarify whether the claim is viable, what deadlines apply, and whether contingency representation makes sense for your case.',
    relatedLinks: dedupeLinks([
      faqPageLinks.find((link) => link.href === '/faq/how-much-employment-case-worth')!,
      faqPageLinks.find((link) => link.href === '/faq/how-to-file-wrongful-termination-claim')!,
      faqPageLinks.find((link) => link.href === '/faq/contingency-fee-explained')!,
    ]),
  },
  'personal-injury-vs-workers-comp': {
    pageTitle: 'Personal Injury vs Workers Compensation',
    metaDescription: 'Learn how personal injury claims differ from workers compensation claims in California.',
    intro: 'Personal injury and workers compensation claims can arise from the same event, but they target different defendants, damages, and proof requirements.',
    sections: [
      {
        heading: 'Workers Compensation',
        body: 'Workers compensation is usually the remedy against an employer for an on-the-job injury. Fault is less important, but the available benefits are narrower and typically do not include pain-and-suffering damages.',
      },
      {
        heading: 'Personal Injury',
        body: 'A personal injury claim usually targets a negligent third party, such as another driver, property owner, or product manufacturer. Those claims can include broader damage categories depending on the facts.',
      },
      {
        heading: 'Why Coordination Matters',
        body: 'When both avenues exist, the timing and evidence strategy matter because liens, medical records, and settlement structure can affect the overall recovery.',
      },
    ],
    contactUsText: 'If you were injured while working and someone other than your employer may be responsible, legal review can clarify whether both claim paths should be pursued.',
    relatedLinks: dedupeLinks([
      { title: 'Personal Injury Practice Area', href: '/practice-areas/personal-injury', description: 'Overview of accident, injury, and wrongful death representation.' },
      faqPageLinks.find((link) => link.href === '/faq/personal-injury-timeline')!,
      faqPageLinks.find((link) => link.href === '/faq/california-statute-of-limitations')!,
    ]),
  },
  'lemon-law-vs-auto-fraud': {
    pageTitle: 'Lemon Law vs Auto Fraud',
    metaDescription: 'Compare California lemon law claims with California auto fraud claims and when each one applies.',
    intro: 'Lemon law and auto fraud cases both involve vehicle problems, but they address different misconduct. The first focuses on warranty defects, while the second centers on deception during the sale or financing process.',
    sections: [
      {
        heading: 'Lemon Law',
        body: 'A lemon law claim usually involves substantial defects covered by warranty that were not fixed after a reasonable number of repair attempts or caused excessive time out of service.',
      },
      {
        heading: 'Auto Fraud',
        body: 'An auto fraud claim usually involves misrepresentation or concealment, such as hiding prior damage, falsifying mileage, disguising title history, or deceptive financing terms.',
      },
      {
        heading: 'How They Can Overlap',
        body: 'Some cases involve both defect and deception issues. The best legal strategy depends on the purchase documents, repair history, disclosures, and what the dealer or manufacturer knew.',
      },
    ],
    contactUsText: 'A focused case review can show whether the stronger remedy is buyback-style lemon law relief, fraud damages, or a combination of claims.',
    relatedLinks: dedupeLinks([
      { title: 'Lemon Law Practice Area', href: '/practice-areas/lemon-law', description: 'Vehicle defect and warranty-claim overview.' },
      { title: 'Auto Fraud Practice Area', href: '/practice-areas/auto-fraud', description: 'Dealer misrepresentation and consumer-fraud overview.' },
      faqPageLinks.find((link) => link.href === '/faq/auto-fraud-consumer-rights')!,
    ]),
  },
  'settlement-vs-trial': {
    pageTitle: 'Settlement vs Trial In Employment Cases',
    metaDescription: 'Compare settlement and trial paths in California employment cases, including speed, privacy, and risk.',
    intro: 'Most employment cases resolve before trial, but settlement is not automatically the better outcome. The right path depends on liability proof, damages, risk tolerance, and the employer’s willingness to negotiate seriously.',
    sections: [
      {
        heading: 'Settlement',
        body: 'Settlement can reduce delay, cost, and stress while preserving privacy. It may also produce faster payment and avoid the unpredictability of a jury.',
      },
      {
        heading: 'Trial',
        body: 'Trial may offer stronger leverage or a higher upside when the facts are compelling and the employer refuses a fair resolution. It also brings more time, risk, and preparation demands.',
      },
      {
        heading: 'Decision Factors',
        body: 'The strength of evidence, witness quality, emotional tolerance, and financial needs all influence whether settlement or trial is the more practical path.',
      },
    ],
    contactUsText: 'An attorney can assess settlement value against trial risk so you are making a business decision instead of reacting to pressure from the other side.',
    relatedLinks: dedupeLinks([
      faqPageLinks.find((link) => link.href === '/faq/how-much-employment-case-worth')!,
      faqPageLinks.find((link) => link.href === '/faq/how-long-employment-case-takes')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of California employment disputes handled by the firm.' },
    ]),
  },
  'at-will-vs-contract-employment': {
    pageTitle: 'At-Will Employment vs Contract Employment In California',
    metaDescription: 'Understand how at-will employment differs from contract employment under California law.',
    intro: 'California is generally an at-will employment state, but contracts, policies, and public-policy protections can change what an employer can do and what remedies are available after a dispute.',
    sections: [
      {
        heading: 'At-Will Employment',
        body: 'At-will status usually means the employment relationship can be ended by either side at any time, with or without cause, unless a law or agreement says otherwise.',
      },
      {
        heading: 'Contract Employment',
        body: 'An employment contract can limit when termination is allowed, define compensation terms, or create enforceable obligations that do not exist in a purely at-will relationship.',
      },
      {
        heading: 'Where Claims Arise',
        body: 'Disputes often turn on whether the employer violated a written agreement, made enforceable promises, or used a reason for termination that California law prohibits regardless of at-will status.',
      },
    ],
    contactUsText: 'When job terms, offer letters, handbooks, or severance documents are involved, legal review can determine whether the case is stronger than a simple at-will dispute.',
    relatedLinks: dedupeLinks([
      faqPageLinks.find((link) => link.href === '/faq/california-at-will-employment')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of termination, retaliation, contract, and wage-related claims.' },
      faqPageLinks.find((link) => link.href === '/faq/what-is-wrongful-termination')!,
    ]),
  },
  'exempt-vs-non-exempt': {
    pageTitle: 'Exempt vs Non-Exempt Employees',
    metaDescription: 'Learn the difference between exempt and non-exempt employee status in California and why misclassification matters.',
    intro: 'Exempt and non-exempt classification affects overtime, meal and rest breaks, timekeeping, and other wage protections. Misclassification can create major liability for an employer.',
    sections: [
      {
        heading: 'Non-Exempt Employees',
        body: 'Non-exempt employees are generally entitled to overtime, meal breaks, rest breaks, accurate wage statements, and other wage-and-hour protections under California law.',
      },
      {
        heading: 'Exempt Employees',
        body: 'Exempt employees are excluded from some wage-and-hour rules, but only if they meet both salary and duties tests. A title alone does not decide exemption status.',
      },
      {
        heading: 'Why It Matters',
        body: 'When an employer labels workers exempt incorrectly, the worker may have claims for unpaid overtime, missed-break premiums, wage-statement penalties, and related damages.',
      },
    ],
    contactUsText: 'Classification problems often sit underneath larger wage disputes, so a proper review should include time records, job duties, and payroll practices.',
    relatedLinks: dedupeLinks([
      faqPageLinks.find((link) => link.href === '/faq/california-wage-theft')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of wage disputes, retaliation, discrimination, and wrongful termination matters.' },
      faqPageLinks.find((link) => link.href === '/faq/how-much-employment-case-worth')!,
    ]),
  },
}

const detail = comparePages[slug]

if (!detail) {
  throw createError({ statusCode: 404, statusMessage: 'Comparison guide not found' })
}

const pageTitle = `${detail.pageTitle} | The Azizi Firm`
const canonicalUrl = toAbsoluteUrl(route.path)
const relatedLinks = dedupeLinks([
  ...detail.relatedLinks,
  ...comparePageLinks.filter((link) => link.href !== route.path).slice(0, 3),
]).slice(0, 6)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: detail.metaDescription,
  ogDescription: detail.metaDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: detail.metaDescription,
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          'name': detail.pageTitle,
          'url': canonicalUrl,
          'description': detail.metaDescription,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': toAbsoluteUrl('/') },
            { '@type': 'ListItem', 'position': 2, 'name': 'Comparisons', 'item': toAbsoluteUrl('/compare') },
            { '@type': 'ListItem', 'position': 3, 'name': detail.pageTitle, 'item': canonicalUrl },
          ],
        },
      ],
    }),
  }],
})
</script>

<style scoped lang="scss">
.detail-page {
  padding-top: 2rem;

  .content {
    max-width: 75ch;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .text-block {
    display: flex;
    flex-direction: column;
    gap: 10px;

    p {
      line-height: 1.6;
    }
  }

  .related-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;

    a {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    span {
      color: #5c6670;
    }
  }
}
</style>
