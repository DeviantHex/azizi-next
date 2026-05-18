<template>
  <VApp>
    <VAppBar elevation="0" color="secondary">
      <div class="top-cta">
        <b>Get a Free Evaluation Today!</b>
        <a href="tel:+18588293962"><VIcon :icon="mdiPhone" />+1 858-829-3962</a>
      </div>
    </VAppBar>
    <VAppBar
      :elevation="isHome ? 0 : undefined"
      height="80"
      :color="smAndDown || !isHome ? '#fff' : 'transparent'"
      :absolute="isHome && !smAndDown"
      scroll-behavior="elevate"
    >
      <VContainer class="header">
        <div class="logo-container">
          <img
            v-if="smAndDown || !isHome"
            class="logo"
            alt="The Azizi Firm Logo"
            src="/assets/images/header-logo.svg"
            @click="navigateTo('/')"
          />
          <img
            v-else
            class="logo"
            alt="The Azizi Firm Logo"
            src="/assets/images/logo-white.svg"
            @click="navigateTo('/')"
          />
        </div>

        <div v-if="!smAndDown" class="nav-btns">
          <VBtn
            v-for="r in navRoutes"
            :key="r.path || r.name"
            :color="isHome ? 'white' : ''"
            :append-icon="r.children ? mdiChevronDown : undefined"
            @click="r.path ? navigateTo(r.path) : undefined"
          >
            {{ r.name }}
            <VMenu
              v-if="r.children"
              activator="parent"
              location="bottom center"
              scroll-strategy="close"
            >
              <VBtn
                v-for="child in r.children"
                :key="child.path"
                :color="isHome ? 'white' : ''"
                :variant="isHome ? 'text' : 'elevated'"
                :rounded="false"
                @click="navigateTo(child.path)"
              >
                {{ child.name }}
              </VBtn>
            </VMenu>
          </VBtn>
          <VBtn v-if="user" :color="isHome ? 'white' : ''" @click="navigateTo('/admin')">Admin</VBtn>
          <VBtn v-if="user" :color="isHome ? 'white' : ''" variant="outlined" @click="logout">Logout</VBtn>
        </div>

        <div class="cta-btn-container">
          <VBtn
            v-if="!smAndDown"
            class="cta-btn"
            color="secondary"
            size="large"
            variant="elevated"
            href="tel:+18588293962"
            :prepend-icon="mdiPhone"
          >
            +1 858-829-3962
          </VBtn>
          <div v-else class="mobile-btns">
            <VBtn :icon="mdiPhone" variant="outlined" size="small" href="tel:+18588293962" />
            <VBtn
              icon
              :variant="navOpen ? 'outlined' : undefined"
              size="small"
              @click="navOpen = !navOpen"
            >
              <VIcon v-if="navOpen" :icon="mdiClose" />
              <div v-else v-html="MenuIcon"></div>
            </VBtn>
          </div>
        </div>
      </VContainer>
    </VAppBar>

    <VNavigationDrawer v-if="smAndDown" v-model="navOpen" sticky location="top">
      <VList>
        <VWindow v-model="mobileNavTab">
          <VWindowItem>
            <VListItem
              v-for="r in navRoutes"
              :key="r.path || r.name"
              :append-icon="r.children ? mdiChevronRight : undefined"
              @click="r.children ? (mobileNavTab = 1) : (r.path && navigateTo(r.path))"
            >
              {{ r.name }}
            </VListItem>
            <VListItem v-if="user" @click="navOpen = false; navigateTo('/admin')">Admin</VListItem>
            <VListItem v-if="user" @click="navOpen = false; logout()">Logout</VListItem>
          </VWindowItem>
          <VWindowItem>
            <VListItem
              v-for="(area, i) in practiceAreas"
              :key="area.path"
              :append-icon="mdiChevronRight"
              @click="selectedPracticeAreaIndex = i; mobileNavTab = 2"
            >
              {{ area.name }}
            </VListItem>
          </VWindowItem>
          <VWindowItem>
            <VListItem
              v-for="(subName, i) in selectedPracticeArea.subNames"
              :key="i"
              :active="false"
              @click="navOpen = false; navigateTo(selectedPracticeArea.path)"
            >
              {{ subName }}
            </VListItem>
          </VWindowItem>
        </VWindow>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <NuxtPage />
    </VMain>

    <VContainer
      v-if="showSiteCta"
      class="contact-box"
      id="contact-box"
    >
      <div class="text">
        <h2>SCHEDULE YOUR <span>FREE EVALUATION</span> TODAY!</h2>
        <p>Don't settle for less than you deserve. Reach out to us for a free, confidential evaluation with no risk, and let us help you achieve the best possible outcome in your case.</p>
        <p>You can contact us online by filling out form below, or call us at <a href="tel:+18588293962" class="text-secondary">+1 858-829-3962</a></p>
        <p class="text-secondary">Start by typing your name below to get your free evaluation.</p>
      </div>
      <ContactForm />
    </VContainer>

    <div v-if="showSiteCta" class="cta-box">
      <div class="content">
        <div class="left">
          <h3>Call Us</h3>
          <h4><a class="text-secondary" href="tel:+18588293962">+1 858-829-3962</a></h4>
        </div>
        <VDivider color="secondary" opacity="100" thickness="2" :vertical="!smAndDown" />
        <div class="right">
          <h3>Email</h3>
          <h4><a class="text-secondary" href="mailto:aa@theazizifirm.com">aa@theazizifirm.com</a></h4>
        </div>
      </div>
    </div>

    <VFooter>
      <VContainer class="footer">
        <strong>Schedule a Free Case Evaluation: <span style="white-space: nowrap">Call <a class="text-secondary" href="tel:+18588293962">+1 858-829-3962</a></span></strong>
        <VDivider thickness="3" />
        <div class="bottom-section">
          <div class="legals">
            <strong>&copy; 2024 - {{ new Date().getFullYear() }} The Azizi Firm. All rights reserved.</strong>
            <div class="links">
              <NuxtLink :to="{ name: 'privacy-policy' }" class="text-secondary">Privacy Policy</NuxtLink>
            </div>
          </div>
          <img v-if="!smAndDown" alt="The Azizi Firm Logo" class="logo" src="/assets/images/header-logo.svg" />
        </div>
      </VContainer>
    </VFooter>
    <CookieConsent />
  </VApp>
