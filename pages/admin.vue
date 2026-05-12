<template>
  <VContainer class="admin-panel">
    <h1 class="header"><i v-if="!smAndDown" class="icon-start" />Admin<i v-if="!smAndDown" class="icon-end" /></h1>
    <h2>Add Blog</h2>
    <VForm class="form" @submit.prevent="submitBlog">
      <VTextField v-model="title" label="Title" :rules="[required]" />
      <VFileInput v-model="imageFile" accept="image/*" label="Image" :rules="[required]" />
      <ClientOnly><LazyTextEditor v-model="content" /></ClientOnly>
      <VBtn class="ml-auto" type="submit">Post Blog</VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
const { smAndDown } = useDisplay()
const router = useRouter()
const { user, loading } = useAuth()

const required = (v: string) => !!v || 'Field is required'
const title = ref('')
const content = ref('')
const imageFile = ref<File>()

watchEffect(() => {
  if (!loading.value && !user.value) {
    router.push('/login')
  }
})

useHead({ title: 'Admin | The Azizi Firm' })

const submitBlog = async () => {
  if (!content.value || !imageFile.value) return

  try {
    const reader = new FileReader()
    const base64 = await new Promise<string>((resolve) => {
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.readAsDataURL(imageFile.value)
    })

    const storageRes: any = await $fetch('/api/storage/upload', {
      method: 'POST',
      body: {
        file: base64,
        filename: imageFile.value.name,
        mimeType: imageFile.value.type,
      },
    })

    await $fetch('/api/blogs/create', {
      method: 'POST',
      body: { title: title.value, content: content.value, headerImg: storageRes.urls[0] },
    })

    const { createAlert } = await import('mosha-vue-toastify')
    createAlert('Blog created successfully', { type: 'success', timeout: 2000, position: 'top-center' })

    title.value = ''
    content.value = ''
    imageFile.value = undefined
  } catch {}
}
</script>

<style scoped lang="scss">
.admin-panel {
  display: flex; flex-direction: column; gap: 16px;
  .header { display: flex; align-items: center; justify-content: center; }
  .form { display: flex; flex-direction: column; gap: 16px; }
}
</style>
