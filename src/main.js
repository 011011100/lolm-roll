import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import App from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    // the routes property is handled by the plugin
})

createApp(App)
    .use(router)
    .mount('#app');
