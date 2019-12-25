<template>
  <div>
    <div class="x-calendar-week">
      <span class="x-calendar-week__item" v-for="week in weeks" :key="`week_${week.day}`">{{ week.code }}</span>
    </div>
    <div class="x-calendar-day" @click="handleClick">
      <div :class="['x-calendar-day__item', 'x-calendar-cell', {'x-calendar-day__item_disabled': item.type !== 'current', 
        'x-calendar-cell_active': item.date === currentDay && item.type === 'current', 'x-calendar-cell_forbidden': !inRange(item)}]" 
        v-for="(item, index) in days" :key="`day_${index}`" :data-day="item.date" :data-type="item.type">
        <span>{{ item.date }}</span>
        <p class="x-calendar-lunar-day" v-show="isLunar">{{ lunarDays[index] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LunarHelper from '@/utils/lunarhelper'
import { padStart } from '@/utils/util'

export default{
  props: {
    isLunar: Boolean,
    helper: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      weeks: [{day: 1, code: '\u4e00'}, {day: 2, code: '\u4e8c'}, {day: 3, code: '\u4e09'}, {day: 4, code: '\u56db'}, {day: 5, code: '\u4e94'}, {day: 6, code: '\u516d'}, {day: 0, code: '\u65e5'}],
      lh: {},
      lunarDays: []
    }
  },
  created() {
    this.lh = new LunarHelper()
    this.getLunarDays()
  },
  computed: {
    days() {
      return this.helper === null ? [] : this.helper.getDayArr()
    },
    currentDay() {
      return this.helper === null ? 0 : this.helper.date
    },
  },
  watch: {
    'helper.month': function(val) {
      this.getLunarDays()
    }
  },
  methods: {
    getLunarDays() {
      if (!this.isLunar) {
        return;
      }
      this.lunarDays = []
      this.days.forEach( _ => {
        this.lunarDays.push(this.lunarDay(_))
      })
    },
    lunarDay(dayObj) {
      const { year, month } = this.helper
      const { type, date } = dayObj
      let d = null
      if (!date) {
        return ""
      }
      if (type === 'prev') {
        d = new Date(month === 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, date)
      } else if (type === 'next') {
        d = new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, date)
      } else {
        d = new Date(year, month, date)
      }
      this.lh.solarToLunar(d)
      let term = this.lh.getSolarTerm(d)
      if (this.lh.day === 1) {
        return this.lh.lunarMonthCN(this.lh.month)
      }
      return term || this.lh.lunarDayCN(this.lh.day)
    },
    handleClick(e) {
      let dataset = e.target.dataset.day ? e.target.dataset : e.target.parentNode.dataset
      this.inRange({date: dataset.day, type: dataset.type}) && this.$emit('click', 'day', dataset)
    },
    inRange(d) {
      const { minDate, maxDate, year, month } = this.helper
      const { date, type } = d
      const min = Number(`${minDate.getFullYear()}${padStart(minDate.getMonth(), 2, '0')}${padStart(minDate.getDate(), 2, '0')}`),   
            max = Number(`${maxDate.getFullYear()}${padStart(maxDate.getMonth(), 2, '2')}${padStart(maxDate.getDate(), 2, '0')}`)

      let dn = 0
      if (type === 'prev') {
        dn = Number(`${month === 0 ? year - 1 : year}${padStart(month === 0 ? 11 : month - 1, 2, '0')}${padStart(date, 2, '0')}`)
      } else if (type === 'next') {
        dn = Number(`${month === 11 ? year + 1 : year}${padStart(month === 11 ? 0 : month + 1, 2, '0')}${padStart(date, 2, '0')}`)
      } else {
        dn = Number(`${year}${padStart(month, 2, '0')}${padStart(date, 2, '0')}`)
      }

      return (dn >= min && dn <= max)
      
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>