<template>
  <VContainer class="hub-page">
    <div class="intro">
      <h1>California Practice Areas</h1>
      <PageMetaBar />
      <p>
        The Azizi Firm represents California clients in employment, injury, lemon law, and auto fraud
        matters. Contact the firm for a free evaluation of your legal issue.
      </p>
    </div>

    <VBtn to="/contact-us" color="secondary" size="large">Request a Free Evaluation</VBtn>
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const description = 'Contact The Azizi Firm for California employment, injury, lemon law, and auto fraud matters. Free consultation. No fees unless we win.'

useSeoMeta({
  title: 'California Practice Areas | The Azizi Firm',
  ogTitle: 'California Practice Areas | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/practice-areas',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'California Practice Areas',
          'url': 'https://theazizifirm.com/practice-areas',
          'description': description,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Practice Areas', 'item': 'https://theazizifirm.com/practice-areas' },
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
