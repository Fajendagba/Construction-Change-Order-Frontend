<script setup lang="ts">
import type { Project } from '../types'

defineProps<{
  project: Project
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">{{ project.name }}</h2>

    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          Original Budget
        </p>
        <p class="text-lg font-semibold text-gray-900">
          {{ formatCurrency(project.original_budget) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          Approved Changes
        </p>
        <p
          class="text-lg font-semibold"
          :class="project.approved_changes_total > 0 ? 'text-green-600' : 'text-gray-400'"
        >
          {{ formatCurrency(project.approved_changes_total) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          Current Budget
        </p>
        <p class="text-lg font-semibold text-gray-900">
          {{ formatCurrency(project.current_budget) }}
        </p>
      </div>
    </div>

    <p v-if="project.change_orders_count !== undefined" class="text-sm text-gray-500">
      {{ project.change_orders_count }}
      {{ project.change_orders_count === 1 ? 'change order' : 'change orders' }}
    </p>
  </div>
</template>
