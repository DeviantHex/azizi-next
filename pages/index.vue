<template>
  <div class="homepage">
    <div class="banner" v-if="smAndDown">
      <img class="banner-img" src="/assets/images/home-banner.jpg" width="100%" alt="The Azizi Firm - California Employment Law Firm" />
      <img class="logo" src="/assets/images/banner-logo.svg" alt="The Azizi Firm Logo" />
    </div>
    <div v-else class="banner-desktop">
      <VImg class="banner-img" src="/assets/images/home-banner-desktop.jpg" width="100%" alt="The Azizi Firm - California Employment Law Firm Office">
        <div class="content">
          <img class="logo" src="/assets/images/banner-logo.svg" width="300" alt="The Azizi Firm Logo" />
          <p>Your Success is our Priority</p>
          <div class="text-center header-text">
            <i class="icon-before" />
            <div>
              <h1>Get a <span>Free</span> Case Evaluation by an Actual Attorney<br /></h1>
              <h1>No Fees Until We Win!</h1>
            </div>
            <i class="icon-after" />
          </div>
          <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Get a Free Evaluation</VBtn>
        </div>
      </VImg>
    </div>
    <VContainer>
      <div class="cta-header" v-if="smAndDown">
        <h4>Your Success is our Priority</h4>
        <div>
          <div class="text-center header-text">
              <h1>Get a <span>Free</span> Case Evaluation by an Actual Attorney<br /></h1>
              <h1 class="mt-5">No Fees Until We <span>Win!</span></h1>
          </div>
        </div>
        <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Get a Free Evaluation</VBtn>
      </div>
      <div class="top-section"><h2><i v-if="!smAndDown" class="icon-start" />WHAT WE <span>DO</span><i v-if="!smAndDown" class="icon-end" /></h2></div>
      <div class="section">
        <div>
          <h3>Our <span>Focus</span></h3>
          <p>We are committed to delivering exceptional legal representation with a strong emphasis on client service. Our experienced team focuses on achieving the best outcomes through detailed analysis and strategic actions tailored to each client's unique needs. With a proven record of success, we have earned a reputation for excellence. Relentless in our pursuit of justice, we will work tirelessly to protect your rights and maximize your recovery. Your success is our priority, and we strive to ensure the best possible results in every case we handle.</p>
        </div>
        <div>
          <h3>You Pay <span>Nothing</span></h3>
          <p>We typically work on a contingency fee basis, meaning you don't pay anything unless we secure a favorable verdict or settlement for your case. Under a contingency fee basis, our fee is a percentage of the compensation you receive, so there are no upfront costs or hourly rates. This allows you to pursue your case without financial risk. You only pay when we win, ensuring you can focus on your case without the stress of costs or financial burdens. With us, there are no fees unless we succeed.</p>
        </div>
      </div>
      <div class="cta-box">
        <div class="content">
          <div class="left"><h3>Call Us</h3><h4><a class="text-secondary" href="tel:+18588293962">+1 858-829-3962</a></h4></div>
          <VDivider color="secondary" opacity="100" thickness="2" :vertical="!smAndDown" />
          <div class="right"><h3>Email</h3><h4><a class="text-secondary" href="mailto:aa@theazizifirm.com">aa@theazizifirm.com</a></h4></div>
        </div>
      </div>
      <div class="practice-areas">
        <div class="content">
          <h2><i v-if="!smAndDown" class="icon-start" />PRACTICE <span>AREAS</span><i v-if="!smAndDown" class="icon-end" /></h2>
          <VCarousel v-if="smAndDown" height="auto" :show-arrows="false" continuous cycle interval="4000">
            <VCarouselItem v-for="area in carouselImages" :key="area.src" :src="area.src" :alt="area.alt" @click="navigateTo(area.path)" style="cursor:pointer" />
          </VCarousel>
          <div v-else class="image-group">
            <div class="image-row">
              <NuxtLink v-for="area in carouselImages.slice(0,3)" :key="area.src" :to="area.path"><img :src="area.src" :alt="area.alt" /></NuxtLink>
            </div>
            <div class="image-row">
              <NuxtLink v-for="area in carouselImages.slice(3)" :key="area.src" :to="area.path"><img :src="area.src" :alt="area.alt" /></NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div class="bio-section">
        <h2><i v-if="!smAndDown" class="icon-start" /><span>ATTORNEY</span> AMER AZIZI<i v-if="!smAndDown" class="icon-end" /></h2>
        <VCard rounded="lg">
          <div class="content">
            <div class="image"><img src="@/assets/images/amer-portrait.jpg" alt="Attorney Amer Azizi - Founder of The Azizi Firm" /></div>
            <div class="text">
              <h3 class="text-icon-end-short">AMER <span>AZIZI</span></h3>
              <p>"I founded The Azizi Firm with one goal: achieving exceptional results for my clients. I am dedicated to handling your case with the focus and diligence needed to secure the best outcome and maximize your recovery. Before founding The Azizi Firm, I represented some of the largest insurance companies in the nation, gaining valuable insight into how they evaluate cases. Now, I use this insider knowledge to fight for you."</p>
              <p>Attorney Azizi combines legal expertise with a client-focused approach, ensuring exceptional service and making himself readily available to his clients. With experience across various areas of law, he has successfully handled and resolved complex cases, consistently delivering strong results.</p>
            </div>
          </div>
        </VCard>
        <VBtn class="cta-btn" color="secondary" size="x-large" density="comfortable" @click="scrollToContactForm">Get a Free Evaluation</VBtn>
      </div>
      <div class="services">
        <div class="content">
          <h2><i v-if="!smAndDown" class="icon-start" />WE ARE IN <span>SERVICE</span> TO OUR CLIENTS<i v-if="!smAndDown" class="icon-end" /></h2>
          <p>The Azizi Firm serves clients throughout California in employment law, personal injury, auto fraud, and lemon law cases. We are dedicated to serving you and delivering exceptional results.</p>
          <div class="flash-cards">
            <div v-for="(card, i) in flashCards" :key="i" class="flash-card">
              <i class="icon" :class="{ secondary: i % 2 !== 0 }" v-html="logoIcon" />
              <h4>{{ card }}</h4>
            </div>
          </div>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import logoIcon from '@/assets/images/azizi-A.svg?raw'

