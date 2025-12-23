import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accountId = ref<number | null>(null)
    function setAccountId(id: number | null) {
      accountId.value = id
    }

    return { accountId, setAccountId }
  },
  {
    persist: true,
  },
)
