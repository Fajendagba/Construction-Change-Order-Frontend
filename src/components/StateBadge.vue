<script setup lang="ts">
import type { ChangeOrderState } from '../types'

const props = defineProps<{
  state: ChangeOrderState
}>()

const colorMap: Record<ChangeOrderState, string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

function formatState(state: ChangeOrderState): string {
  return state
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <span
    class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="colorMap[props.state]"
  >
    {{ formatState(props.state) }}
  </span>
</template>