const route = useRoute()

const description = 'California employment law firm. Wrongful termination, discrimination, harassment, retaliation & wage disputes. Free consultation. Serving all California. No fees unless we win. Call (858) 829-3962.'

useSeoMeta({
  title: 'The Azizi Firm | California Employment Law Firm',
  ogTitle: 'The Azizi Firm | California Employment Law Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com',
  ogSiteName: 'The Azizi Firm',
  twitterCard: 'summary_large_image',
  twitterTitle: 'The Azizi Firm | California Employment Law Firm',
  twitterDescription: description,
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          'name': 'Amer Azizi',
          'url': 'https://theazizifirm.com/our-team',
          'image': 'https://theazizifirm.com/assets/images/amer-portrait.jpg',
          'jobTitle': 'Attorney & Founder',
          'worksFor': {
            '@type': 'LegalService',
            'name': 'The Azizi Firm',
            'url': 'https://theazizifirm.com'
          },
          'alumniOf': [
            {
              '@type': 'CollegeOrUniversity',
              'name': 'University of Florida Levin College of Law'
            },
            {
              '@type': 'CollegeOrUniversity',
              'name': 'University of California, San Diego'
            }
          ],
          'description': 'Amer Azizi is the founder of The Azizi Firm, a California employment law firm handling wrongful termination, workplace discrimination, harassment, retaliation, and wage disputes. Also handling personal injury, automobile accidents, wrongful death, auto fraud, and lemon law cases statewide.'
        }
      ]
    })
  }]
})

const { smAndDown } = useDisplay()

