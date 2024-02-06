import { createPinia } from 'pinia'
// pinia持久化
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useCounterStore } from './modules/counter'
// import { useUserStore } from './modules/user'
// export { useCounterStore, useUserStore }

export * from './modules/counter'
export * from './modules/user'
