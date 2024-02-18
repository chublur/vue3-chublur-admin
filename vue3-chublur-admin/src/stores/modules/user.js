import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('chu-user', () => {
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }

  const user =ref({})
  const getUser = async()=>{
    const res = await getUserInfoService()
    user.value = res.data.data
  }

  return {
    token,
    setToken,
    removeToken,
    user,
    getUser
  }
},
{
  persist:true
}
)
