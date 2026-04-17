<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import ToastNotification from './components/ToastNotification.vue'

const router = useRouter()
const { token, fetchCurrentUser, logout } = useAuth()

onMounted(async () => {
  if (!token.value) return
  try {
    await fetchCurrentUser()
  } catch {
    logout()
    router.push('/login')
  }
})
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>
