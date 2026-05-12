<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="info" :class="{ 'text-center': smAndDown }">
      <div class="text-block">
        <h1 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.pageTitle }}</h1>
        <PageMetaBar />
      </div>
      <template v-for="(section, i) in detail.sections" :key="i">
        <div class="text-block"><p>{{ section }}</p></div>
      </template>
      <div class="text-block">
        <h2 class="text-secondary">Frequently Asked Questions</h2>
        <div v-for="(q, i) in detail.faq" :key="i" class="text-block">
          <h3>{{ q.question }}</h3>
          <p>{{ q.answer }}</p>
        </div>
      </div>
      <div class="text-block">
        <h2 class="text-secondary">Contact The Azizi Firm</h2>
        <p>{{ detail.contactUsText }}</p>
      </div>
      <div class="text-block">
        <h2 class="text-secondary">Related FAQ Guides</h2>
        <div class="related-links">
          <NuxtLink v-for="link in relatedFaqs" :key="link.href" :to="link.href">
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { faqPageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()
const route = useRoute()

const { data: detail } = await useAsyncData(`faq-${route.params.slug}`, () =>
  import(`~/data/faqPages/${route.params.slug}.json`).then(m => m.default || m)
)

if (!detail.value) throw createError({ statusCode: 404, statusMessage: 'FAQ page not found' })

const pageTitle = computed(() => `${detail.value.pageTitle} | The Azizi Firm`)
const relatedFaqs = computed(() => faqPageLinks.filter((link) => link.href !== route.path).slice(0, 6))

useSeoMeta({
  title: pageTitle, ogTitle: pageTitle,
  description: () => detail.value.metaDescription,
  ogDescription: () => detail.value.metaDescription,
  ogType: 'article', ogUrl: () => `https://theazizifirm.com${route.path}`,
  twitterCard: 'summary_large_image', twitterTitle: pageTitle, twitterDescription: () => detail.value.metaDescription,
  robots: 'index, follow',
})

useHead({
  script: [{ type: 'application/ld+json', children: () => JSON.stringify({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'BreadcrumbList', 'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
          { '@type': 'ListItem', 'position': 2, 'name': 'FAQ', 'item': 'https://theazizifirm.com/faq' },
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
</script>

<style scoped lang="scss">
.info-page { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin: auto; padding-top: 2rem;
  .info { max-width: 75ch; display: flex; flex-direction: column; gap: 20px; flex: 1 0 300px;
    .text-block { display: flex; flex-direction: column; gap: 10px; h3 { margin-bottom: 4px; } p { line-height: 1.6; } }
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
