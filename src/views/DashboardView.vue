<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProjects } from '../composables/useProjects'
import { useChangeOrders } from '../composables/useChangeOrders'
import { useRealtime } from '../composables/useRealtime'
import { useToast } from '../composables/useToast'
import AppHeader from '../components/AppHeader.vue'
import ProjectCard from '../components/ProjectCard.vue'
import BudgetSummary from '../components/BudgetSummary.vue'
import ChangeOrderList from '../components/ChangeOrderList.vue'
import ChangeOrderForm from '../components/ChangeOrderForm.vue'
import type { ChangeOrder, RealtimeChangeOrderEvent } from '../types'

const router = useRouter()
const { user } = useAuth()
const { projects, currentProject, fetchProjects, fetchProject } = useProjects()
const { changeOrders, fetchChangeOrders } = useChangeOrders()
const { subscribeToProject, unsubscribeFromProject } = useRealtime()
const { show } = useToast()

const showCreateModal = ref(false)
const activeProjectId = ref<string | null>(null)

async function loadDashboard(): Promise<void> {
  await fetchProjects()
  if (projects.value.length === 0) return

  const firstProject = projects.value[0]
  activeProjectId.value = firstProject.id

  await Promise.all([
    fetchProject(firstProject.id),
    fetchChangeOrders(firstProject.id),
  ])

  subscribeToProject(firstProject.id, handleRealtimeEvent)
}

async function handleRealtimeEvent(event: RealtimeChangeOrderEvent): Promise<void> {
  if (!activeProjectId.value) return
  await Promise.all([
    fetchProject(activeProjectId.value),
    fetchChangeOrders(activeProjectId.value),
  ])
  show(`Change order updated: ${event.new_state.replace('_', ' ')}`, 'info')
}

function handleSelectChangeOrder(changeOrder: ChangeOrder): void {
  if (!activeProjectId.value) return
  router.push({
    name: 'change-order',
    params: {
      projectId: activeProjectId.value,
      changeOrderId: changeOrder.id,
    },
  })
}

async function handleChangeOrderCreated(changeOrder: ChangeOrder): Promise<void> {
  showCreateModal.value = false
  if (activeProjectId.value) {
    await fetchChangeOrders(activeProjectId.value)
  }
  show(`Change order "${changeOrder.title}" created.`, 'success')
}

onMounted(loadDashboard)

onUnmounted(() => {
  if (activeProjectId.value) {
    unsubscribeFromProject(activeProjectId.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader v-if="user" :user="user" />

    <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <ProjectCard v-if="currentProject" :project="currentProject" />
      <div v-else class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div class="grid grid-cols-3 gap-4">
          <div class="h-16 bg-gray-200 rounded" />
          <div class="h-16 bg-gray-200 rounded" />
          <div class="h-16 bg-gray-200 rounded" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <ChangeOrderList
            :change-orders="changeOrders"
            :project-id="activeProjectId ?? ''"
            :user-role="user?.role ?? 'architect'"
            @select="handleSelectChangeOrder"
            @create="showCreateModal = true"
          />
        </div>

        <div class="col-span-1">
          <BudgetSummary
            v-if="currentProject?.budget_line_items?.length"
            :line-items="currentProject.budget_line_items"
          />
          <div
            v-else
            class="bg-white rounded-lg shadow-sm p-6 text-sm text-gray-400 text-center"
          >
            No budget line items.
          </div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-40 flex items-center justify-center"
        @click.self="showCreateModal = false"
      >
        <div class="absolute inset-0 bg-black/40" @click="showCreateModal = false" />
        <div class="relative z-50 w-full max-w-xl mx-4">
          <ChangeOrderForm
            v-if="activeProjectId"
            :project-id="activeProjectId"
            @created="handleChangeOrderCreated"
            @cancel="showCreateModal = false"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
