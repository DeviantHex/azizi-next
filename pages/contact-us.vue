<template>
  <VContainer class="contact-us">
    <h1 class="header">
      <i v-if="!smAndDown" class="icon-start" />
      CONTACT <span class="text-secondary">US</span>
      <i v-if="!smAndDown" class="icon-end" />
    </h1>
    <h4 class="subhead text-secondary">Start by typing your name below to get your free evaluation.</h4>
    <ContactForm />
    <div class="location">
      <h2 class="text-icon-end-short">Location</h2>
      <p>401 West A Street, Suite 1150 <br /> San Diego, CA 92101 <br /> T: <a href="tel:+18588293962" class="text-secondary">+1 858-829-3962</a></p>
    </div>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17342.551277631017!2d-117.17481306890667!3d32.71659420875595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d954a9521ae2a1%3A0x409d19085a3dd115!2s401%20W%20A%20St%20%231150%2C%20San%20Diego%2C%20CA%2092101!5e1!3m2!1sen!2sus!4v1726083441875!5m2!1sen!2sus" height="450" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="The Azizi Firm Office Location" />
  </VContainer>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()

const description = 'Contact The Azizi Firm for a free case evaluation. California employment law, personal injury, auto fraud, and lemon law. Call (858) 829-3962 or visit us at 401 West A Street, Suite 1150, San Diego, CA 92101.'

useSeoMeta({
  title: 'Contact The Azizi Firm | California Employment Lawyers',
  ogTitle: 'Contact The Azizi Firm | California Employment Lawyers',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/contact-us',
  twitterCard: 'summary',
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'url': 'https://theazizifirm.com/contact-us',
      'name': 'Contact The Azizi Firm',
      'description': description,
      'dateModified': formatIsoDate(CONTENT_LAST_UPDATED),
      'about': {
        '@id': 'https://theazizifirm.com/#organization'
      }
    })
  }]
})
</script>

<style scoped lang="scss">
.contact-us {
  display: flex; flex-direction: column; gap: 32px;
  .header, .subhead { display: flex; align-items: center; justify-content: center; gap: 5px; }
}
</style>
