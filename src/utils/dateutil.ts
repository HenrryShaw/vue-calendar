import LunarHelper from './lunarhelper';
import { padStart } from './util';

interface matches {
  [propName: string]: any
}
export default class DateUtil {

  static getDate(dateString: string) {
    const regex = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/
    const m = dateString.match(regex)
    let d = new Date(+m[1], +m[2] - 1, +m[3] || 1, +m[4] || 0, +m[5] || 0, +m[6] || 0, +m[7] || 0)
    if (d.toString() === "Invalid Date") {
      console.error("Invalid Date")
      return null
    }
    return d
  }

  /* 日期格式化 */
  static formatDate(date: Date, formatStr: string) {
    let lunarHelper = new LunarHelper();
    let regex = /y{2,4}|M{1,2}|d{1,3}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|A{1}|h{1,2}|LY|LM|LD|LT/g
    const $year = date.getFullYear(),
          $month = date.getMonth() + 1,
          $date = date.getDate(),
          $day = date.getDay(),
          $hour = date.getHours(),
          $minute = date.getMinutes(),
          $second = date.getSeconds()
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          weekdaysShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          weekdaysMin = ['日', '一', '二', '三', '四', '五', '六']
    lunarHelper.solarToLunar(date)
    const matches: matches = {
      "yy": String($year).slice(-2),
      "yyyy": $year,
      "M": $month,
      "MM": padStart($month, 2, '0'),
      "D": $date,
      "DD": padStart($date, 2, '0'),
      "d": weekdaysMin[$day],
      "dd": weekdaysShort[$day],
      "ddd": weekdays[$day],
      "A": _meridiem($hour, $minute),
      "h": $hour % 12 || 12,
      "hh": padStart($hour % 12 || 12, 2, '0'),
      "H": $hour,
      "HH": padStart($hour, 2, '0'),
      "m": $minute,
      "mm": padStart($minute, 2, '0'),
      "s": $second,
      "ss": padStart($second, 2, '0'),
      "LY": lunarHelper.year,
      "LM": lunarHelper.lunarMonthCN(lunarHelper.month),
      "LD": lunarHelper.lunarDayCN(lunarHelper.day),
      "LT": lunarHelper.getSolarTerm(date)
    }
    return formatStr.replace(regex, (match) => String(matches[match]))
  }

  getDaysOfYear(year: number) {
    let days: Array<number> = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (!this.isLeapYear(year)) {
      days.splice(1, 1, 28)
    }
    return days
  }

  getMonthDays(date: Date) {
    let days: Array<number> = this.getDaysOfYear(date.getFullYear())
    return days[date.getMonth()]
  }

  getPrevMonthDays(date: Date, firstDay: number) {
    let days: Array<number> = this.getDaysOfYear(date.getFullYear()),
        prev_month_days: Array<number> = []
    const m: number = date.getMonth()
    const prev_month_day: number = m === 0 ? days[11] : days[m - 1]
    let i: number = firstDay === 0 ? 5 : firstDay === 1 ? -1 : firstDay - 2 
    for (; i >= 0 && i !== -1; i--) {
      let j: number = prev_month_day - i
      prev_month_days.push(j)
    }
    return prev_month_days
  }

  getPrevYear(date: Date) {
    let d = date
    d.setFullYear(date.getFullYear() - 1)
    return d
  }

  getNextYear(date: Date) {
    let d = date
    d.setFullYear(date.getFullYear() + 1)
    return d
  }

  /* 判断是不是闰年 */
  isLeapYear(year: number) {
    return ( year % 4 === 0 && year % 100 !== 0 ) || year % 400 === 0 
  }

}

function _meridiem(hour: number, minute: number) {
  const hm = (hour * 100) + minute
  if (hm < 600) {
    return '凌晨'
  } else if (hm < 900) {
    return '早上'
  } else if (hm < 1130) {
    return '上午'
  } else if (hm < 1230) {
    return '中午'
  } else if (hm < 1800) {
    return '下午'
  }
  return '晚上'
}