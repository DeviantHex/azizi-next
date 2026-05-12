<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="cover" :style="{ height: smAndDown ? '300px' : '500px', position: smAndDown ? 'relative' : 'sticky', top: smAndDown ? undefined : 'calc(var(--v-layout-top) + 16px)' }">
      <img class="background" :src="imageUrl" :alt="`Wrongful Death Attorney ${detail.city} - The Azizi Firm`" />
      <img class="logo" src="/assets/images/banner-logo.svg" width="300" alt="The Azizi Firm Logo" />
      <h1>{{ detail.city }} <span>Wrongful Death Attorney</span></h1>
      <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Free Case Evaluation</VBtn>
    </div>
    <div class="info" :class="{ 'text-center': smAndDown }">
      <div class="text-block">
        <PageMetaBar />
        <h2 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.city }} Wrongful Death Lawyer</h2>
        <p>{{ detail.introText }}</p>
      </div>
      <div v-if="locationInsights.length" class="insight-grid">
        <VCard v-for="section in locationInsights" :key="section.title" class="insight-card">
          <VCardTitle>{{ section.title }}</VCardTitle>
          <VCardText><p>{{ section.body }}</p></VCardText>
        </VCard>
      </div>
      <template v-for="(section, i) in detail.sections" :key="i">
        <div class="text-block"><h3>{{ section.header }}</h3><p>{{ section.body }}</p></div>
      </template>
      <div v-if="detail.faq && detail.faq.length" class="text-block">
        <h2 class="text-secondary">Wrongful Death FAQs</h2>
        <div v-for="(q, i) in detail.faq" :key="i" class="text-block"><h3>{{ q.question }}</h3><p>{{ q.answer }}</p></div>
      </div>
      <h2 class="text-secondary">Why Hire Us For Your {{ detail.city }} Wrongful Death Case?</h2>
      <div class="text-block"><h3>Compassionate & Experienced</h3><p>{{ detail.whyHireText }}</p></div>
      <div class="text-block"><h3>No Upfront Fees</h3><p>We work on a contingency fee basis. You owe nothing unless we secure compensation for your family.</p></div>
      <div class="text-block"><h3>Contact Us</h3><p>{{ detail.contactUsText }}</p></div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { buildLocationInsightSections, buildLocationSchema } from '~/utils/locationContent'

const { smAndDown } = useDisplay()
const route = useRoute()

const { data: detail } = await useAsyncData(`wrongful-death-${route.params.city}`, () =>
  import(`~/data/locationPages/wrongful-death/${route.params.city}.json`).then(m => m.default || m)
)

if (!detail.value) throw createError({ statusCode: 404, statusMessage: 'City page not found' })

const imageUrl = computed(() => detail.value?.src || '/assets/images/homepage-carousel/wrongful-death.png')
const locationInsights = computed(() => buildLocationInsightSections('wrongful-death-attorney', route.params.city as string))
const pageTitle = computed(() => `${detail.value.city} Wrongful Death Attorney | The Azizi Firm`)
const pageDescription = computed(() => `${detail.value.city} wrongful death lawyer. Free consultation. Compassionate representation for families. No fees unless we win. Call (858) 829-3962.`)

useSeoMeta({
  title: pageTitle, ogTitle: pageTitle, description: pageDescription, ogDescription: pageDescription,
  ogType: 'website', ogUrl: () => `https://theazizifirm.com${route.path}`,
  twitterCard: 'summary_large_image', twitterTitle: pageTitle, twitterDescription: pageDescription,
  robots: 'index, follow',
})

useHead({
  script: [{ type: 'application/ld+json', children: () => JSON.stringify({
    '@context': 'https://schema.org', '@graph': buildLocationSchema({
      citySlug: route.params.city as string,
      pagePath: route.path,
      pageTitle: `${detail.value.city} Wrongful Death Attorney`,
      pageDescription: pageDescription.value,
      parentName: 'Personal Injury',
      parentPath: '/practice-areas/personal-injury',
      serviceLabel: 'Wrongful Death Attorney',
      faq: detail.value?.faq || [],
    })})
  }]
})

const scrollToContactForm = () => document.getElementById('contact-box')?.scrollIntoView({ behavior: 'smooth' })
</script>

<style scoped lang="scss">
.info-page { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin: auto;
  .cover { position: relative; overflow: hidden; padding: 4rem; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
    h1 { color: #fff; text-align: center; margin-bottom: 16px; font-size: 2.2rem; } h1 span { color: rgb(var(--v-theme-secondary)); }
    .background { position: absolute; width: 100%; left: 50%; top: 50%; transform: translate(-50%, -50%); }
    .logo { position: absolute; top: 20px; right: 20px; width: 80px; } }
  .info { max-width: 75ch; display: flex; flex-direction: column; gap: 20px; flex: 1 0 300px;
    .insight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .insight-card { border-radius: 8px; }
    .text-block { display: flex; flex-direction: column; gap: 4px; h3 { margin-bottom: 4px; } p { line-height: 1.6; } } }
}
</style>
