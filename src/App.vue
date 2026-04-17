<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import ToastNotification from './components/ToastNotification.vue'

const { fetchCurrentUser } = useAuth()

onMounted(async () => {
  try {
    await fetchCurrentUser()
  } catch {
    // No valid token — user will be redirected to login by the router guard
  }
})
</script>

<template>
  <RouterView />
  <ToastNotification />
</template>
