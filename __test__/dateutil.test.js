import DateUtil from '@/utils/dateutil'

let instance = new DateUtil

describe('test method', () => {

  it('getPrevMonthDays', () => {
    expect(instance.getPrevMonthDays(new Date("1996-05-01"), 3)).toStrictEqual([29, 30])

    expect(instance.getPrevMonthDays(new Date('2019-01-01'), 2)).toStrictEqual([31])
  })

  it('formatDate', () => {
    expect(DateUtil.formatDate(new Date("2019-12-17"), "yy/MM/DD")).toBe("19/12/17")

    expect(DateUtil.formatDate(new Date("2019-12-11T15:08:34"), "yyyy年MM月DD日 HH:mm:ss")).toBe("2019年12月11日 15:08:34")

    expect(DateUtil.formatDate(new Date("2019-02-01T15:08:34"), "yyyy年M月D日 H:m:ss")).toBe("2019年2月1日 15:8:34")

    expect(DateUtil.formatDate(new Date("2019-02-01T15:08:34"), "yyyy年MM月DD日 A hh:mm:ss")).toBe("2019年02月01日 下午 03:08:34")

    expect(DateUtil.formatDate(new Date("2019-02-01T01:08:34"), "yyyy年MM月DD日 A h:mm:ss")).toBe("2019年02月01日 凌晨 1:08:34")

    expect(DateUtil.formatDate(new Date("2019-12-17"), "yyyy年MM月DD日 d")).toBe("2019年12月17日 二")

    expect(DateUtil.formatDate(new Date("2019-12-17"), "yyyy年MM月DD日 dd")).toBe("2019年12月17日 周二")

    expect(DateUtil.formatDate(new Date("2019-12-17"), "yyyy年MM月DD日 ddd")).toBe("2019年12月17日 星期二")

    expect(DateUtil.formatDate(new Date("2019-12-22"), "LMLD LT")).toBe('冬月廿七 冬至')

    expect(DateUtil.formatDate(new Date("2019-01-02"), "农历 LY LMLD")).toBe('农历 2018 冬月廿七')

    expect(DateUtil.formatDate(new Date("2020-01-06"), "yyyy年MM月DD日 LMLD LT")).toBe('2020年01月06日 腊月十二 小寒')
  })

})