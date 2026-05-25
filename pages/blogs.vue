<template>
  <VContainer class="blogs">
    <h1 class="text-center">
      <i v-if="!smAndDown" class="icon-start" />
      BLOGS
      <i v-if="!smAndDown" class="icon-end" />
    </h1>
    <PageMetaBar />
    <div class="posts">
      <template v-if="!blogs?.length">
        <VCard class="post" v-for="i in 5" :key="i" variant="outlined" color="#ddd" rounded="md">
          <div class="content" :style="{ flexDirection: smAndDown ? 'column' : 'row' }">
            <VSkeletonLoader type="image" :width="smAndDown ? undefined : 200" />
            <div class="text"><VSkeletonLoader type="article" /></div>
          </div>
        </VCard>
      </template>
      <VCard v-for="{ id, title, content, headerImg } in blogs" :key="id" class="post" variant="outlined" color="#ddd" rounded="md" :to="`/blog/${id}`">
        <div class="content" :style="{ flexDirection: smAndDown ? 'column' : 'row' }">
          <VImg :src="headerImg" :width="smAndDown ? undefined : 200" aspect-ratio="1" rounded="lg" :alt="title" />
          <div class="text">
            <h2 class="title">{{ title }}</h2>
            <div class="user-info">
              <VAvatar :image="profilePic" size="30" alt="Amer Azizi" />
              <h4>Amer Azizi</h4>

            </div>
            <div class="text-content" v-html="content" :style="{ '-webkit-line-clamp': smAndDown ? '10' : '4' }" />
            <NuxtLink class="read-more-btn" :to="`/blog/${id}`">Read More</NuxtLink>
          </div>
        </div>
      </VCard>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import profilePic from '@/assets/images/amer-portrait-small.jpg'
import { CONTENT_LAST_UPDATED, formatIsoDate } from '~/utils/seo'

const { smAndDown } = useDisplay()

const description = 'Read legal insights from The Azizi Firm - California employment law, personal injury, auto fraud, and lemon law blog. Expert advice from attorney Amer Azizi.'

useSeoMeta({
  title: 'Legal Blog - Employment Law & Personal Injury Insights | The Azizi Firm',
  ogTitle: 'Legal Blog - Employment Law & Personal Injury Insights | The Azizi Firm',
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://theazizifirm.com/blogs',
  twitterCard: 'summary',
  robots: 'index, follow',
})

useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          'name': 'The Azizi Firm Blog',
          'url': 'https://theazizifirm.com/blogs',
          'description': description,
          'dateModified': formatIsoDate(CONTENT_LAST_UPDATED)
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://theazizifirm.com' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://theazizifirm.com/blogs' }
          ]
        }
      ]
    })
  }]
})

const { data } = await useFetch('/api/blogs/all')
const blogs = computed(() => (data.value as any)?.blogs || [])
</script>

<style scoped lang="scss">
.posts {
  display: flex; flex-direction: column; gap: 16px; margin-top: 16px;
  .post {
    .content {
      padding: 16px; display: flex; gap: 16px; width: 100%; color: rgb(var(--v-theme-on-background));
      .text {
        flex: 1000; display: flex; flex-direction: column; gap: 8px;
        .user-info { display: flex; gap: 8px; align-items: center; color: #999; }
        .text-content {
          overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; line-clamp: 4; -webkit-box-orient: vertical;
        }
        .read-more-btn { margin-right: auto; font-style: italic; color: rgb(var(--v-theme-secondary)); margin-top: auto; }
      }
    }
  }
}
</style>
