<template>
  <VContainer class="about-us">
    <h1 class="header">
      <i v-if="!smAndDown" class="icon-start" />
      ABOUT <span class="text-secondary">US</span>
      <i v-if="!smAndDown" class="icon-end" />
    </h1>
    <div class="header-img">
      <div class="background">
        <img class="logo" src="/assets/images/banner-logo.svg" alt="The Azizi Firm Logo" />
      </div>
    </div>
    <p>The Azizi Firm is dedicated to providing exceptional legal representation across California. We guide and support our clients through every step of the legal process, working tirelessly to make it as stress-free as possible while fighting for your rights.</p>
    <p>Amer Azizi founded The Azizi Firm to offer the strong legal representation clients deserve. With a strategic approach and deep legal insight, he leverages his experience from defending some of the nation's largest insurance companies to effectively fight for his clients. This insider knowledge gives him a unique edge in anticipating opposing counsel's strategies and achieving favorable outcomes.</p>
    <p>If you're facing a legal issue and need a committed attorney, The Azizi Firm is here to help. Contact us today for a free, confidential consultation. We are ready to fight for your rights and help you secure the justice and compensation you deserve.</p>
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()

const description = 'Learn about The Azizi Firm - a California employment law firm dedicated to employment law, personal injury, auto fraud, and lemon law. Founded by Amer Azizi, formerly an insurance defense attorney.'

useSeoMeta({
  title: 'About Our California Employment Law Firm | The Azizi Firm',
  ogTitle: 'About Our California Employment Law Firm | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/about',
  twitterCard: 'summary',
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About The Azizi Firm',
      'url': 'https://theazizifirm.com/about',
      'description': description,
      'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
      'about': {
        '@id': 'https://theazizifirm.com/#organization'
      },
      'mainEntity': {
        '@type': 'LegalService',
        'name': 'The Azizi Firm',
        'areaServed': 'California'
      }
    })
  }]
})
</script>

<style scoped lang="scss">
.about-us {
  display: flex; flex-direction: column; gap: 16px;
  .header { display: flex; align-items: center; justify-content: center; gap: 5px; }
  .header-img {
    margin-top: 24px; height: 300px; border-radius: 8px;
    box-shadow: 0px 7px 29px 0px #64646f33; padding: 12px;
    .background {
      border-radius: 8px; width: 100%; height: 100%;
      background: #34485c; display: flex;
      .logo { margin: auto; height: 75%; max-width: 90%; }
    }
  }
}
</style>
