<template>
  <VContainer class="hub-page">
    <div class="intro">
      <h1>California Legal FAQs</h1>
      <PageMetaBar />
      <p>
        Browse practical answers to common questions about California employment law, personal injury,
        auto fraud, and lemon law. Each guide is written to answer one core question clearly and give you
        a direct path to the next step.
      </p>
    </div>

    <div class="cards">
      <NuxtLink v-for="item in faqPageLinks" :key="item.href" :to="item.href" class="card">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </NuxtLink>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { faqPageLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const description = 'California legal FAQ hub from The Azizi Firm covering wrongful termination, workplace discrimination, wage and hour disputes, personal injury, lemon law, and auto fraud questions.'

useSeoMeta({
  title: 'California Legal FAQ Hub | The Azizi Firm',
  ogTitle: 'California Legal FAQ Hub | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/faq',
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
          'name': 'California Legal FAQs',
          'url': 'https://theazizifirm.com/faq',
          'description': description,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'FAQ', 'item': 'https://theazizifirm.com/faq' },
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
