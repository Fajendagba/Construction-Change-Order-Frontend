<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useChangeOrders } from '../composables/useChangeOrders'
import { useRealtime } from '../composables/useRealtime'
import { useToast } from '../composables/useToast'
import AppHeader from '../components/AppHeader.vue'
import StateBadge from '../components/StateBadge.vue'
import StateTransitionButtons from '../components/StateTransitionButtons.vue'
import AuditTimeline from '../components/AuditTimeline.vue'
import type { ChangeOrder, AuditLog, RealtimeChangeOrderEvent } from '../types'

const router = useRouter()
const route = useRoute()
const { user } = useAuth()
const { currentChangeOrder, loading, error, fetchChangeOrder } = useChangeOrders()
const { subscribeToProject, unsubscribeFromProject } = useRealtime()
const { show } = useToast()

const projectId = route.params.projectId as string
const changeOrderId = route.params.changeOrderId as string

const auditLogs = ref<AuditLog[]>([])

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function loadChangeOrder(): Promise<void> {
  await fetchChangeOrder(projectId, changeOrderId)
  if (currentChangeOrder.value?.audit_logs) {
    auditLogs.value = [...currentChangeOrder.value.audit_logs].reverse()
  }
}

function handleRealtimeEvent(event: RealtimeChangeOrderEvent): void {
  if (event.change_order_id !== changeOrderId) return
  loadChangeOrder()
  show(`Change order state updated: ${event.new_state.replace('_', ' ')}`, 'info')
}

function handleTransitioned(updatedChangeOrder: ChangeOrder): void {
  currentChangeOrder.value = updatedChangeOrder
  if (updatedChangeOrder.audit_logs) {
    auditLogs.value = [...updatedChangeOrder.audit_logs].reverse()
  }
  show(`Change order ${updatedChangeOrder.state.replace('_', ' ')}.`, 'success')
}

const heading = computed((): string => {
  if (!currentChangeOrder.value) return ''
  return `CO-${currentChangeOrder.value.number}: ${currentChangeOrder.value.title}`
})

onMounted(async () => {
  await loadChangeOrder()
  subscribeToProject(projectId, handleRealtimeEvent)
})

onUnmounted(() => {
  unsubscribeFromProject(projectId)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader v-if="user" :user="user" />

    <main class="max-w-5xl mx-auto px-4 py-6">
      <button
        class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        @click="router.push('/dashboard')"
      >
        ← Back to Dashboard
      </button>

      <div v-if="loading && !currentChangeOrder" class="space-y-4">
        <div class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div class="h-7 bg-gray-200 rounded w-1/2 mb-2" />
          <div class="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        {{ error }}
      </div>

      <template v-else-if="currentChangeOrder">
        <div class="flex items-center gap-3 mb-6">
          <h1 class="text-2xl font-bold text-gray-900">{{ heading }}</h1>
          <StateBadge :state="currentChangeOrder.state" />
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">
          <div class="col-span-2 space-y-4">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Description
              </h2>
              <p class="text-sm text-gray-700">{{ currentChangeOrder.description }}</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Reason for Change
              </h2>
              <p class="text-sm text-gray-700">{{ currentChangeOrder.reason }}</p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Cost Breakdown
              </h2>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Labor</p>
                  <p class="text-base font-semibold text-gray-900">
                    {{ formatCurrency(currentChangeOrder.labor_cost) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Material</p>
                  <p class="text-base font-semibold text-gray-900">
                    {{ formatCurrency(currentChangeOrder.material_cost) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Total</p>
                  <p class="text-base font-bold text-gray-900">
                    {{ formatCurrency(currentChangeOrder.total_cost) }}
                  </p>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-500">
                  Cost Code: <span class="font-mono text-gray-700">{{ currentChangeOrder.cost_code }}</span>
                </p>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted By</p>
                  <p class="text-gray-700 font-medium">
                    {{ currentChangeOrder.submitted_by?.name ?? '—' }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ formatDate(currentChangeOrder.state_changed_at) }}
                  </p>
                </div>
                <div v-if="currentChangeOrder.reviewed_by">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Reviewed By</p>
                  <p class="text-gray-700 font-medium">{{ currentChangeOrder.reviewed_by.name }}</p>
                </div>
              </div>
            </div>

            <div
              v-if="currentChangeOrder.state === 'rejected' && currentChangeOrder.rejection_reason"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p class="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                Rejection Reason
              </p>
              <p class="text-sm text-red-700">{{ currentChangeOrder.rejection_reason }}</p>
            </div>
          </div>

          <div class="col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Actions
              </h2>
              <StateTransitionButtons
                v-if="user"
                :change-order="currentChangeOrder"
                :user-role="user.role"
                :project-id="projectId"
                @transitioned="handleTransitioned"
              />
            </div>
          </div>
        </div>

        <AuditTimeline :audit-logs="auditLogs" />
      </template>
    </main>
  </div>
</template>
