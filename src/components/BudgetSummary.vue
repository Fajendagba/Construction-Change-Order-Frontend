<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetLineItem } from '../types'

const props = defineProps<{
  lineItems: BudgetLineItem[]
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const totals = computed(() => ({
  original_amount: props.lineItems.reduce((sum, item) => sum + item.original_amount, 0),
  approved_changes: props.lineItems.reduce((sum, item) => sum + item.approved_changes, 0),
  current_amount: props.lineItems.reduce((sum, item) => sum + item.current_amount, 0),
}))
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Budget Summary</h3>
    </div>

    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Cost Code
          </th>
          <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Description
          </th>
          <th class="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Original
          </th>
          <th class="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Changes
          </th>
          <th class="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Current
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in lineItems"
          :key="item.cost_code"
          class="border-b border-gray-100"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        >
          <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ item.cost_code }}</td>
          <td class="px-4 py-3 text-gray-700">{{ item.description }}</td>
          <td class="px-4 py-3 text-right text-gray-700">
            {{ formatCurrency(item.original_amount) }}
          </td>
          <td
            class="px-4 py-3 text-right font-medium"
            :class="item.approved_changes > 0 ? 'text-green-600' : 'text-gray-400'"
          >
            {{ formatCurrency(item.approved_changes) }}
          </td>
          <td class="px-4 py-3 text-right text-gray-700">
            {{ formatCurrency(item.current_amount) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="bg-gray-50 border-t border-gray-200">
          <td class="px-4 py-3 font-bold text-gray-900" colspan="2">Totals</td>
          <td class="px-4 py-3 text-right font-bold text-gray-900">
            {{ formatCurrency(totals.original_amount) }}
          </td>
          <td
            class="px-4 py-3 text-right font-bold"
            :class="totals.approved_changes > 0 ? 'text-green-600' : 'text-gray-400'"
          >
            {{ formatCurrency(totals.approved_changes) }}
          </td>
          <td class="px-4 py-3 text-right font-bold text-gray-900">
            {{ formatCurrency(totals.current_amount) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
