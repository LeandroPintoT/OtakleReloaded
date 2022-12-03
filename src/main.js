import { createApp } from 'vue'
import App from './App.vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import Toast from "vue-toastification"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import "bootstrap/dist/js/bootstrap.js"
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(BootstrapVue3)
app.use(Toast, {
    transition: "Vue-Toastification__fade", // Vue-Toastification__fade | Vue-Toastification__slideBlurred | Vue-Toastification__bounce | my-custom-fade
    maxToasts: 5,
    newestOnTop: true
})

app.mount('#app')