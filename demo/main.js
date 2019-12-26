import Vue from 'vue'
import App from './App.vue'

import Calendar from '@/calendar.js'
Vue.use(Calendar)

new Vue({
  el: "#app",
  render: h => h(App)
})