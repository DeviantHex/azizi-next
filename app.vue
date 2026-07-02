<template>
  <div class="app-shell" :class="{ 'app-shell--ready': isHydrated }">
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'page-fade', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const isHydrated = ref(false)

onMounted(() => {
  isHydrated.value = true
})
</script>
