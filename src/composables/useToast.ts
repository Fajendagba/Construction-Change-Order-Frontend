import { ref, type Ref } from 'vue'
import type { Toast, ToastType } from '../types'

const toasts: Ref<Toast[]> = ref([])
let nextId = 0

interface UseToast {
  toasts: Ref<Toast[]>
  show: (message: string, type?: ToastType) => void
  dismiss: (id: number) => void
}

export function useToast(): UseToast {
  function show(message: string, type: ToastType = 'info'): void {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    show,
    dismiss,
  }
}
