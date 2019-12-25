<template>
  <div class="x-calendar-wrapper" ref="calendar" v-show="value" v-clickoutside="handleClose" v-keydown="handleKeydown">
    <div class="x-calendar-header">
      <div class="x-calendar-date">
        <span class="x-calendar-date__year" @click="handleClickYear">{{ ch.year }} 年</span>
        <span class="x-calendar-date__month" v-show="ch.month !== -1" @click="handleClickMonth">{{ ch.month + 1 }} 月</span> 
      </div>
      <div class="x-calendar-btn">
        <div :class="['x-calendar-btn__prev', {'x-calendar-btn__prev_disabled': btnDisabled || prevDisabled}]" @click="switchYearAndMonth('prev')">
          <span class="a"></span><span class="b"></span>
        </div>
        <div class="x-calendar-btn__today" @click="toToday">今天</div>
        <div :class="['x-calendar-btn__next', {'x-calendar-btn__next_disabled': btnDisabled || nextDisabled}]" @click="switchYearAndMonth('next')">
          <span class="a"></span><span class="b"></span>
        </div>
      </div>
    </div>
    
    <transition name="fade" mode="out-in">
      <component v-bind:is="view" :helper="ch" :isLunar="isLunar" @click="handleClickPad"></component>
    </transition>

    <div class="x-calendar-footer" v-if="hms">
      <div class="hour-menu" v-show="timeType === 'hour'" @click="handleClickTime('hour', $event)">
        <span class="time-span" v-for="(item, index) in 24" :key="`hour_${index}`" :data-value="index">{{ index }}</span>
      </div>
      <div class="minute-menu" v-show="timeType === 'minute'" @click="handleClickTime('minute', $event)">
        <span class="time-span" v-for="(item, index) in minutes" :key="`minute_${index}`" :data-value="item">{{ item}}</span>
      </div>
      <div class="second-menu" v-show="timeType === 'second'" @click="handleClickTime('second', $event)">
        <span class="time-span" v-for="(item, index) in seconds" :key="`minute_${index}`" :data-value="item">{{ item }}</span>
      </div>
      <div class="x-time-wrapper" v-clickoutside="clickInputOutside">
        <input @blur="handleBlur('hour', $event)" @focus="hanldeFocus('hour', $event)" 
          class="th" type="text" maxlength="2" :value="hour">
        <span class="x-time-colon">:</span>
        <input @blur="handleBlur('minute', $event)" @focus="hanldeFocus('minute', $event)" 
          class="tm" type="text" maxlength="2" :value="minute">
        <span class="x-time-colon">:</span>
        <input @blur="handleBlur('second', $event)" @focus="hanldeFocus('second', $event)" 
          class="ts" type="text" maxlength="2" :value="second">
      </div>
      <div class="confirm-btn" @click="handleConfirm">确定</div>
    </div>
  </div>
</template>

<script>
import DayPad from '@/components/DayPad'
import MonthPad from '@/components/MonthPad'
import YearPad from '@/components/YearPad'
import CalendarHelper from '@/utils/calendarhelper'
import DateUtil from './utils/dateutil'
import { log } from 'util'
import Clickoutside from '@/utils/clickoutside'

