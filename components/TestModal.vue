<template>
  <div class="modal modal-open">
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
    <div class="modal-box">
      <h3 class="font-bold text-lg">Test Modal</h3>
      <p class="py-4">This is a test modal to check if modals are working.</p>
      <div class="modal-action">
        <button @click="$emit('close')" class="btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close'): void
}

defineEmits<Emits>()
</script>