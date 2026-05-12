<template>
  <VForm class="form" ref="formEl" @submit.prevent="sendForm">
    <div class="column">
      <div class="field"><b>Name</b><VTextField v-model="name" :rules="[required]" /></div>
      <div class="field"><b>Phone</b><VTextField v-model="phone" :rules="[required, validatePhone]" /></div>
      <div class="field"><b>Email</b><VTextField v-model="email" :rules="[required, validateEmail]" /></div>
    </div>
    <div class="column">
      <div class="field case-description"><b>Case Description</b><VTextarea v-model="caseDescription" hide-details="auto" rows="10" no-resize auto-grow /></div>
      <div class="row">
        <VueRecaptcha :sitekey="siteKey" ref="recaptchaRef" @verify="onVerify" @expire="onExpire" @fail="onExpire" />
        <VBtn color="secondary" type="submit">Send</VBtn>
      </div>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { isValidNumber } from 'libphonenumber-js'
import VueRecaptcha from 'vue3-recaptcha2'

const config = useRuntimeConfig().public
const siteKey = config.recaptchaSiteKey

const name = ref('')
const phone = ref('')
const email = ref('')
const caseDescription = ref('')
const token = ref('')
const formEl = ref<any>(null)
const recaptchaRef = ref<any>(null)

const required = (v: string) => !!v || 'This field is required'
const validateEmail = (v: string) => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(v) || 'Must be a valid email'
const validatePhone = (v: string) => isValidNumber(v, 'US') || 'Must be a valid phone number'

const onVerify = (response: string) => { token.value = response }
const onExpire = () => { token.value = '' }

const sendForm = async () => {
  if (!token.value) {
    const { createAlert } = await import('mosha-vue-toastify')
    createAlert('Please complete the reCAPTCHA', { type: 'danger', timeout: 2000, position: 'top-center' })
    return
  }

  try {
    await $fetch('/api/form/send', {
      method: 'POST',
      body: { name: name.value, phone: phone.value, email: email.value, caseDescription: caseDescription.value, token: token.value },
    })
    const { createAlert } = await import('mosha-vue-toastify')
    createAlert('Contact form submitted', { type: 'success', timeout: 2000, position: 'top-center' })
    formEl.value?.reset()
    navigateTo('/thank-you')
  } catch {
    token.value = ''
    recaptchaRef.value?.reset()
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex; flex-wrap: wrap; gap: 16px; text-align: left;
  .row { display: flex; gap: 16px; align-items: center; justify-content: flex-end; flex-wrap: wrap; }
  .column {
    min-width: 300px; display: flex; flex-direction: column; gap: 16px; flex: 1; justify-content: flex-start;
    .field { display: flex; flex-direction: column; gap: 8px; }
  }
}
</style>