const flashCards = ['We Fight For You', 'No Fees Unless We Win', 'Your Success Is Our Priority', 'Exceptional Results']

const carouselImages = [
  { src: '/assets/images/homepage-carousel/employment-law.png', alt: 'California Employment Law Practice Area', path: '/contact-us' },
  { src: '/assets/images/homepage-carousel/personal-injury.png', alt: 'Personal Injury Law Practice Area', path: '/contact-us' },
  { src: '/assets/images/homepage-carousel/auto-accidents.png', alt: 'Auto Accident Law Practice Area', path: '/contact-us' },
  { src: '/assets/images/homepage-carousel/wrongful-death.png', alt: 'Wrongful Death Law Practice Area', path: '/contact-us' },
  { src: '/assets/images/homepage-carousel/lemon-law.png', alt: 'Lemon Law Practice Area', path: '/contact-us' },
  { src: '/assets/images/homepage-carousel/auto-fraud.png', alt: 'Auto Fraud Law Practice Area', path: '/contact-us' },
]

const scrollToContactForm = () => document.getElementById('contact-box')?.scrollIntoView({ behavior: 'smooth' })
</script>

<style scoped lang="scss">
.homepage {
  --shadow: 0 0 10px #000000;
  .logo { filter: drop-shadow(var(--shadow)); }
  .banner { position: relative; .logo { position: absolute; z-index: 1000; top: 50%; left: 50%; transform: translate(-50%, -50%); } }
  .banner-desktop {
    margin-top: calc(-1 * var(--v-layout-top) + 64px);
    h1, p { color: #fff; }
    .content {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: 100%; gap: 8px; text-shadow: var(--shadow);
      h1 { font-size: 2rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
      h2 { color: #fff; font-size: 1.8rem; }
    }
  }
  .cta-header { display: flex; flex-direction: column; gap: 2rem; align-items: center; }
  .top-section { margin-top: 3rem; }
  h2 { text-align: center; margin-bottom: 1rem; }
  .section {
    display: flex; flex-wrap: wrap; gap: 2rem; text-align: center; margin-top: 1.5rem;
    div { flex: 1 1 300px; h3 { margin-bottom: 0.8rem; } }
  }
  .cta-box {
    margin-top: 1.5rem; text-align: center;
    .content {
      background: rgb(var(--v-theme-primary)); display: flex; flex-wrap: wrap; justify-content: center; border-radius: 8px;
      h3 { color: #fff; } h4 { color: rgb(var(--v-theme-secondary)); }
      .left, .right { margin: 22px auto; }
    }
  }
  .practice-areas {
    .content { padding: 3rem 0; h2 { margin-bottom: 2rem; }
      .image-group {
        .image-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; a { width: min(300px, 32.33%); img { width: 100%; } } }
      }
    }
  }
  .bio-section {
    h2 { margin: 1.5rem 0; } h3 { font-size: 1.3rem; margin-bottom: 0.6rem; }
    p { margin-bottom: 1rem; line-height: 1.3rem; font-weight: 450; }
    .cta-btn { margin: 1.5rem auto; display: block; }
    .content { display: flex; flex-wrap: wrap;
      .image { overflow: hidden; display: flex; align-items: center; justify-content: center; img { height: 100%; max-height: 375px; } }
      .text { padding: 16px; flex: 1; display: flex; flex-direction: column; }
    }
  }
  .services {
    text-align: center; margin-top: 2rem;
    .content { padding: 2rem 0;
      .flash-cards {
        flex-wrap: wrap; gap: 1rem; margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        .flash-card {
          flex: 1 1 250px; display: flex; position: relative; align-items: center; justify-content: center;
          height: 300px; background: #fff; box-shadow: 0px 7px 29px 0px #64646f33; border-radius: 10px; padding: 2rem;
          .icon { position: absolute; top: 15px; right: 15px; &.secondary :deep(path) { fill: rgb(var(--v-theme-secondary)); } }
          h4 { font-size: 1.3rem; }
        }
      }
    }
  }
}
</style>
