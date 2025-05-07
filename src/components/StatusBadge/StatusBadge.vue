<script setup lang="ts">
import { computed } from 'vue'
import type { Status } from '@/types/invoice'

const props = defineProps<{
  status: Status
}>()

const statusColor = computed(() => {
  const colors = {
    paid: {
      '--bg-color': 'rgba(51, 214, 159, 0.0571)',
      '--text-color': '#33d69f',
    },
    pending: {
      '--bg-color': 'rgba(255, 143, 0, 0.0571)',
      '--text-color': '#FF8F00',
    },
    draft: {
      '--bg-color': 'rgba(55, 59, 83, 0.0571)',
      '--text-color': '#373B53',
    },
  }
  return colors[props.status]
})
</script>
<template>
  <div class="status-badge" :style="statusColor">
    <div class="status-badge__dot"></div>
    <div class="status-badge__name">{{ status }}</div>
  </div>
</template>
<style lang="scss" scoped>
.status-badge {
  width: 104px;
  background-color: var(--bg-color);
  border-radius: 6px;
  height: 40px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  &__dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: var(--text-color);
  }

  &__name {
    color: var(--text-color);
    text-transform: capitalize; /* 每个单词首字母大写 */
    @include text.text-styles('heading-s-variant');
  }
}
</style>
