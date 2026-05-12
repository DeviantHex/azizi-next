<template>
  <VContainer class="hub-page">
    <div class="intro">
      <h1>California Legal Comparisons</h1>
      <PageMetaBar />
      <p>
        Compare common California employment, injury, and consumer-law scenarios side by side.
        These guides are built to help readers understand which legal framework fits their facts,
        where claims overlap, and when legal advice can change the outcome.
      </p>
    </div>

    <div class="cards">
      <NuxtLink v-for="item in comparePageLinks" :key="item.href" :to="item.href" class="card">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </NuxtLink>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { comparePageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const description = 'California comparison guides from The Azizi Firm covering wrongful termination, workplace discrimination, trial versus settlement, exempt versus non-exempt status, and other key legal choices.'

useSeoMeta({
  title: 'California Legal Comparison Guides | The Azizi Firm',
  ogTitle: 'California Legal Comparison Guides | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/compare',
  twitterCard: 'summary_large_image',
  robots: 'noindex, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'California Legal Comparisons',
          'url': 'https://theazizifirm.com/compare',
          'description': description,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Comparisons', 'item': 'https://theazizifirm.com/compare' },
          ],
        },
      ],
    }),
  }],
})
</script>

<style scoped lang="scss">
.hub-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .intro {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 75ch;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;

    p {
      color: #5c6670;
    }
  }
}
</style>
