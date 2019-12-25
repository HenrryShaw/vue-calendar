<template>
  <div>
    <div class="input-wrapper">
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <div id="inputDiv" @click="handleClick"></div>
      <calendar :el="'inputDiv'" v-model="show_1" :format="'yyyy年MM月DD日 A hh:mm:ss'" 
        :default-val="'2018-01-01 12:24:35'" :hms="true" @change="handleChange"></calendar>
      <input type="text" name="" id="inputText" @focus="handleFocus">
      <calendar :el="'inputText'" v-model="show_2" :min-date="'2000-11-23'"></calendar>
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" >
      <input type="text" name="" id="inputLunar" @focus="handleFocusLunar" placeholder="农历">
      <calendar :el="'inputLunar'" :format="'LMLD LT'" v-model="show_3" :isLunar="true"></calendar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_1: false,
      show_2: false,
      show_3: false,
    }
  },
  created() {
    
    
  },
  methods: {
    open() {
    },
    handleClick() {
      this.show_1 = true
    },
    handleFocus() {
      this.show_2 = true
    },
    handleFocusLunar() {
      this.show_3 = true
    },
    handleChange(val) {
      console.log(val);
      
    }
  }
}
</script>

<style>
.input-wrapper {
  width: 200px;
  height: 50px;
}
#inputDiv {
  width: 260px;
  height: 35px;
  line-height: 35px;
  border: 1px solid #bebebe;
  border-radius: 5px;
  margin: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
#inputText {
  position: absolute;
  right: 50px;
}
</style>