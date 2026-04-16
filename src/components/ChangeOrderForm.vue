<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChangeOrders } from '../composables/useChangeOrders'
import type { ChangeOrder, CreateChangeOrderPayload } from '../types'
import { isAxiosError } from 'axios'

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits<{
  created: [changeOrder: ChangeOrder]
  cancel: []
}>()

const { createChangeOrder } = useChangeOrders()

const form = ref<CreateChangeOrderPayload>({
  title: '',
  description: '',
  reason: '',
  cost_code: '',
  labor_cost: 0,
  material_cost: 0,
})

const loading = ref(false)
const generalError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string[]>>({})

const totalCost = computed(() => form.value.labor_cost + form.value.material_cost)

const costCodes = [
  '01-General',
  '02-Sitework',
  '03-Concrete',
  '04-Masonry',
  '05-Metals',
  '06-Carpentry',
  '07-Thermal',
  '08-Doors-Windows',
  '09-Finishes',
  '15-Mechanical',
  '16-Electrical',
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

async function handleSubmit(): Promise<void> {
  loading.value = true
  generalError.value = null
  fieldErrors.value = {}

  try {
    const created = await createChangeOrder(props.projectId, form.value)
    emit('created', created)
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.status === 422) {
      const data = err.response.data as { errors?: Record<string, string[]> }
      fieldErrors.value = data.errors ?? {}
    } else if (err instanceof Error) {
      generalError.value = err.message
    } else {
      generalError.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">New Change Order</h2>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-400': fieldErrors.title }"
        />
        <p v-if="fieldErrors.title" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.title[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="form.description"
          required
          rows="3"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-400': fieldErrors.description }"
        />
        <p v-if="fieldErrors.description" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.description[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <input
          v-model="form.reason"
          type="text"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-400': fieldErrors.reason }"
        />
        <p v-if="fieldErrors.reason" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.reason[0] }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Cost Code</label>
        <select
          v-model="form.cost_code"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          :class="{ 'border-red-400': fieldErrors.cost_code }"
        >
          <option value="" disabled>Select a cost code</option>
          <option v-for="code in costCodes" :key="code" :value="code">{{ code }}</option>
        </select>
        <p v-if="fieldErrors.cost_code" class="mt-1 text-xs text-red-600">
          {{ fieldErrors.cost_code[0] }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Labor Cost</label>
          <input
            v-model.number="form.labor_cost"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-400': fieldErrors.labor_cost }"
          />
          <p v-if="fieldErrors.labor_cost" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.labor_cost[0] }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Material Cost</label>
          <input
            v-model.number="form.material_cost"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-400': fieldErrors.material_cost }"
          />
          <p v-if="fieldErrors.material_cost" class="mt-1 text-xs text-red-600">
            {{ fieldErrors.material_cost[0] }}
          </p>
        </div>
      </div>

      <div class="bg-gray-50 rounded-md px-4 py-3 flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600">Total Cost</span>
        <span class="text-base font-bold text-gray-900">{{ formatCurrency(totalCost) }}</span>
      </div>

      <p v-if="generalError" class="text-sm text-red-600">{{ generalError }}</p>

      <div class="flex gap-3 pt-1">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Submitting...' : 'Create Change Order' }}
        </button>
        <button
          type="button"
          class="flex-1 bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
