<template>
  <div class="x-calendar-month" @click="handleClick" >
    <div :data-month='item' :class="['x-calendar-month__item', 'x-calendar-cell', {'x-calendar-cell_active_two': item === currentMonth,
      'x-calendar-cell_forbidden': !inRange(item)}]"
       v-for="item in 12" :key="`month_${item}`">
      {{ item }} 月 
    </div>
  </div>
</template>

<script>
export default {
  props: {
    helper: {
      type: Object,
      default: null,
    }
  },
  computed: {
    currentMonth() {
      return this.helper === null ? 0 : this.helper.month + 1
    }
  },
  methods: {
    handleClick(e) {
      const m = Number(e.target.dataset.month)
      this.inRange(m) && this.$emit('click', 'month', m)
    },
    inRange(m) {
      const { minDate, maxDate, year } = this.helper
      const min_y = minDate.getFullYear(),
            max_y = maxDate.getFullYear(),
            min_m = minDate.getMonth(),
            max_m = maxDate.getMonth()
      if (year === min_y && year === max_y) {
        return m >= min_m + 1 && m <= max_m + 1
      } else if (year === min_y) {
        return m >= min_m + 1
      } else if (year === max_y) {
        return m <= max_m + 1
      } else if (year >= min_y && year <= max_y) {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>