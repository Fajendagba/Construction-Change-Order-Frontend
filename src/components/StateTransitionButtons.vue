<script setup lang="ts">
import { ref } from 'vue'
import { useChangeOrders } from '../composables/useChangeOrders'
import type { ChangeOrder, UserRole, TransitionPayload } from '../types'
import { isAxiosError } from 'axios'

const props = defineProps<{
  changeOrder: ChangeOrder
  userRole: UserRole
  projectId: string
}>()

const emit = defineEmits<{
  transitioned: [updatedChangeOrder: ChangeOrder]
}>()

const { transitionChangeOrder } = useChangeOrders()

const loading = ref(false)
const showRejectionInput = ref(false)
const rejectionReason = ref('')
const errorMessage = ref<string | null>(null)

async function transition(payload: TransitionPayload): Promise<void> {
  loading.value = true
  errorMessage.value = null
  try {
    const updated = await transitionChangeOrder(
      props.projectId,
      props.changeOrder.id,
      payload,
    )
    showRejectionInput.value = false
    rejectionReason.value = ''
    emit('transitioned', updated)
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err.response?.status === 403) {
        errorMessage.value = 'You do not have permission for this action.'
      } else if (err.response?.status === 422) {
        const data = err.response.data as { message?: string }
        errorMessage.value = data.message ?? 'Validation error.'
      } else {
        errorMessage.value = 'An unexpected error occurred.'
      }
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    loading.value = false
  }
}

function handleReject(): void {
  if (!rejectionReason.value.trim()) {
    errorMessage.value = 'A rejection reason is required.'
    return
  }
  transition({ target_state: 'rejected', rejection_reason: rejectionReason.value })
}
</script>

<template>
  <div class="space-y-3">
    <template v-if="changeOrder.state === 'draft' && userRole === 'contractor'">
      <button
        :disabled="loading"
        class="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="transition({ target_state: 'submitted' })"
      >
        {{ loading ? 'Submitting...' : 'Submit for Review' }}
      </button>
    </template>

    <template v-else-if="changeOrder.state === 'submitted' && userRole === 'owner'">
      <button
        :disabled="loading"
        class="w-full bg-amber-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="transition({ target_state: 'under_review' })"
      >
        {{ loading ? 'Processing...' : 'Begin Review' }}
      </button>
    </template>

    <template v-else-if="changeOrder.state === 'under_review' && userRole === 'owner'">
      <button
        :disabled="loading"
        class="w-full bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="transition({ target_state: 'approved' })"
      >
        {{ loading ? 'Processing...' : 'Approve' }}
      </button>

      <button
        :disabled="loading"
        class="w-full bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="showRejectionInput = true"
      >
        Reject
      </button>

      <div v-if="showRejectionInput" class="space-y-2">
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason..."
          rows="3"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <div class="flex gap-2">
          <button
            :disabled="loading"
            class="flex-1 bg-red-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="handleReject"
          >
            {{ loading ? 'Processing...' : 'Confirm Rejection' }}
          </button>
          <button
            class="flex-1 bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            @click="showRejectionInput = false; rejectionReason = ''"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="changeOrder.state === 'rejected' && userRole === 'contractor'">
      <button
        :disabled="loading"
        class="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="transition({ target_state: 'draft' })"
      >
        {{ loading ? 'Processing...' : 'Revise and Resubmit' }}
      </button>
    </template>

    <template v-else-if="changeOrder.state === 'approved'">
      <div class="flex items-center gap-2 text-green-600">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm font-medium">Approved</span>
      </div>
    </template>

    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
  </div>
</template>
