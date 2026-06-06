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
        <h2 class="text-secondary">How The Azizi Firm Can Help</h2>
        <p>{{ detail.contactUsText }}</p>
      </div>

      <div class="text-block">
        <h2 class="text-secondary">Related Employment Guides</h2>
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
import { employmentSubtopicLinks, faqPageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, dedupeLinks, formatIsoDate, toAbsoluteUrl, type LinkItem } from '~/utils/seo'

type TopicPage = {
  pageTitle: string
  metaDescription: string
  intro: string
  sections: Array<{ heading: string, body: string }>
  contactUsText: string
  relatedLinks: LinkItem[]
}

const route = useRoute()
const slug = route.params.subarea as string

const employmentTopics: Record<string, TopicPage> = {
  'wrongful-termination': {
    pageTitle: 'California Wrongful Termination Lawyer',
    metaDescription: 'Learn how California wrongful termination claims work, what evidence matters, and when legal deadlines apply.',
    intro: 'Wrongful termination claims arise when an employer fires someone for an illegal reason, such as retaliation, discrimination, whistleblowing, protected leave, or another reason that violates California law or public policy.',
    sections: [
      {
        heading: 'When A Firing Becomes Illegal',
        body: 'California is an at-will employment state, but employers still cannot fire workers for reasons the law forbids. Protected complaints, discrimination, protected leave, wage complaints, and refusal to engage in unlawful conduct are common examples.',
      },
      {
        heading: 'What Evidence Matters',
        body: 'Timing, shifting explanations, performance history, internal complaints, witness statements, and preserved messages often determine whether the employer explanation is believable.',
      },
    ],
    contactUsText: 'A prompt legal review can identify viable claims, preserve deadlines, and help secure the documents and witness evidence that usually decide these cases.',
    relatedLinks: [
      faqPageLinks.find((link) => link.href === '/faq/what-is-wrongful-termination')!,
      faqPageLinks.find((link) => link.href === '/faq/how-to-file-wrongful-termination-claim')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of termination, discrimination, retaliation, and wage-dispute representation.' },
    ],
  },
  'workplace-discrimination': {
    pageTitle: 'California Workplace Discrimination Attorney',
    metaDescription: 'Understand workplace discrimination claims in California, including protected classes, evidence, and filing rules.',
    intro: 'Workplace discrimination happens when an employer treats an employee or applicant unfavorably because of a protected characteristic, including race, sex, disability, age, religion, pregnancy, or another protected category.',
    sections: [
      {
        heading: 'What Counts As Discrimination',
        body: 'Discrimination can involve hiring, firing, promotion, pay, discipline, accommodation, scheduling, job assignments, or harassment. It does not always require termination to be actionable.',
      },
      {
        heading: 'Building The Case',
        body: 'Comparators, comments, timing, documentation, complaint history, and inconsistent employer explanations often provide the strongest proof in discrimination matters.',
      },
    ],
    contactUsText: 'Legal guidance is especially important because discrimination claims often require administrative filing before litigation and benefit from a carefully documented timeline.',
    relatedLinks: [
      faqPageLinks.find((link) => link.href === '/faq/signs-of-workplace-discrimination')!,
      faqPageLinks.find((link) => link.href === '/faq/can-i-sue-for-discrimination')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of discrimination, retaliation, harassment, and termination claims.' },
    ],
  },
  'sexual-harassment': {
    pageTitle: 'California Sexual Harassment Lawyer',
    metaDescription: 'Learn how sexual harassment claims work in California and what employees should document.',
    intro: 'Sexual harassment claims may involve quid pro quo demands, hostile work environment conduct, retaliation after reporting, or employer inaction after notice of serious misconduct.',
    sections: [
      {
        heading: 'Common Harassment Patterns',
        body: 'Unwanted comments, propositions, touching, explicit messages, degrading treatment, and retaliation after reporting can all contribute to a viable claim depending on severity and frequency.',
      },
      {
        heading: 'What To Preserve',
        body: 'Written complaints, screenshots, witness names, HR responses, and a clear timeline of incidents often become central evidence in harassment cases.',
      },
    ],
    contactUsText: 'Employees dealing with harassment should document events carefully and get legal advice before evidence disappears or the employer reframes the complaint.',
    relatedLinks: [
      faqPageLinks.find((link) => link.href === '/faq/what-is-hostile-work-environment')!,
      faqPageLinks.find((link) => link.href === '/faq/can-i-sue-for-discrimination')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of harassment, retaliation, and discrimination matters.' },
    ],
  },
  'wage-and-hour-disputes': {
    pageTitle: 'California Wage And Hour Disputes',
    metaDescription: 'Understand unpaid wage, overtime, meal-break, and timekeeping disputes under California law.',
    intro: 'Wage and hour disputes often involve unpaid overtime, off-the-clock work, missed meal or rest breaks, misclassification, wage-statement problems, or other payroll practices that violate California law.',
    sections: [
      {
        heading: 'How Wage Claims Arise',
        body: 'Employers may underpay through automatic deductions, inaccurate timekeeping, flat-rate pay practices, unpaid preparatory work, improper exemption classification, or pressure to work off the clock.',
      },
      {
        heading: 'Why Records Matter',
        body: 'Timesheets, schedules, wage statements, texts, login records, and coworker testimony often determine the scope of unpaid wages and penalties.',
      },
    ],
    contactUsText: 'These cases often improve significantly once payroll records are reviewed with counsel and the right legal theory is applied to the underlying pay practice.',
    relatedLinks: [
      faqPageLinks.find((link) => link.href === '/faq/california-wage-theft')!,
      faqPageLinks.find((link) => link.href === '/faq/how-much-employment-case-worth')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of wage disputes, retaliation, and termination claims.' },
    ],
  },
  'whistleblower-protection': {
    pageTitle: 'California Whistleblower Protection Lawyer',
    metaDescription: 'Learn how California whistleblower and retaliation protections apply when employees report unlawful conduct.',
    intro: 'Whistleblower cases arise when an employee reports unlawful conduct, unsafe practices, fraud, wage violations, or regulatory issues and then faces retaliation because of that report.',
    sections: [
      {
        heading: 'Protected Conduct',
        body: 'Employees may be protected when reporting suspected violations internally, to government agencies, or when refusing to participate in conduct they reasonably believe is unlawful.',
      },
      {
        heading: 'Retaliation Signals',
        body: 'Termination, demotion, isolation, write-ups, schedule changes, and sudden scrutiny after a report can all support a retaliation theory when tied to the protected activity.',
      },
    ],
    contactUsText: 'Whistleblower matters are often won or lost on timing and documentation, so preserving the reporting trail early is critical.',
    relatedLinks: [
      { title: 'California Workplace Retaliation Attorney', href: '/employment-law/workplace-retaliation', description: 'Learn how retaliation claims are analyzed under California law.' },
      faqPageLinks.find((link) => link.href === '/faq/how-to-file-wrongful-termination-claim')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of retaliation, termination, and workplace-rights claims.' },
    ],
  },
  'workplace-retaliation': {
    pageTitle: 'California Workplace Retaliation Attorney',
    metaDescription: 'Understand retaliation claims in California after complaints about discrimination, wages, leave, safety, or other protected activity.',
    intro: 'Retaliation occurs when an employer punishes someone for engaging in protected conduct, such as reporting discrimination, requesting leave, complaining about wages, or opposing unlawful practices.',
    sections: [
      {
        heading: 'Protected Activity',
        body: 'Workers are protected when they make good-faith complaints, assist in investigations, request legal accommodations or leave, or otherwise assert rights that California law protects.',
      },
      {
        heading: 'Adverse Action',
        body: 'Retaliation is not limited to firing. Demotions, reduced hours, write-ups, exclusion, denied promotions, and hostile treatment can also support a claim when linked to protected activity.',
      },
    ],
    contactUsText: 'The key issue is often causal connection, so legal review should focus on timing, documentation, and whether the employer explanation makes sense against the timeline.',
    relatedLinks: [
      faqPageLinks.find((link) => link.href === '/faq/how-to-file-wrongful-termination-claim')!,
      faqPageLinks.find((link) => link.href === '/faq/what-is-wrongful-termination')!,
      { title: 'Employment Law Practice Area', href: '/practice-areas/employment-law', description: 'Overview of retaliation, discrimination, and wage-related claims.' },
    ],
  },
}

const detail = employmentTopics[slug]

if (!detail) {
  throw createError({ statusCode: 404, statusMessage: 'Employment law topic not found' })
}

const pageTitle = `${detail.pageTitle} | The Azizi Firm`
const canonicalUrl = toAbsoluteUrl(route.path)
const relatedLinks = dedupeLinks([
  ...detail.relatedLinks,
  ...employmentSubtopicLinks.filter((link) => link.href !== route.path).slice(0, 3),
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
            { '@type': 'ListItem', 'position': 2, 'name': 'Employment Law', 'item': toAbsoluteUrl('/practice-areas/employment-law') },
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
