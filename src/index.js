import Calendar from '@/calendar'

Calendar.install = (Vue) => {
  Vue.component(Calendar.name, Calendar)
}

const install = (Vue, opt = {}) => {
  Vue.component(Calendar.name, Calendar)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Calendar


