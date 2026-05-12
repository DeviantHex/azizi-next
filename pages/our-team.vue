<template>
  <VContainer class="info-page" :class="{ 'px-6': smAndDown }">
    <img class="cover" :class="{ sticky: !smAndDown }" :style="{ height: smAndDown ? '300px' : '600px' }" :src="smAndDown ? portraitSm : portraitLg" alt="Attorney Amer Azizi - Founder of The Azizi Firm" />
    <div class="info">
      <div class="head" :class="{ 'text-center': smAndDown }">
        <h1 :class="{ 'text-icon-end-short': !smAndDown }">Amer Azizi</h1>
        <div class="subtext"><strong>Attorney &amp; Founder</strong></div>
      </div>
      <p>Amer Azizi, founder of The Azizi Firm, began his legal career at a prominent law firm, working alongside some of California's most skilled and respected attorneys. There, he advised major national insurance companies on defense strategies. Now, he leverages that experience and insider knowledge to fight for his clients.</p>
      <p>Mr. Azizi served as a judicial extern to Chief Judge Margaret M. Mann of the United States Bankruptcy Court, where he gained invaluable insight into judicial decision-making and had the opportunity to advise the judge on key cases. He also assisted Chief Judge Laura Taylor with cases before the Ninth Circuit Bankruptcy Appellate Panel, where he provided guidance on appellate matters and gained firsthand experience in appellate court proceedings. These roles gave him a comprehensive understanding of both trial and appellate strategies.</p>
      <p>He earned his undergraduate degree from the University of California, San Diego, graduating cum laude. He then attended the University of Florida Levin College of Law, one of the nation's leading law schools, where he distinguished himself as an editor for the Journal of Technology Law and Policy and earned a spot on the negotiation team, representing Florida in national competitions.</p>
      <p>Driven by his passion for representing individuals over corporations, Mr. Azizi founded The Azizi Firm. He is committed to fighting relentlessly for his clients, always available to support them when needed, and focused on achieving the best possible outcome for every case.</p>
      <h2 :class="{ 'text-icon-end-short': !smAndDown }">Education</h2>
      <ul>
        <li>University of Florida Levin College of Law (J.D., 2022)</li>
        <li>University of California, San Diego (B.A., cum laude, 2019)</li>
      </ul>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import portraitLg from '@/assets/images/amer-portrait2.jpg'
import portraitSm from '@/assets/images/amer-portrait-small.jpg'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()

const description = 'Meet Amer Azizi, founder of The Azizi Firm. California employment law attorney. Former insurance defense attorney now fighting for employment law, personal injury, auto fraud, and lemon law clients.'

useSeoMeta({
  title: 'Amer Azizi - California Employment Lawyer | The Azizi Firm',
  ogTitle: 'Amer Azizi - California Employment Lawyer | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'profile',
  ogUrl: 'https://theazizifirm.com/our-team',
  twitterCard: 'summary',
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          'name': 'Amer Azizi - Attorney Profile',
          'url': 'https://theazizifirm.com/our-team',
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
          'mainEntity': {
            '@id': 'https://theazizifirm.com/our-team#amer-azizi'
          }
        },
        {
          '@type': 'Person',
          '@id': 'https://theazizifirm.com/our-team#amer-azizi',
          'name': 'Amer Azizi',
          'url': 'https://theazizifirm.com/our-team',
          'image': 'https://theazizifirm.com/assets/images/amer-portrait2.jpg',
          'jobTitle': 'Attorney & Founder',
          'worksFor': {
            '@type': 'LegalService',
            'name': 'The Azizi Firm',
            'url': 'https://theazizifirm.com'
          },
          'alumniOf': [
            { '@type': 'CollegeOrUniversity', 'name': 'University of Florida Levin College of Law' },
            { '@type': 'CollegeOrUniversity', 'name': 'University of California, San Diego' }
          ],
          'description': 'Amer Azizi is the founder of The Azizi Firm in San Diego, California. He represents clients in personal injury, employment law, auto fraud, and lemon law cases. Before founding his firm, he represented major national insurance companies, giving him insider knowledge he now uses to fight for his clients.'
        }
      ]
    })
  }]
})
</script>

<style scoped lang="scss">
.info-page {
  display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;
  max-width: 1920px; margin: auto; align-items: center;
  .cover.sticky { position: sticky; top: calc(var(--v-layout-top) + 16px); margin-bottom: auto; }
  .info {
    max-width: 75ch; display: flex; flex-direction: column; gap: 20px; flex: 1 0 300px;
    .head { strong { color: #000; font-size: 0.9rem; } }
    ul { list-style-position: inside; }
  }
}
</style>
