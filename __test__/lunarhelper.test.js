import LunarHelper from '@/utils/lunarhelper'

describe('lunarhelp method test', () => {

  let instance = new LunarHelper()

  it('lunarYearDays', () => {
    expect(instance.lunarYearDays(2019)).toBe(354)
    expect(instance.lunarYearDays(2016)).toBe(355)
    expect(instance.lunarYearDays(1990)).toBe(384)
    expect(instance.lunarYearDays(1970)).toBe(355)
  })

  it('leapMonth', () => {
    expect(instance.leapMonth(1990)).toBe(5)
    expect(instance.leapMonth(2019)).toBe(0)
  })

  it('leapMonthDays', () => {
    expect(instance.leapMonthDays(1990)).toBe(29)
  })
  
  it('getSolarTerm', () => {
    expect(instance.getSolarTerm(new Date('2013-10-08'))).toBe('寒露')
    expect(instance.getSolarTerm(new Date('2019-12-22'))).toBe('冬至')
  })

  it('lunarMonthCN', () => {
    expect(instance.lunarMonthCN(2)).toBe('二月')
    expect(instance.lunarMonthCN(11)).toBe('冬月')
  })

  it('lunarDayCN', () => {
    instance.solarToLunar(new Date('2019-12-22'))
    expect(instance.lunarDayCN(2)).toBe('初二')
    expect(instance.lunarDayCN(12)).toBe('十二')
    expect(instance.lunarDayCN(23)).toBe('廿三')
    expect(instance.lunarDayCN(instance.day)).toBe('廿七')
  })


})