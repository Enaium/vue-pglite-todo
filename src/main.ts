import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import '@/styles.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { initDB } from '@/utility/db'

initDB().then(() => {
  console.log('DB initialized')
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
