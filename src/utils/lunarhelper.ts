export default class LunarHelper {

  year: number

  month: number

  day: number

  isLeap: boolean

   // 0X0FFFF[0000 {1111 1111 1111} 1111]中间12位代表12个月，1为大月，0为小月 后四位代表闰月的月份 第17位代表该闰月是大月还是小月，1代表大月
  lunar_info = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, //1900-1909
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, //1910-1919
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, //1920-1929
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, //1930-1939
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, //1940-1949
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0, //1950-1959
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, //1960-1969
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6, //1970-1979
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, //1980-1989
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0, //1990-1999
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, //2000-2009
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, //2010-2019
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, //2020-2029
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, //2030-2039
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, //2040-2049
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0, //2050-2059
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, //2060-2069
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, //2070-2079
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, //2080-2089
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252, //2090-2099
    0x0d520
  ]

  sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758]
     
  solarTerm = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]

  /**
   * 该年的总天数
   * @param year 
   */
  lunarYearDays(year: number) {
    let sum = 348
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += ( this.lunar_info[year - 1900] & i ) ? 1 : 0
    }
    return sum + this.leapMonthDays(year)
  }

  /**
   * 农历某年某月的天数
   * @param year 
   * @param month 
   */
  lunarMonthDays(year: number, month: number) {
    return ( ( this.lunar_info[year-1900] & (0x10000 >> month) ) ? 30 : 29 )
  }

  /**
   * 该年份的闰月是大月还是小月
   * 取表里对应的年份的16进制数据的第17位
   * @param year 
   * @returns: 大月：30 小月: 29 没有闰月：0
   */
  leapMonthDays(year: number) {
    if(this.leapMonth(year)) {
      return ( ( this.lunar_info[ year - 1900 ] & 0x10000 ) ? 30 : 29 )
    } else {
      return 0;
    }
  }

  /**
   * 该年份哪个月是闰月, 没有闰月返回 0
   * 取表里对应的年份的16进制数据的后4位，得出闰月
   * @param year 
   * @returns 0-12
   */
  leapMonth(year: number) {
    return ( this.lunar_info[ year - 1900 ] & 0xf )
  }

  solarToLunar(date: Date) {
    date.setHours(0, 0, 0)
    let baseDate = new Date(1900, 0, 31, 0, 0, 0),
        offset = Math.round((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000))
    let i = 0, temp = 0, leapMonth = 0
    for (i = 1900; i < 2100 && offset > 0; i++) {
      temp = this.lunarYearDays(i)
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }
    this.year = i;
    leapMonth = this.leapMonth(i)
    this.isLeap = leapMonth > 0
    for (i = 1; i < 13 && offset > 0; i++) {
      if (this.isLeap && i === (leapMonth + 1)) {
        this.isLeap = false
        temp = this.leapMonthDays(this.year)
        i--
      } else {
        temp = this.lunarMonthDays(this.year, i)
      }
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    this.month = i;
    this.day = offset + 1
  }

  getSolarTerm(date: Date) {
    const y = date.getFullYear(), m = date.getMonth(), d = date.getDate()
    let term = '';
    let a = new Date((31556925974.7*(y-1900)+this.sTermInfo[m*2]*60000)+Date.UTC(1900,0,6,2,5))
    let b = new Date((31556925974.7*(y-1900)+this.sTermInfo[m*2+1]*60000)+Date.UTC(1900,0,6,2,5))
    if (a.getUTCDate() === d) term = this.solarTerm[m*2]
    if (b.getUTCDate() === d) term = this.solarTerm[m*2+1]
    return term
  }

  lunarMonthCN(month: number) {
    if (month > 12 || month < 1) {
      return;
    }
    let arr1 = ["正","二","三","四","五","六","七","八","九","十","冬","腊"]
    return `${arr1[month - 1]}月`
  }

  lunarDayCN(day: number) {
    let arr1 = ['日','一','二','三','四','五','六','七','八','九','十'],
        arr2 = ['初','十','廿','卅','　'],
        str = ''
    if (day < 0) {
      return str
    }
    switch(day) {
      case 10:
        str = '初十'
        break;
      case 20:
        str = '二十'
        break;
      case 30:
        str = '三十'
        break;
      default:
        str = `${arr2[Math.floor(day/10)]}${arr1[Math.floor(day%10)]}`
    }
    return str || '';
  }

}