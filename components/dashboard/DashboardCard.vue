<template>
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure" :class="`text-${color}`">
        <i :class="icon" class="text-2xl"></i>
      </div>
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value" :class="`text-${color}`">{{ value }}</div>
      <div class="stat-desc" v-if="trend">
        <span :class="trendClass">
          <i :class="trendIcon" class="mr-1"></i>
          {{ trend.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  trend?: {
    value: number
    label: string
    type: 'up' | 'down' | 'neutral'
  }
}

const props = defineProps<Props>()

const trendClass = computed(() => {
  if (!props.trend) return ''
  
  switch (props.trend.type) {
    case 'up':
      return 'text-success'
    case 'down':
      return 'text-error'
    default:
      return 'text-base-content/60'
  }
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  
  switch (props.trend.type) {
    case 'up':
      return 'fas fa-arrow-up'
    case 'down':
      return 'fas fa-arrow-down'
    default:
      return 'fas fa-minus'
  }
})
</script>