</template>

<script setup lang="ts">

import MenuIcon from '~/assets/images/menu-icon.svg?raw'
import { mdiChevronDown, mdiChevronRight, mdiClose, mdiPhone } from '@mdi/js'
import { CONTACT_EMAIL, GOOGLE_BUSINESS_PROFILE_URL, OFFICE_ADDRESS, PHONE_NUMBER, toAbsoluteUrl } from '~/utils/seo'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const route = useRoute()
const { user, logout } = useAuth()

const navOpen = ref(false)
const mobileNavTab = ref(0)
const selectedPracticeAreaIndex = ref(0)
const isHome = computed(() => route?.name === 'index' || route?.name === 'home')
const showSiteCta = computed(() => !['admin', 'contact-us', 'login'].includes(String(route?.name)))
const selectedPracticeArea = computed(() => practiceAreas[selectedPracticeAreaIndex.value])

watch(navOpen, () => { mobileNavTab.value = 0 })

const practiceAreas = [
  { name: 'Employment Law', path: '/contact-us', subNames: ['WRONGFUL TERMINATION','WHISTLEBLOWER CASES','WORKPLACE RETALIATION','HOSTILE WORK ENVIRONMENT','PREGNANCY DISCRIMINATION','RACIAL DISCRIMINATION','SEXUAL ORIENTATION DISCRIMINATION','WAGE AND HOUR DISPUTES','SEXUAL HARASSMENT','HARASSMENT','RETALIATION'] },
  { name: 'Personal Injury', path: '/contact-us', subNames: ['CAR ACCIDENTS','TRUCK ACCIDENTS','MOTORCYCLE ACCIDENTS','RIDESHARE ACCIDENTS','BRAIN INJURIES','BOAT ACCIDENTS','PEDESTRIAN ACCIDENTS','WRONGFUL DEATH','SLIP AND FALLS','DOG BITES','ELECTRIC SCOOTER ACCIDENTS','ELECTRIC BIKE ACCIDENTS'] },
  { name: 'Auto Fraud', path: '/contact-us', subNames: ['ODOMETER FRAUD','TITLE WASHING','NON-DISCLOSURE OF SALVAGE','BAIT AND SWITCH','FINANCING FRAUD','LEMON LAUNDERING','MISREPRESENTATION OF VEHICLE CONDITION'] },
  { name: 'Lemon Law', path: '/contact-us', subNames: ['REPEATED MECHANICAL ISSUES','SAFETY DEFECTS','SIGNIFICANT NON-CONFORMITY',"UNDER MANUFACTURER'S WARRANTY",'CERTIFIED PRE-OWNED VEHICLES','NEWLY LEASED VEHICLES','LIGHT-DUTY TRUCKS AND VANS','AIRBAG MALFUNCTIONS','HEATING AND AIR CONDITIONING PROBLEMS'] },
]

