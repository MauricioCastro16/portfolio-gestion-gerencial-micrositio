import { createApp } from 'vue'
import { installFavicons } from './utils/favicon'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style.css'

installFavicons()
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
