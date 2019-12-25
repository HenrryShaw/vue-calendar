import DateUtil from "./dateutil"


export default class CalendarHelper {

  dateObj: Date

  year: number

  month: number

  date: number

  day: number

  hour: number

  minute: number

  second: number

  minYear: number = 1900

  maxYear: number = 2100

  minDate: Date = new Date("1900-01-01")

  maxDate: Date = new Date("2100-12-31")

  constructor(date?: string) {
    let d = date ? DateUtil.getDate(date) || new Date() : new Date()
    this.setDate(d)
  }

  setDate(date: Date) {
    this.dateObj = date
    this.year = date.getFullYear()
    this.month = this.dateObj.getMonth()
    this.date = this.dateObj.getDate()
    this.day = this.dateObj.getDay()
    this.hour = this.dateObj.getHours()
    this.minute = this.dateObj.getMinutes()
    this.second = this.dateObj.getSeconds()
  }

  getDayArr() {
    let days: Array<Object> = [],
        dateUtil: DateUtil = new DateUtil()
    const first_day_week: number = this.getFirstDayWeek()
    if (first_day_week !== 1) {
      const prev_month_days: Array<Object> = dateUtil.getPrevMonthDays(this.dateObj, first_day_week).map((_: number) => ({
        date: this.year === this.minYear ? '' : _,
        type: 'prev'
      }))
      days = days.concat(prev_month_days)
    }
    const current_month_days: Array<Object> = Array.apply(null, { length: dateUtil.getMonthDays(this.dateObj) }).map((_: any, index: number) => ({
      date: index + 1, 
      type: 'current'
    }))
    days = days.concat(current_month_days)
    const next_month_days: Array<Object> = Array.apply(null, {length: 42 - days.length}).map((_: any, index: number) => ({
      date: this.year === this.maxYear ? '' : index + 1,
      type: "next"
    }))
    days = days.concat(next_month_days)
    return days
  }

  /* 获取每个月第一天对应的星期 */
  getFirstDayWeek() {
    const d = DateUtil.getDate(`${this.year}-${this.month + 1}-01`)
    return d.getDay()
  }

  nextYear() {
    this.year < this.maxYear && (
      this.year += 1,
      this.month = -1,
      this.date = -1,
      this.dateObj.setFullYear(this.year)
    )
  }

  prevYear() {
    this.year > this.minYear && (
      this.year -= 1,
      this.month = -1,
      this.date = -1,
      this.dateObj.setFullYear(this.year)
    )
  }

  nextMonth() {
    if (this.month === 11) {
      this.year += 1
      this.month = 0
      this.dateObj.setFullYear(this.year)
    } else {
      this.month += 1
    }
    this.date = -1
    this.dateObj.setMonth(this.month, 1)
  }

  prevMonth() {
    
    if (this.month === 0) {
      this.year -= 1
      this.month = 11
      this.dateObj.setFullYear(this.year)
    } else {
      this.month -= 1
    }
    this.date = -1
    this.dateObj.setMonth(this.month, 1)
  }

  setYear(year: number) {
    this.dateObj.setFullYear(year)
    this.year !== year && (this.month = -1, this.date = -1)
    this.year = year

  }

  setMonth(month: number) {
    this.dateObj.setMonth(month)
    this.month !== month && (this.date = -1)
    this.month = month
  }

  setDay(day: number) {
    this.dateObj.setDate(day)
    this.date = day
    this.day = this.dateObj.getDay()
  }

  setHours(hour: number, minute: number, second: number) {
    this.dateObj.setHours(hour, minute, second)
    this.hour = hour
    this.minute = minute
    this.second = second
  }

}