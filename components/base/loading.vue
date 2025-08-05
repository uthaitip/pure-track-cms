<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      <p v-if="text" class="text-white text-lg">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  show: false,
  text: 'Loading...'
})
</script>