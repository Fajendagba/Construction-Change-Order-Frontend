<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import type { User } from '../types'

defineProps<{
  user: User
}>()

const router = useRouter()
const { logout } = useAuth()

const roleColorMap: Record<string, string> = {
  owner: 'bg-blue-100 text-blue-700',
  contractor: 'bg-green-100 text-green-700',
  architect: 'bg-purple-100 text-purple-700',
}

function handleLogout(): void {
  logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center px-6">
    <div class="flex items-center justify-between w-full">
      <span class="font-bold text-gray-900 text-lg tracking-tight">Change Order Engine</span>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-700 font-medium">{{ user.name }}</span>
        <span
          class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
          :class="roleColorMap[user.role]"
        >
          {{ user.role }}
        </span>
        <button
          class="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          @click="handleLogout"
        >
          Sign out
        </button>
      </div>
    </div>
  </header>
</template>
