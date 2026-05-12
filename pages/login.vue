<template>
  <VApp>
    <div class="login-page">
      <VForm class="login-form" validate-on="blur" @submit.prevent="onLogin">
        <VSheet class="login-card" :elevation="10" rounded="xl">
          <h1>Login</h1>
          <span class="welcome-text">Welcome back!</span>
          <div class="fields">
            <p>Username/Email</p>
            <VTextField v-model="email" type="email" :rules="[required]" rounded="lg" required />
            <p>Password</p>
            <VTextField v-model="password" type="password" :rules="[required]" rounded="lg" required />
          </div>
        </VSheet>
        <VSheet class="login-btn-sheet">
          <VBtn class="login-btn" size="large" type="submit" rounded="lg" variant="outlined" color="grey" :loading="submitting">Login</VBtn>
        </VSheet>
      </VForm>
    </div>
  </VApp>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { user, login } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const submitting = ref(false)
const required = (v: string) => (v !== '' && v != null) || 'This field is required'

watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

const onLogin = async () => {
  submitting.value = true
  try {
    await login(email.value, password.value)
    await router.push('/')
  } catch (err: any) {
    const message = err?.message || 'Login failed'
    const { createAlert } = await import('mosha-vue-toastify')
    createAlert(message, { type: 'danger', timeout: 2000, position: 'top-center' })
  }
  submitting.value = false
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex; height: 100vh;
  .login-form {
    margin: auto; display: flex; flex-direction: column; gap: 30px;
    .login-card {
      width: 60ch; max-width: 90vw; min-width: 300px; padding: 60px 20px;
      display: flex; flex-direction: column; text-align: center;
      p { font-size: 0.8em; letter-spacing: 0.9px; }
      .welcome-text { font-size: 0.6em; letter-spacing: 1px; margin-bottom: 10px; color: #999; }
      .fields { margin: auto; margin-bottom: 30px; width: 80%;
        p { margin-bottom: 5px; margin-top: 10px; }
      }
    }
    .login-btn-sheet { margin: auto; }
  }
}
</style>
