import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import router from '@/router'

let url = 'http://big-event-vue-api-t.itheima.net'

const service = axios.create({
  baseURL: url,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data.code == 0) {
      return response
    }
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  (error) => {
    // 特殊情况 401
    if (error.response?.status == 401) {
      router.push('/login')
    }
    ElMessage.error(error.response.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default service
