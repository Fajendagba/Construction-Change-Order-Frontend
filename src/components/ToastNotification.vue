<script setup lang="ts">
import { useToast } from '../composables/useToast'
import type { Toast } from '../types'

const { toasts, dismiss } = useToast()

const colorMap: Record<Toast['type'], string> = {
  success: 'bg-white border-l-4 border-green-500',
  error: 'bg-white border-l-4 border-red-500',
  info: 'bg-white border-l-4 border-blue-500',
}

const iconColorMap: Record<Toast['type'], string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="rounded-lg shadow-lg p-4 flex items-start gap-3 cursor-pointer"
        :class="colorMap[toast.type]"
        @click="dismiss(toast.id)"
      >
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          :class="iconColorMap[toast.type]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="toast.type === 'error'"
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          :class="iconColorMap[toast.type]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          :class="iconColorMap[toast.type]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>

        <p class="text-sm text-gray-700 flex-1">{{ toast.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