const navRoutes = [
  { name: 'Home', path: '/' },
  { name: 'Practice Areas', children: practiceAreas },
  { name: 'About', path: '/about' },
  { name: 'Our Team', path: '/our-team' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Contact', path: '/contact-us' },
]

const canonicalUrl = computed(() => {
  let path = route.path
  if (route.name === 'index') path = '/'
  return toAbsoluteUrl(path)
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://theazizifirm.com/#organization',
            'name': 'The Azizi Firm',
            'url': 'https://theazizifirm.com',
            'logo': toAbsoluteUrl('/assets/images/header-logo.svg'),
            'sameAs': [GOOGLE_BUSINESS_PROFILE_URL],
            'telephone': PHONE_NUMBER,
            'email': CONTACT_EMAIL,
            'address': {
              '@type': 'PostalAddress',
              ...OFFICE_ADDRESS,
            },
            'contactPoint': [
              {
                '@type': 'ContactPoint',
                'contactType': 'customer support',
                'telephone': PHONE_NUMBER,
                'email': CONTACT_EMAIL,
                'areaServed': 'US',
                'availableLanguage': ['English'],
              }
            ]
          },
          {
            '@type': 'LegalService',
            '@id': 'https://theazizifirm.com/#legal-service',
            'name': 'The Azizi Firm',
            'url': 'https://theazizifirm.com',
            'telephone': PHONE_NUMBER,
            'email': CONTACT_EMAIL,
            'priceRange': 'No fee unless we win',
            'address': {
              '@type': 'PostalAddress',
              ...OFFICE_ADDRESS,
            },
            'areaServed': {
              '@type': 'State',
              'name': 'California'
            },
            'hasMap': 'https://maps.google.com/maps?q=401+West+A+Street+Suite+1150+San+Diego+CA+92101',
            'openingHoursSpecification': [
              {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'opens': '09:00',
                'closes': '17:00'
              }
            ],
            'image': toAbsoluteUrl('/assets/images/header-logo.svg'),
            'description': 'California employment law firm. We handle wrongful termination, workplace discrimination, harassment, retaliation, and wage disputes. Also handling personal injury, automobile accidents, wrongful death, auto fraud, and lemon law cases statewide. Free case evaluation. No fees until we win.',
            'foundingDate': '2024',
            'founder': {
              '@type': 'Person',
              'name': 'Amer Azizi',
              'url': 'https://theazizifirm.com/our-team'
            },
            'parentOrganization': {
              '@id': 'https://theazizifirm.com/#organization'
            }
          },
          {
            '@type': 'WebSite',
            '@id': 'https://theazizifirm.com/#website',
            'url': 'https://theazizifirm.com',
            'name': 'The Azizi Firm',
            'description': 'California employment law firm handling wrongful termination, discrimination, harassment, retaliation, wage disputes, personal injury, auto fraud, and lemon law cases.',
            'publisher': { '@id': 'https://theazizifirm.com/#organization' },
            'inLanguage': 'en-US'
          },
          {
            '@type': 'BreadcrumbList',
            '@id': 'https://theazizifirm.com/#breadcrumb',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' }
            ]
          }
        ]
      })
    }
  ]
})
</script>

<style scoped lang="scss">
.top-cta {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.v-list-item { font-weight: 450; }
.header {
  display: flex;
  padding: 16px 4px;
  width: 100%;
  align-items: center;
  .logo-container { flex: 1; .logo { width: 120px; cursor: pointer; } }
  .nav-btns {
    margin: auto;
    display: flex;
    gap: 4px;
  }
  .cta-btn-container {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .mobile-btns { display: flex; gap: 4px; }
  }
}
.contact-box {
  margin-top: 2rem;
  text-align: center;
  .text {
    max-width: 75ch;
    margin: auto;
    p { margin-bottom: 1rem; }
    .text-secondary { font-weight: 500; }
  }
}
.cta-box {
  margin-top: 1.5rem;
  text-align: center;
  .content {
    background: rgb(var(--v-theme-primary));
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    h3 { color: #fff; }
    h4 { color: rgb(var(--v-theme-secondary)); }
    .left, .right { margin: 22px auto; }
  }
}
.footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  .bottom-section {
    display: flex;
    justify-content: space-between;
      .legals {
        .links { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; }
      }
    }
  }

</style>
