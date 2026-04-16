<script setup lang="ts">
import type { AuditLog, ChangeOrderState } from '../types'
import StateBadge from './StateBadge.vue'

defineProps<{
  auditLogs: AuditLog[]
}>()

const stateDotColorMap: Record<ChangeOrderState, string> = {
  draft: 'bg-gray-400',
  submitted: 'bg-blue-400',
  under_review: 'bg-amber-500',
  approved: 'bg-green-600',
  rejected: 'bg-red-600',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function hasReason(metadata: Record<string, unknown> | null): boolean {
  return metadata !== null && 'reason' in metadata && typeof metadata.reason === 'string'
}

function getReason(metadata: Record<string, unknown> | null): string {
  if (metadata !== null && 'reason' in metadata && typeof metadata.reason === 'string') {
    return metadata.reason
  }
  return ''
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
      Audit Timeline
    </h3>

    <div v-if="auditLogs.length > 0" class="relative">
      <div
        v-for="(log, index) in auditLogs"
        :key="log.id"
        class="relative pl-8 pb-6"
        :class="{ 'pb-0': index === auditLogs.length - 1 }"
      >
        <div
          v-if="index < auditLogs.length - 1"
          class="absolute left-1.5 top-3 bottom-0 border-l-2 border-gray-200"
        />
        <div
          class="absolute left-0 top-1 w-3 h-3 rounded-full ring-2 ring-white"
          :class="stateDotColorMap[log.to_state]"
        />

        <div class="space-y-1">
          <p class="text-sm text-gray-700">
            <span class="font-medium">{{ log.user.name }}</span>
            {{ ' ' }}{{ log.action }} this change order
          </p>

          <div class="flex items-center gap-2">
            <StateBadge v-if="log.from_state" :state="log.from_state" />
            <span v-if="log.from_state" class="text-gray-400 text-xs">→</span>
            <StateBadge :state="log.to_state" />
          </div>

          <p class="text-xs text-gray-400">{{ formatDate(log.created_at) }}</p>

          <p v-if="hasReason(log.metadata)" class="text-xs text-gray-500 italic">
            "{{ getReason(log.metadata) }}"
          </p>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-gray-400">No activity yet.</p>
  </div>
</template>