export default {
  name: 'calendar',
  props: {
    el: String,
    value: Boolean,
    isLunar: Boolean,
    hms: Boolean,
    minDate: String,
    maxDate: String,
    defaultVal: String,
    format: {
      type: String,
      default: () => {
        return 'yyyy-MM-DD'
      }
    }
  },
  data() {
    return {
      show: false,
      days: [],
      view: 'day-pad',
      ch: {},
      hasEl: false,
      timeType: '',
      hour: 0,
      minute: 0,
      second: 0,
      minutes: [],
      seconds: []
    }
  },
  directives: { 
    Clickoutside,
    'keydown': {
      bind: (el, binding, vnode) => {
        document.addEventListener('keydown', (e) => {
          vnode.context.handleKeydown(e)
        })
      }
    }
  },
  components: {
    DayPad, MonthPad, YearPad
  },
  created () {
    this.ch = new CalendarHelper(this.defaultVal);
    this.days = this.ch.getDayArr()
    this.initTime()
    this.initConf()
  },
  watch: {
    value: function(val) {
      val && this.positionEL()
    }
  },
  computed: {
    btnDisabled() {
      return this.view === 'year-pad'
    },
    prevDisabled() {
      return this.ch.minYear === this.ch.year
    },
    nextDisabled() {
      return this.ch.maxYear === this.ch.year
    }
  },
  methods: {
    initTime() {
      const { hour, minute, second } = this.ch
      this.hour = hour
      this.minute = minute
      this.second = second
      let i = 0;
      for (i = 0; i < 60; i+=5) {
        this.minutes.push(i)
      }
      for (i = 0; i < 60; i+=15) {
        this.seconds.push(i)
      }
    },
    initConf() {
      const { minDate, maxDate, ch } = this
      const min_d = minDate && DateUtil.getDate(minDate),
            max_d = maxDate && DateUtil.getDate(maxDate)
      min_d && ( ch.minDate = min_d )
      max_d && ( ch.maxDate = max_d )
      if (ch.maxDate.getFullYear() < new Date().getFullYear()) {
        ch.setDate(DateUtil.getDate(maxDate))
      }
      if (ch.minDate.getFullYear() > new Date().getFullYear()) {
        ch.setDate(DateUtil.getDate(minDate))
      }
    },
    handleClose() {
      this.$emit('input', false)
    },
    handleKeydown(e) {
      const keycode = e.keyCode
      // Tab
      if (keycode === 9) {
        this.$emit('input', false)
      }
      // Enter 
      if (keycode === 13) {
        this.$emit('input', false)
        this.triggerChange()
      }
    },
    positionEL() {
      const { el, handleKeydown } = this
      let e = null
      el && (e = document.getElementById(el))
      if (e) {
        this.hasEl = true
        let bcr = e.getBoundingClientRect(),
            top = bcr.top + bcr.height + 5,
            eStyle = this.$el.style
        eStyle.cssText = `position: absolute; top: ${top}px;`
        if (bcr.left + this.$refs.calendar.clientWidth > innerWidth ) {
          eStyle.cssText += `right: 0;`
        } else {
          eStyle.cssText += `left: ${bcr.left}px;`
        }
      }
    },
    handleClickMonth () {
      this.view = 'month-pad'
    },
    handleClickYear () {
      this.view = 'year-pad'
    },
    handleClickPad(type, value) {
      const { ch } = this;
      ({
        'day': () => {
          this.switchDay(value)
        },
        'month': () => {
          this.view = 'day-pad'
          ch.setMonth(value - 1)
          this.days = ch.getDayArr()
        },
        'year': () => {
          this.view = 'month-pad'
          ch.setYear(value)
        }
      })[type]()
    },
    switchYearAndMonth(type) {
      const { ch, view } = this;
      if (view !== 'year-pad') {
        ({
          'prev': () => {
            view === 'month-pad' ? ch.prevYear() : ch.prevMonth()
          },
          'next': () => {
            view === 'month-pad' ? ch.nextYear() : ch.nextMonth()
          }
        })[type]();
        this.days = ch.getDayArr()
      }
    },
    switchDay({ day, type }) {
      const { ch } = this;
      if (type !== 'current') {
        ({
          'prev': () => {
            ch.prevMonth()
          },
          'next': () => {
            ch.nextMonth()
          }
        })[type]();
        this.days = ch.getDayArr()
      }
      ch.setDay(Number(day))
      !this.hms && this.triggerChange()
    },
    triggerChange() {
      const { el, ch, hasEl, format } = this
      const { year, month, date, day, hour, minute, second } = ch
      this.$emit('input', false)
      
      const v = DateUtil.formatDate(ch.dateObj, format)
      if (hasEl) {
        const e = document.getElementById(el)
        e.tagName === 'INPUT' ? e.value = v : e.innerText = v 
      }
      let val = {
        year,
        month,
        date,
        day,
        hour,
        minute,
        second,
        formatDate: v
      }
      this.$emit('change', val)
    },
    toToday() {
      if (this.ch.maxDate.getFullYear() < new Date().getFullYear()) {
        return;
      }
      this.ch.setDate(new Date())
      this.days = this.ch.getDayArr()
      this.view = 'day-pad'
      this.triggerChange()
    },
    hanldeFocus(type, e) {
      e.target.select();
      this.timeType = type
    },
    handleBlur(type, e) {
      const { value } = e.target;
      const { ch } = this;
      ({
        'hour': () => {
          (value >= 0 && value <= 23) && (this.hour = value)
        },
        'minute': () => {
          (value >= 0 && value <= 59) && (this.minute = value)
        },
        'second': () => {
          (value >= 0 && value <= 59) && (this.second = value)
        }
      })[type]()
    },
    handleClickTime(type, e) {
      const { value } = e.target.dataset;
      ({
        'hour': () => {
          this.hour = value
        },
        'minute': () => {
          this.minute = value
        },
        'second': () => {
          this.second = value
        }
      })[type]()
    },
    clickInputOutside() {
      this.timeType = ''
    },
    handleConfirm() {
      const { hour, minute, second, ch } = this
      const { month, date } = ch
      if (month === -1 || date === -1) {
        return;
      }
      this.ch.setHours(hour, minute, second)
      this.triggerChange()
    }
  }


}
</script>

<style lang="less" scoped>
@import './index.less';
</style>