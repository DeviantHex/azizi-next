<template>
  <VContainer class="hub-page">
    <div class="intro">
      <h1>California Practice Areas</h1>
      <PageMetaBar />
      <p>
        The Azizi Firm focuses primarily on California employment law and also represents clients in
        personal injury, lemon law, and auto fraud matters. Use this hub to move into the practice area
        that best matches your legal issue.
      </p>
    </div>

    <div class="cards">
      <NuxtLink v-for="item in practiceAreas" :key="item.href" :to="item.href" class="card">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </NuxtLink>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const description = 'Explore The Azizi Firm practice areas, including California employment law, personal injury, lemon law, and auto fraud.'

const practiceAreas = [
  {
    title: 'Employment Law',
    href: '/practice-areas/employment-law',
    description: 'Wrongful termination, discrimination, harassment, retaliation, wage disputes, and more.',
  },
  {
    title: 'Personal Injury',
    href: '/practice-areas/personal-injury',
    description: 'Serious injury claims including motor-vehicle collisions and wrongful death matters.',
  },
  {
    title: 'Lemon Law',
    href: '/practice-areas/lemon-law',
    description: 'Vehicle buyback, replacement, and warranty-defect claims under California law.',
  },
  {
    title: 'Auto Fraud',
    href: '/practice-areas/auto-fraud',
    description: 'Dealer misrepresentation, concealment, title issues, and consumer-vehicle disputes.',
  },
]

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
