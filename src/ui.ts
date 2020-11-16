import { createApp, provide } from 'vue'
import { createStore } from 'vuex'

import App from './ui.vue'

import store from './store'


const app = createApp(App)
app.provide("vuex-store", store)
app.use(store)
app.mount('#app')