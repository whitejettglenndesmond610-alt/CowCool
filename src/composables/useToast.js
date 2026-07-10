import { reactive, readonly } from 'vue'

export function useToast() {
  const toast = reactive({
    visible: false,
    message: '',
  })

  let timer = null

  function showToast(message) {
    if (timer) clearTimeout(timer)
    toast.message = message
    toast.visible = true

    timer = setTimeout(() => {
      toast.visible = false
    }, 3000)
  }

  return {
    toast: readonly(toast),
    showToast,
  }
}
