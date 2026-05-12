<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="cover" :style="{ height: smAndDown ? '300px' : '500px', position: smAndDown ? 'relative' : 'sticky', top: smAndDown ? undefined : 'calc(var(--v-layout-top) + 16px)' }">
      <img class="background" :src="imageUrl" :alt="`${areaName} Lawyer California - The Azizi Firm`" />
      <img class="logo" src="/assets/images/banner-logo.svg" width="300" alt="The Azizi Firm Logo" />
      <h1 v-html="detail.imageHeader" />
      <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Get a Free Evaluation</VBtn>
    </div>
    <div class="info" :class="{ 'text-center': smAndDown }">
      <PageMetaBar />
      <div class="text-block">
        <h2 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.headerText }}</h2>
        <p v-html="detail.topParagraph"></p>
      </div>
      <template v-for="(section, i) in detail.sections" :key="i">
        <div v-if="section.header || section.subtitle" class="text-block header">
          <h3 v-if="section.header">{{ section.header }}</h3>
          <p v-if="section.subtitle">{{ section.subtitle }}</p>
        </div>
        <div v-for="({ header, body, bullets }, j) in section.content" :key="j" class="text-block">
          <h3 v-if="header"><img v-if="section.type === 'bulletHead'" src="/assets/images/bullet.png" alt="" />{{ header }}</h3>
          <p v-if="body"><img v-if="section.type === 'bulletBody'" src="/assets/images/bullet.png" alt="" /><span v-html="body"></span></p>
          <div v-if="bullets" class="bullets">
            <div v-for="(bullet, k) in bullets" :key="k" class="bullet">
              <img src="/assets/images/bullet.png" alt="" />
              <p><span v-html="bullet"></span></p>
            </div>
          </div>
        </div>
      </template>
      <h2 class="text-secondary">Why Hire Us For Your {{ detail.headerText }} Case?</h2>
      <div class="text-block">
        <h3>Experienced and Knowledgeable</h3>
        <p>We have extensive experience handling {{ detail.headerText.toLowerCase() }} cases. {{ detail.whyHireText }}</p>
      </div>
      <div class="text-block">
        <h3>No Upfront Fees</h3>
        <p>We work on a contingency fee basis, meaning you don't pay us unless we win your case.</p>
      </div>
      <div class="text-block">
        <h3>Proven Record</h3>
        <p>We have a proven record of securing substantial compensation for our clients.</p>
      </div>
      <div class="text-block">
        <h3>Contact Us</h3>
        <p>{{ detail.contactUsText }}</p>
      </div>
      <div class="text-block">
        <h2 class="text-secondary">Explore Related Resources</h2>
        <div class="related-links">
          <NuxtLink v-for="link in resourceLinks" :key="link.href" :to="link.href">
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { comparePageLinks, employmentSubtopicLinks, faqPageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()
const route = useRoute()

const areaName = computed(() => {
  const name = route.params.area as string
  const map: Record<string, string> = {
    'personal-injury': 'Personal Injury',
    'employment-law': 'Employment Law',
    'auto-fraud': 'Auto Fraud',
    'lemon-law': 'Lemon Law',
  }
  return map[name] || name
})

const { data: detail } = await useAsyncData(`info-${route.params.area}`, () =>
  import(`~/data/infoPages/${route.params.area}.json`).then(m => m.default || m)
)

if (!detail.value) {
  throw createError({ statusCode: 404, statusMessage: 'Practice area not found' })
}

const imageUrl = computed(() => detail.value?.src || '')
const resourceLinks = computed(() => {
  if (route.params.area === 'employment-law') {
    return employmentSubtopicLinks
  }

  return [
    ...comparePageLinks.slice(0, 3),
    ...faqPageLinks.slice(9, 12),
  ]
})

const descriptions: Record<string, string> = {
  'personal-injury': 'California personal injury lawyer representing car accidents, truck accidents, motorcycle accidents, slip and falls, wrongful death, brain injuries, and more. Free consultation. No fees unless we win.',
  'employment-law': 'California employment lawyer handling wrongful termination, workplace discrimination, harassment, retaliation, wage disputes, and whistleblower cases. Free case evaluation. Call (858) 829-3962.',
  'auto-fraud': 'California auto fraud attorney. Dealer scams, odometer fraud, title washing, bait and switch, financing fraud. Free consultation. We fight for California consumers.',
  'lemon-law': 'California lemon law attorney. Get a refund or replacement for your defective vehicle. Free evaluation. We handle new, used, and leased vehicles under warranty. No fees unless we win.',
}

const pageTitle = computed(() => `${areaName.value} Lawyer California | The Azizi Firm`)
const pageDescription = computed(() => descriptions[route.params.area as string] || `${areaName.value} lawyer in San Diego. Free consultation with The Azizi Firm. No fees unless we win. Call (858) 829-3962 today.`)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: () => `https://theazizifirm.com${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Practice Areas', 'item': 'https://theazizifirm.com/practice-areas' },
            { '@type': 'ListItem', 'position': 3, 'name': areaName.value, 'item': `https://theazizifirm.com${route.path}` }
          ]
        },
        {
          '@type': 'WebPage',
          'name': areaName.value,
          'url': `https://theazizifirm.com${route.path}`,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED)
        },
        {
          '@type': 'FAQPage',
          'mainEntity': (detail.value?.sections || [])
            .filter((s: any) => s.header && s.subtitle)
            .flatMap((s: any) => s.content?.filter((c: any) => c.header && c.body) || [])
            .slice(0, 10)
            .map((item: any) => ({
              '@type': 'Question',
              'name': item.header,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.body?.replace(/<[^>]*>/g, '') || ''
              }
            }))
        }
      ]
    })
  }]
})

const scrollToContactForm = () => {
  document.getElementById('contact-box')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.info-page {
  display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin: auto;
  .cover {
    position: relative; height: 500px; overflow: hidden; padding: 4rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
    h1 { color: #fff; position: inherit; text-align: center; margin-bottom: 16px; }
    .background { position: absolute; width: 100%; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    .logo { position: absolute; top: 20px; right: 20px; width: 80px; }
  }
  .info {
    max-width: 75ch; display: flex; flex-direction: column; gap: 20px; flex: 1 0 300px;
    .text-block {
      display: flex; flex-direction: column; gap: 4px;
      &.header { margin-top: 12px; }
      :deep(br) { display: block; content: ''; margin-top: 8px; }
      h3 img { margin-right: 4px; }
      .bullets {
        display: flex; flex-direction: column; gap: 8px; text-align: left;
        .bullet { display: flex; gap: 4px; align-items: start; }
        img { margin-top: 0.4rem; }
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
}
</style>
