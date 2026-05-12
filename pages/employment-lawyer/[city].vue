<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="cover" :style="{ height: smAndDown ? '300px' : '500px', position: smAndDown ? 'relative' : 'sticky', top: smAndDown ? undefined : 'calc(var(--v-layout-top) + 16px)' }">
      <img class="background" :src="imageUrl" :alt="`Employment Lawyer ${detail.city} - The Azizi Firm`" />
      <img class="logo" src="/assets/images/banner-logo.svg" width="300" alt="The Azizi Firm Logo" />
      <h1>{{ detail.city }} <span>Employment Lawyer</span></h1>
      <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Free Employment Law Consultation</VBtn>
    </div>
    <div class="info" :class="{ 'text-center': smAndDown }">
      <PageMetaBar />
      <div class="text-block">
        <h2 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.city }} Employment Law Attorney</h2>
        <p>{{ detail.introText }}</p>
      </div>
      <div class="text-block">
        <h3>{{ detail.city }} County Employment Law</h3>
        <p>{{ detail.localInfo }}</p>
      </div>
      <div v-if="locationInsights.length" class="insight-grid">
        <VCard v-for="section in locationInsights" :key="section.title" class="insight-card">
          <VCardTitle>{{ section.title }}</VCardTitle>
          <VCardText>
            <p>{{ section.body }}</p>
          </VCardText>
        </VCard>
      </div>
      <template v-for="(section, i) in detail.sections" :key="i">
        <div class="text-block">
          <h3>{{ section.header }}</h3>
          <p>{{ section.body }}</p>
        </div>
      </template>
      <div v-if="detail.faq && detail.faq.length" class="text-block">
        <h2 class="text-secondary">Frequently Asked Questions</h2>
        <div v-for="(q, i) in detail.faq" :key="i" class="text-block">
          <h3>{{ q.question }}</h3>
          <p>{{ q.answer }}</p>
        </div>
      </div>
      <h2 class="text-secondary">Why Hire The Azizi Firm for Your {{ detail.city }} Employment Law Case?</h2>
      <div class="text-block">
        <h3>California Employment Law Expertise</h3>
        <p>{{ detail.whyHireText }}</p>
      </div>
      <div class="text-block">
        <h3>No Upfront Fees</h3>
        <p>We work on a contingency fee basis. You pay nothing unless we win your employment law case.</p>
      </div>
      <div class="text-block">
        <h3>Serving All of California</h3>
        <p>While we have a physical office in San Diego, our employment law practice extends throughout California including {{ detail.city }} and {{ detail.city }} County. We handle cases before the California DLSE, EEOC, and California Superior Courts throughout the state.</p>
      </div>
      <div v-if="detail.nearbyCities && detail.nearbyCities.length" class="text-block">
        <h3>Also Serving Nearby Areas</h3>
        <p>In addition to {{ detail.city }}, we proudly serve: {{ detail.nearbyCities.join(', ') }} and throughout {{ detail.city }} County and all of California.</p>
      </div>
      <div class="text-block">
        <h3>Contact Us</h3>
        <p>{{ detail.contactUsText }}</p>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { buildLocationInsightSections, buildLocationSchema } from '~/utils/locationContent'

const { smAndDown } = useDisplay()
const route = useRoute()

const { data: detail } = await useAsyncData(`emp-law-${route.params.city}`, () =>
  import(`~/data/locationPages/employment-law/${route.params.city}.json`).then(m => m.default || m)
)

if (!detail.value) {
  throw createError({ statusCode: 404, statusMessage: 'City page not found' })
}

const imageUrl = computed(() => detail.value?.src || '/assets/images/employment-law.png')
const locationInsights = computed(() => buildLocationInsightSections('employment-lawyer', route.params.city as string))

const pageTitle = computed(() => `${detail.value.city} Employment Lawyer | The Azizi Firm`)
const pageDescription = computed(() =>
  `California employment lawyer serving ${detail.value.city}. Wrongful termination, discrimination, harassment & wage disputes. Free consultation. No fees unless we win. Call (858) 829-3962.`
)

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
      '@graph': buildLocationSchema({
        citySlug: route.params.city as string,
        pagePath: route.path,
        pageTitle: `${detail.value.city} Employment Lawyer`,
        pageDescription: pageDescription.value,
        parentName: 'Employment Law',
        parentPath: '/practice-areas/employment-law',
        serviceLabel: 'Employment Lawyer',
        faq: detail.value?.faq || [],
      })
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
    position: relative; overflow: hidden; padding: 4rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
    h1 { color: #fff; position: inherit; text-align: center; margin-bottom: 16px; font-size: 2.2rem; }
    h1 span { color: rgb(var(--v-theme-secondary)); }
    .background { position: absolute; width: 100%; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    .logo { position: absolute; top: 20px; right: 20px; width: 80px; }
  }
  .info {
    max-width: 75ch; display: flex; flex-direction: column; gap: 20px; flex: 1 0 300px;
    .insight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .insight-card { border-radius: 8px; }
    .text-block {
      display: flex; flex-direction: column; gap: 4px;
      h3 { margin-bottom: 4px; }
      p { line-height: 1.6; }
    }
  }
}
</style>
