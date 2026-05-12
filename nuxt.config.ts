export default defineNuxtConfig({
  ssr: true,

  modules: ['vuetify-nuxt-module', '@nuxtjs/sitemap'],

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '22',
      serverFunctionName: 'api',
      httpsOptions: {
        region: 'us-central1',
        memory: '512MiB',
        timeoutSeconds: 60,
      },
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  css: [
    'vuetify/styles',
    'mosha-vue-toastify/dist/style.css',
    '@/assets/scss/theme.scss'
  ],

  runtimeConfig: {
    recaptchaSecretKey: '',
    passkey: '',
    public: {
      firebaseApiKey: 'AIzaSyC_k6hmfJAvZhhLGTQ3FTjZkHyMNX0NMaY',
      firebaseAuthDomain: 'azizifirm-b9e16.firebaseapp.com',
      firebaseProjectId: 'azizifirm-b9e16',
      firebaseStorageBucket: 'azizifirm-b9e16.appspot.com',
      firebaseMessagingSenderId: '574894043585',
      firebaseAppId: '1:574894043585:web:923228438f5628ff4bbf40',
      firebaseMeasurementId: 'G-FB3JLS3MGV',
      recaptchaSiteKey: '6LeHA0IqAAAAAN7KmjHbfhrLRqPaCmYGaouYbtvA',
    },
  },

  site: {
    url: 'https://theazizifirm.com',
    name: 'The Azizi Firm',
    description: 'California employment law firm. Wrongful termination, discrimination, harassment, retaliation & wage disputes. Free consultation. Serving all California. No fees unless we win.',
    defaultLocale: 'en',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin', '/login', '/thank-you'],
  },

  app: {
    head: {
      title: 'The Azizi Firm | California Employment Law Firm',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'California employment law firm. Wrongful termination, discrimination, harassment, retaliation & wage disputes. Free consultation. Serving all of California. No fees unless we win. Call (858) 829-3962.' },
        { property: 'og:title', content: 'The Azizi Firm | California Employment Law Firm' },
        { property: 'og:description', content: 'California employment law firm. Wrongful termination, discrimination, harassment, retaliation & wage disputes. Free consultation. Serving all of California. No fees unless we win.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://theazizifirm.com' },
        { property: 'og:site_name', content: 'The Azizi Firm' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'The Azizi Firm | California Employment Law Firm' },
        { name: 'twitter:description', content: 'California employment law firm. Wrongful termination, discrimination, harassment, retaliation & wage disputes. Free consultation. No fees unless we win.' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/assets/images/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/images/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/images/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/images/apple-touch-icon.png' },
        { rel: 'manifest', href: '/assets/images/site.webmanifest' },
      ],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31556926; includeSubDomains',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://securetoken.googleapis.com; frame-src https://www.google.com/recaptcha/ https://www.googletagmanager.com https://www.google.com/maps/ https://maps.googleapis.com; object-src 'none'",
      },
    },
  },

  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      theme: {
        defaultTheme: 'lightTheme',
        themes: {
          lightTheme: {
            dark: false,
            colors: {
              primary: '#34485C',
              secondary: '#CDB083',
              'on-secondary': '#fff',
              'on-surface': '#34485C',
              'on-background': '#34485C',
            },
          },
        },
      },
      icons: {
        defaultSet: 'mdi-svg',
      },
      defaults: {
        global: { hideDetails: 'auto' },
        VTextField: { color: 'primary', variant: 'solo', bgColor: '#eee', flat: true },
        VSelect: { color: 'primary', variant: 'solo', bgColor: '#eee', flat: true },
        VTextarea: { color: 'primary', variant: 'solo', bgColor: '#eee', flat: true },
        VFileInput: { color: 'primary', variant: 'solo', bgColor: '#eee', flat: true },
        VCheckbox: { color: 'primary' },
        VSwitch: { color: 'primary' },
        VBtn: { color: 'primary', style: 'text-transform: none;' },
        VCard: { rounded: 'xl' },
      },
    },
  },

  compatibilityDate: '2025-04-01',
})
