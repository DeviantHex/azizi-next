<template>
  <div class="page-meta">
    <span>
      Last updated
      <time :datetime="isoDate">{{ displayDate }}</time>
    </span>

  </div>
</template>

<script setup lang="ts">
import { CONTENT_LAST_UPDATED, formatDisplayDate, formatIsoDate } from '~/utils/seo'

const props = withDefaults(defineProps<{
  date?: string
  reviewedBy?: string
}>(), {
  date: CONTENT_LAST_UPDATED,
  reviewedBy: 'Amer Azizi',
})

const displayDate = computed(() => formatDisplayDate(props.date))
const isoDate = computed(() => formatIsoDate(props.date))
</script>

<style scoped lang="scss">
.page-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  color: #5c6670;
  font-size: 0.95rem;
  padding: 12px 16px;
  border-left: 4px solid rgb(var(--v-theme-secondary));
  background: #f7f7f7;
  border-radius: 8px;

  time {
    font-weight: 600;
  }
}
</style>
