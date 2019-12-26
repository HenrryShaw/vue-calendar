import Calendar from '@/calendar.vue'

Calendar.install = (Vue) => {
  Vue.component(Calendar.name, Calendar)
}

export default Calendar


