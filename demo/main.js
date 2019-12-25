import Vue from 'vue'
import App from './App.vue'

import Calendar from '@/index'

Vue.use(Calendar)

new Vue({
  el: "#app",
  render: h => h(App)
})