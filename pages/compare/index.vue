<template>
  <VContainer class="hub-page">
    <div class="intro">
      <h1>California Legal Comparisons</h1>
      <PageMetaBar />
      <p>
        The Azizi Firm focuses on practical guidance for California employment, injury, and consumer-law matters.
        Use the practice-area and FAQ sections to find the resource that best matches your situation.
      </p>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const description = 'California legal resources from The Azizi Firm covering employment law, personal injury, auto fraud, lemon law, and related FAQs.'

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
}
</style>
