<template>
  <div v-if="showBanner" class="cookie-banner">
    <p>We use cookies to enhance your experience. By accepting, you agree to our cookie policy.</p>
    <VBtn @click="acceptCookies" color="secondary" size="large" variant="elevated">Accept</VBtn>
  </div>
</template>

<script setup lang="ts">
const cookieConsent = useCookie('cookieConsent')
const showBanner = ref(!cookieConsent.value)

const acceptCookies = () => {
  cookieConsent.value = 'true'
  showBanner.value = false
}
</script>

<style>
.cookie-banner {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>
