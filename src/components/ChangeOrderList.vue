<script setup lang="ts">
import type { ChangeOrder, UserRole } from '../types'
import StateBadge from './StateBadge.vue'

defineProps<{
  changeOrders: ChangeOrder[]
  projectId: string
  userRole: UserRole
}>()

const emit = defineEmits<{
  select: [changeOrder: ChangeOrder]
  create: []
}>()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Change Orders</h3>
      <button
        v-if="userRole === 'contractor'"
        class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        @click="emit('create')"
      >
        <span class="text-base leading-none">+</span>
        New Change Order
      </button>
    </div>

    <div v-if="changeOrders.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-12">
              #
            </th>
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              Title
            </th>
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              Cost Code
            </th>
            <th class="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              Total Cost
            </th>
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              State
            </th>
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              Submitted By
            </th>
            <th class="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in changeOrders"
            :key="order.id"
            class="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            @click="emit('select', order)"
          >
            <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ order.number }}</td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ order.title }}</td>
            <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ order.cost_code }}</td>
            <td class="px-4 py-3 text-right text-gray-700">
              {{ formatCurrency(order.total_cost) }}
            </td>
            <td class="px-4 py-3">
              <StateBadge :state="order.state" />
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ order.submitted_by?.name ?? '—' }}
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">
              {{ formatDate(order.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="px-6 py-10 text-center text-sm text-gray-400">
      No change orders yet.
    </div>
  </div>
</template>
