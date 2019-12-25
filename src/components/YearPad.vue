<template>
  <div class="x-calendar-year"  @click="handleClick" ref="year">
    <div :ref="`year${year}`" :class="['x-calendar-cell', 'x-calendar-year__item', {'x-calendar-cell_active_two': year === currentYear,
      'x-calendar-cell_forbidden': !inRange(year)}]"
      v-for="year in years" :key="`year_${year}`" :data-year="year">
      {{ year }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    helper: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      min: 0,
      max: 0,
      minDate: null,
      maxDate: null,
      currentYear: 0,
      years: []
    }
  },
  created() {
    if (this.helper !== null) {
      const { minYear, maxYear, year } = this.helper
      this.min = minYear
      this.max = maxYear
      this.currentYear = year
      for (let i = this.min; i <= this.max && i >= this.min; i++) {
        this.years.push(i)
      }
    }
  },
  mounted() {
    const { currentYear, min, max } = this
    if (currentYear && currentYear > min && currentYear <= max) {
      const el = this.$refs.year
      const cell_h = this.$refs.year1900[0].clientHeight
      //const flag = (currentYear - min) % 4
      //const dividend = flag === 0 ? currentYear - min - 1 : currentYear - min
      const scrollTop = Math.floor( (currentYear - min) / 4 ) * cell_h
      //console.log(scrollTop);
      if (el.scrollTo) {
        el.scrollTo(0, scrollTop)
      } else {
        el.scrollTop = scrollTop
      }
    }
  },
  computed: {
    
  },
  methods: {
    handleClick(e) {
      const y = Number(e.target.dataset.year)
      this.inRange(y) && this.$emit('click', 'year', y)
    },
    inRange(y) {
      const { minDate, maxDate, minYear, maxYear } = this.helper
      return y >= minDate.getFullYear() && y <= maxDate.getFullYear() 
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>