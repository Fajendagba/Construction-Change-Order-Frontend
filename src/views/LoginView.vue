<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const demoUsers = [
  { label: 'Login as Owner (Sarah)', email: 'sarah@example.com', password: 'password' },
  { label: 'Login as Contractor (Mike)', email: 'mike@example.com', password: 'password' },
  { label: 'Login as Architect (Emily)', email: 'emily@example.com', password: 'password' },
]

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})

function fillDemo(demoEmail: string, demoPassword: string): void {
  email.value = demoEmail
  password.value = demoPassword
  error.value = null
}

async function handleSubmit(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Change Order Engine</h1>
        <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 border-t border-gray-100 pt-6">
        <p class="text-xs text-gray-400 mb-3 uppercase tracking-wide font-medium">
          Quick demo logins
        </p>
        <div class="flex flex-col gap-2">
          <button
            v-for="demo in demoUsers"
            :key="demo.email"
            type="button"
            class="w-full text-left px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
            @click="fillDemo(demo.email, demo.password)"
          >
            {{ demo.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
