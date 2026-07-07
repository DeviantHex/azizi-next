<template>
  <VForm class="form" ref="formEl" @submit.prevent="sendForm">
    <div class="column">
      <div class="field"><b>Name</b><VTextField v-model="name" name="name" autocomplete="name" aria-label="Name" :rules="[required]" /></div>
      <div class="field"><b>Phone</b><VTextField v-model="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" aria-label="Phone" :rules="[required, validatePhone]" /></div>
      <div class="field"><b>Email</b><VTextField v-model="email" name="email" type="email" inputmode="email" autocomplete="email" aria-label="Email" spellcheck="false" :rules="[required, validateEmail]" /></div>
    </div>
    <div class="column">
      <div class="field case-description"><b>Case Description</b><VTextarea v-model="caseDescription" name="caseDescription" autocomplete="off" aria-label="Case Description" hide-details="auto" rows="10" no-resize auto-grow /></div>
      <div class="row">
        <VueRecaptcha :sitekey="siteKey" ref="recaptchaRef" @verify="onVerify" @expire="onExpire" @fail="onExpire" />
        <VBtn color="secondary" type="submit" :loading="isSubmitting">Send</VBtn>
      </div>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { isValidNumber } from 'libphonenumber-js'
import VueRecaptcha from 'vue3-recaptcha2'
import pkg from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

const { createToast } = pkg

const config = useRuntimeConfig().public
const siteKey = config.recaptchaSiteKey

const name = ref('')
const phone = ref('')
const email = ref('')
const caseDescription = ref('')
const token = ref('')
const formEl = ref<any>(null)
const recaptchaRef = ref<any>(null)
const isSubmitting = ref(false)

const required = (v: string) => !!v || 'This field is required'
const validateEmail = (v: string) => /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(v) || 'Must be a valid email'
const validatePhone = (v: string) => isValidNumber(v, 'US') || 'Must be a valid phone number'

const onVerify = (response: string) => { token.value = response }
const onExpire = () => { token.value = '' }

const sendForm = async () => {
  if (isSubmitting.value) return

  const { valid } = await formEl.value.validate()
  if (!valid) return

  isSubmitting.value = true

  try {
    await $fetch('/api/form/send', {
      method: 'POST',
      body: { name: name.value, phone: phone.value, email: email.value, caseDescription: caseDescription.value, token: token.value },
    })
    await navigateTo('/thank-you')
  } catch {
    token.value = ''
    recaptchaRef.value?.reset()
    createToast('We could not submit your message. Please try again.', { type: 'danger', timeout: 4000, position: 'top-center' })
  } finally {
    isSubmitting.value = false
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