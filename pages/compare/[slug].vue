<template>
  <VContainer v-if="detail" class="info-page" :class="{ 'px-6': smAndDown }">
    <div class="info" :class="{ 'text-center': smAndDown }">
      <h1 :class="{ 'text-icon-end-short': !smAndDown }">{{ detail.pageTitle }}</h1>
      <PageMetaBar />
      <div class="text-block"><p>{{ detail.introText }}</p></div>
      <div v-if="detail.comparisons" class="comparison-grid">
        <VCard v-for="(comp, i) in detail.comparisons" :key="i" class="comparison-card">
          <VCardTitle class="text-primary">{{ comp.header }}</VCardTitle>
          <VCardText><p>{{ comp.body }}</p></VCardText>
        </VCard>
      </div>
      <div v-if="detail.comparisonTable?.length" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>{{ detail.comparisonTableHeaders?.left || detail.comparisons?.[0]?.header }}</th>
              <th>{{ detail.comparisonTableHeaders?.right || detail.comparisons?.[1]?.header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in detail.comparisonTable" :key="row.topic">
              <td>{{ row.topic }}</td>
              <td>{{ row.left }}</td>
              <td>{{ row.right }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <template v-for="(section, i) in detail.sections" :key="i">
        <div class="text-block"><h3>{{ section.header }}</h3><p>{{ section.body }}</p></div>
      </template>
      <div v-if="detail.decisionGuide?.length" class="text-block">
        <h2 class="text-secondary">How to Decide Which Path Fits Your Situation</h2>
        <div class="decision-grid">
          <VCard v-for="item in detail.decisionGuide" :key="item.useCase" class="decision-card">
            <VCardTitle>{{ item.useCase }}</VCardTitle>
            <VCardText>
              <p><strong>Usually better fit:</strong> {{ item.recommendation }}</p>
              <p>{{ item.reason }}</p>
            </VCardText>
          </VCard>
        </div>
      </div>
      <div v-if="detail.bottomLine" class="text-block verdict">
        <h2 class="text-secondary">Bottom Line</h2>
        <p>{{ detail.bottomLine }}</p>
      </div>
      <div class="text-block">
        <h2 class="text-secondary">Contact The Azizi Firm</h2>
        <p>{{ detail.contactUsText }}</p>
      </div>
      <div class="text-block">
        <h3>Related Pages</h3>
        <div class="related-links">
          <NuxtLink v-for="link in detail.relatedLinks" :key="link.url" :to="link.url">{{ link.label }}</NuxtLink>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()
const route = useRoute()

const { data: detail } = await useAsyncData(`compare-${route.params.slug}`, () =>
  import(`~/data/comparePages/${route.params.slug}.json`).then(m => m.default || m)
)

if (!detail.value) throw createError({ statusCode: 404, statusMessage: 'Comparison page not found' })

const pageTitle = computed(() => `${detail.value.pageTitle} | The Azizi Firm`)

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
        { '@type': 'ListItem', 'position': 2, 'name': 'Comparisons', 'item': 'https://theazizifirm.com/compare' },
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
    .text-block { display: flex; flex-direction: column; gap: 4px; h3 { margin-bottom: 4px; } p { line-height: 1.6; } }
    .comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 1rem; }
    .comparison-card { border-radius: 8px; box-shadow: 0px 7px 29px 0px #64646f33; }
    .decision-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .decision-card { border-radius: 8px; }
    .table-wrap {
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        border: 1px solid #e5e7eb;
        padding: 12px;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: #f8f9fb;
      }
    }
    .verdict {
      padding: 16px;
      border-radius: 10px;
      background: #f8f9fb;
    }
    .related-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;

      a {
        font-size: 0.95rem;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
      }
    }
  }
}
</style>
