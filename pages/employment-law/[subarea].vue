<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="cover" :style="{ height: smAndDown ? '300px' : '500px', position: smAndDown ? 'relative' : 'sticky', top: smAndDown ? undefined : 'calc(var(--v-layout-top) + 16px)' }">
      <img class="background" :src="imageUrl" :alt="`${detail.pageTitle} - The Azizi Firm`" />
      <img class="logo" src="/assets/images/banner-logo.svg" width="300" alt="The Azizi Firm Logo" />
      <h1 v-html="detail.imageHeader" />
      <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Free Employment Law Consultation</VBtn>
    </div>
    <div class="info" :class="{ 'text-center': smAndDown }">
      <PageMetaBar />
      <div class="text-block">
        <h2 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.headerText }}</h2>
        <p>{{ detail.topParagraph }}</p>
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
              <img src="/assets/images/bullet.png" alt="" /><p><span v-html="bullet"></span></p>
            </div>
          </div>
        </div>
      </template>
      <div class="text-block">
        <h2 class="text-secondary">{{ detail.definitionHeader || 'What You Need to Know' }}</h2>
        <p><strong>{{ detail.definitionText }}</strong></p>
      </div>
      <div v-if="detail.stats && detail.stats.length" class="text-block">
        <h3>{{ detail.statsHeader || 'Key Statistics' }}</h3>
        <ul><li v-for="(s, i) in detail.stats" :key="i">{{ s }}</li></ul>
      </div>
      <div v-if="detail.faq && detail.faq.length" class="text-block">
        <h2 class="text-secondary">Frequently Asked Questions</h2>
        <div v-for="(q, i) in detail.faq" :key="i" class="text-block">
          <h3>{{ q.question }}</h3>
          <p>{{ q.answer }}</p>
        </div>
      </div>
      <h2 class="text-secondary">Why Hire Us For Your {{ detail.headerText }} Case?</h2>
      <div class="text-block">
        <h3>California Employment Law Expertise</h3>
        <p>{{ detail.whyHireText }}</p>
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
        <h2 class="text-secondary">Related Employment Law Resources</h2>
        <div class="related-links">
          <NuxtLink v-for="link in relatedResources" :key="link.href" :to="link.href">
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

const { data: detail } = await useAsyncData(`emp-sub-${route.params.subarea}`, () =>
  import(`~/data/sub-services/employment-law/${route.params.subarea}.json`).then(m => m.default || m)
)

if (!detail.value) throw createError({ statusCode: 404, statusMessage: 'Employment law topic not found' })

const imageUrl = computed(() => detail.value?.src || '/assets/images/employment-law.png')
const pageTitle = computed(() => `${detail.value.pageTitle} | The Azizi Firm`)
const relatedResources = computed(() => {
  const currentPath = route.path
  return [
    ...employmentSubtopicLinks,
    ...comparePageLinks.slice(0, 2),
    faqPageLinks[0],
  ].filter((link) => link.href !== currentPath).slice(0, 6)
})

useSeoMeta({
  title: pageTitle, ogTitle: pageTitle,
  description: () => detail.value.metaDescription,
  ogDescription: () => detail.value.metaDescription,
  ogType: 'website', ogUrl: () => `https://theazizifirm.com${route.path}`,
  twitterCard: 'summary_large_image', twitterTitle: pageTitle, twitterDescription: () => detail.value.metaDescription,
  robots: 'index, follow',
})

useHead({
  script: [{ type: 'application/ld+json', children: () => JSON.stringify({
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'BreadcrumbList', 'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Employment Law', 'item': 'https://theazizifirm.com/practice-areas/employment-law' },
        { '@type': 'ListItem', 'position': 3, 'name': detail.value.pageTitle, 'item': `https://theazizifirm.com${route.path}` }
      ]},
      {
        '@type': 'WebPage',
        'name': detail.value.pageTitle,
        'url': `https://theazizifirm.com${route.path}`,
        'dateModified': formatIsoDate(CONTENT_LAST_UPDATED)
      },
      { '@type': 'FAQPage', 'mainEntity': (detail.value?.faq || []).map((q: any) => ({ '@type': 'Question', 'name': q.question, 'acceptedAnswer': { '@type': 'Answer', 'text': q.answer } }))}
    ]})
  }]
})

const scrollToContactForm = () => document.getElementById('contact-box')?.scrollIntoView({ behavior: 'smooth' })
</script>

<style scoped lang="scss">
.info-page {
  display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin: auto;
  .cover {
    position: relative; overflow: hidden; padding: 4rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
    h1 { color: #fff; text-align: center; margin-bottom: 16px; font-size: 2rem;
      :deep(span) { color: rgb(var(--v-theme-secondary)); } }
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
