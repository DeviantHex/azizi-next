<template>
  <VContainer v-if="blog" class="blog" style="max-width: 75ch">
    <div class="header-img">
      <div class="background">
        <img class="logo" src="/assets/images/banner-logo.svg" alt="The Azizi Firm Logo" />
      </div>
    </div>
    <div v-if="user" class="action-btns">
      <VBtn v-if="!editBlog" color="secondary" @click="editBlog = true">Edit</VBtn>
      <VBtn color="error">Delete
        <VDialog activator="parent" max-width="340">
          <template #default="{ isActive }">
            <VCard title="Delete Blog?" text="This will permanently delete the current blog, are you sure?">
              <template #actions>
                <VBtn class="ml-auto" @click="isActive.value = false">Cancel</VBtn>
                <VBtn color="error" @click="deleteBlog">Delete</VBtn>
              </template>
            </VCard>
          </template>
        </VDialog>
      </VBtn>
    </div>
    <template v-if="!editBlog">
      <div>
        <div class="header">
          <h1>{{ blog.title }}</h1>
          <VBtn :icon="mdiShareVariantOutline" color="#CDB08350" @click="copyLink" />
        </div>
        <PageMetaBar />
        <div class="user-info">
          <VAvatar src="/assets/images/amer-portrait-small.jpg" size="30" alt="Amer Azizi" />
          <h4>Amer Azizi</h4>

        </div>
      </div>
      <div class="content" v-html="blog.content" />
      <div class="author-box">
        <h2>About the Author</h2>
        <p>
          Amer Azizi is the founder of The Azizi Firm. He represents California clients in employment law,
          personal injury, auto fraud, and lemon law matters and previously worked on the defense side for
          major insurers, giving him practical insight into how claims are evaluated and contested.
        </p>
        <NuxtLink to="/our-team">View attorney profile</NuxtLink>
      </div>
      <div class="resource-box">
        <h2>Related Resources</h2>
        <div class="related-links">
          <NuxtLink v-for="link in relatedLinks" :key="link.href" :to="link.href">
            <strong>{{ link.title }}</strong>
            <span>{{ link.description }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>
    <div v-else class="form">
      <VTextField label="Title" v-model="editTitle" :rules="[required]" />
      <ClientOnly><LazyTextEditor v-model="editContent" /></ClientOnly>
      <div class="row">
        <div />
        <VBtn color="secondary" @click="saveBlog">Save</VBtn>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { mdiShareVariantOutline } from '@mdi/js'
import { getBlogRelatedLinks } from '~/utils/contentIndex'
import { CONTENT_LAST_UPDATED, formatIsoDate, stripHtml } from '~/utils/seo'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const id = route.params.id as string

const blog = ref<any>(null)
const editBlog = ref(false)
const editTitle = ref('')
const editContent = ref('')
const required = (v: string) => !!v || 'Field is required'

watch(editBlog, (val) => {
  if (val && blog.value) {
    editTitle.value = blog.value.title
    editContent.value = blog.value.content
  }
})

const { data, error } = await useFetch('/api/blogs', { params: { id } })

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
}

blog.value = (data.value as any).blog

const blogDescription = computed(() => {
  if (!blog.value?.content) return ''
  const text = stripHtml(blog.value.content)
  return text.substring(0, 160).trim() + (text.length > 160 ? '...' : '')
})

const pageTitle = computed(() => blog.value?.title ? `${blog.value.title} | The Azizi Firm` : 'Blog | The Azizi Firm')
const canonicalUrl = computed(() => `https://theazizifirm.com/blog/${id}`)
const relatedLinks = computed(() => getBlogRelatedLinks(blog.value?.title, blog.value?.content))

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: blogDescription,
  ogDescription: blogDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: blogDescription,
  robots: 'index, follow',
})

useHead({
  script: () => blog.value ? [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.value.title,
      'url': `https://theazizifirm.com/blog/${id}`,
      'author': {
        '@type': 'Person',
        'name': 'Amer Azizi',
        'url': 'https://theazizifirm.com/our-team'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'The Azizi Firm',
        'url': 'https://theazizifirm.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://theazizifirm.com/assets/images/header-logo.svg'
        }
      },
      'datePublished': blog.value.createdDate?._seconds
        ? new Date(blog.value.createdDate._seconds * 1000).toISOString()
        : undefined,
      'dateModified': blog.value.updatedDate?._seconds
        ? new Date(blog.value.updatedDate._seconds * 1000).toISOString()
        : blog.value.createdDate?._seconds
          ? new Date(blog.value.createdDate._seconds * 1000).toISOString()
          : formatIsoDate(CONTENT_LAST_UPDATED),
      'description': stripHtml(blog.value.content).substring(0, 200) || '',
      'image': blog.value.headerImg || 'https://theazizifirm.com/assets/images/placeholderBlogImg.png'
    })
  }] : []
})

const copyLink = async () => {
  navigator.clipboard.writeText(location.toString())
  const { createAlert } = await import('mosha-vue-toastify')
  createAlert('Link copied to clipboard', { type: 'success', timeout: 2000, position: 'top-center' })
}

const saveBlog = async () => {
  if (editTitle.value && editContent.value) {
    try {
      await $fetch('/api/blogs/update', {
        method: 'POST',
        params: { id: blog.value.id },
        body: { title: editTitle.value, content: editContent.value },
      })
      blog.value.title = editTitle.value
      blog.value.content = editContent.value
      blog.value.updatedDate = { _seconds: Math.floor(Date.now() / 1000) }
      editBlog.value = false
    } catch {}
  }
}

const deleteBlog = async () => {
  try {
    await $fetch(`/api/blogs/${blog.value.id}`, { method: 'DELETE' })
    await router.push('/blogs')
  } catch {}
}
</script>

<style scoped lang="scss">
.blog {
  display: flex; flex-direction: column; gap: 32px;
  .header-img { margin-top: 24px; height: 300px; border-radius: 8px; box-shadow: 0px 7px 29px 0px #64646f33; padding: 12px;
    .background { border-radius: 8px; width: 100%; height: 100%; background: #34485c; display: flex;
      .logo { margin: auto; height: 75%; max-width: 90%; }
    }
  }
  .action-btns { display: flex; justify-content: center; gap: 8px; }
  .header { display: flex; justify-content: space-between; }
  .user-info { display: flex; gap: 8px; align-items: center; color: #999; }
  .content, :deep(.ck-content) { display: flex; flex-direction: column; gap: 16px; }
  .author-box, .resource-box {
    padding: 18px; border: 1px solid #e5e7eb; border-radius: 10px;
    display: flex; flex-direction: column; gap: 10px; background: #fafafa;
  }
  .related-links {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;
    a {
      display: flex; flex-direction: column; gap: 6px; padding: 12px;
      border: 1px solid #e5e7eb; border-radius: 8px; background: #fff;
    }
    span { color: #5c6670; }
  }
  .form { display: flex; gap: 16px; flex-direction: column; }
}
</style>
