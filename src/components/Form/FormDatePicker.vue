<template>
  <div class="ms-datepicker-wrap">
    <div class="input-box" @click="showSelect" :class="{readonly: readonly}">
        <input
            type="text"
            @input.stop=""
            @change="onChange"
            :readonly="readonly || disabled"
            :placeholder="placeholder"
            :style="{width: width ? width+'px' : 'auto'}"
            :value="formatValue">
        <span
            :class="{clear: isClear}"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
            @click="clear"></span>
    </div>
    <div v-show="visible" @click.stop="" class="ms-date-picker">
        <div class="ms-date-header">
            <div class="day-panel">
                <div class="prev">
                    <span @click="yearClick(-1, true)">&lt;&lt;</span>
                    <span @click="monthClick(-1)">&lt;</span>
                </div>
                <div class="value">
                    <span @click="toggleState('year')" class="year">{{nowYear}} 年</span>
                    <span @click="toggleState('month')" class="month">{{nowMonth + 1}} 月</span>
                </div>
                <div class="next">
                    <span @click="monthClick(1)">&gt;</span>
                    <span @click="yearClick(1, true)">&gt;&gt;</span>
                </div>
            </div>

            <div v-show="state == 'year'" class="year-panel">
                <div @click="yearRangeClick(-1)" class="prev"><span>&lt;&lt;</span></div>
                <div class="value">
                    <span>{{yearStart}} 年 - {{yearStart+9}} 年</span>
                </div>
                <div @click="yearRangeClick(1)" class="next"><span>&gt;&gt;</span></div>
            </div>
            <div v-show="state == 'month'" class="month-panel">
                <div @click="yearClick(-1)" class="prev"><span>&lt;&lt;</span></div>
                <div class="value">
                    <span @click="toggleState('year')">{{nowYear}} 年</span>
                </div>
                <div @click="yearClick(1)" class="next"><span>&gt;&gt;</span></div>
            </div>
            <div
                v-if="time"
                v-show="state == 'time'"
                class="time-panel">{{toString()}}</div>
        </div>

        <div v-if="date.length" class="ms-date-body">
            <table class="day-panel">
                <thead>
                    <tr class="ms-date-days">
                        <th v-for="day in days"><span>{{day}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in 6">
                        <td v-for="j in 7"
                            :class="[date[getIdx(i,j)].status, {disabled:date[getIdx(i,j)].disabled}]"
                            :date="date[getIdx(i,j)].date"
                            @click="pickDate(getIdx(i,j))">
                            <span>{{date[getIdx(i,j)].text}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-show="state == 'year'" class="year-panel">
                <table>
                    <tr v-for="i in 4">
                        <td
                            v-for="j in 3"
                            :class="{first: i == 1 && j == 1, last: i == 4 && j == 3, active: nowYear == getYearByIndex(i-1, j-1, yearStart)}">
                            <span @click="selectYear(getYearByIndex(i-1, j-1, yearStart), i-1, j-1)">{{getYearByIndex(i-1, j-1, yearStart)}}</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div v-show="state == 'month'" class="month-panel">
                <table>
                    <tr v-for="i in 4">
                        <td
                            v-for="j in 3"
                            :class="{active: nowMonth == (i-1) * 3 + j-1}">
                            <span @click="selectMonth(i-1, j-1)">{{months[(i-1) * 3 + j-1]}}月</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div
                v-if="time"
                v-show="state == 'time'"
                class="time-panel">
                <div class="list">
                    <ul><li v-for="i in 24" @click="selectHour(i-1)" :class="{active: i-1 == nowHour}">{{i-1|padding}}</li></ul>
                </div>
                <div class="list">
                    <ul><li v-for="i in 60" @click="selectMinute(i-1)" :class="{active: i-1 == nowMinute}">{{i-1|padding}}</li></ul>
                </div>
                <div class="list">
                    <ul><li v-for="i in 60" @click="selectSecond(i-1)" :class="{active: i-1 == nowSecond}">{{i-1|padding}}</li></ul>
                </div>
            </div>
        </div>

        <div
            v-if="time"
            v-show="state == 'time' || state == 'date'" class="ms-date-footer">
            <span @click="toggleState('time')">{{state == 'date' ? '选择时间' : '返回'}}</span>
        </div>
    </div>
  </div>
</template>

<script>
// ref https://github.com/Bubblings/vue-date-picker
export default {
  name: 'form-date-picker',
  props: {
      value: {
          type: [String, Number],
          default: ''
      },
      format: {
          type: String,
          // YYYY-MM-DD HH:mm:ss
          default: 'YYYY-MM-DD'
      },
      time: {
          type: Boolean,
          default: false
      },
      // false value
      min: {
          type: [Date, Object, String],
          default: null
      },
      max: {
          type: [Date, Object, String],
          default: null
      },
      readonly: {
          type: Boolean,
          default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: {
          type: Boolean,
          default: false
      },
      clearable: {
          type: Boolean,
          default: false
      },
      width: {
          type: Number,
          default: 0
      }
  },

  data: function () {
      return {
          visible: false,
          isClear: false,
          now: new Date(),
          // year, month, date, time
          state: 'date',
          date: [],
          yearStart: 0,
          month: [],
          months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
          days: ['日', '一', '二', '三', '四', '五', '六']
      }
  },

  computed: {
      nowYear: function () {
          return this.now.getFullYear()
      },
      nowMonth: function () {
          return this.now.getMonth()
      },
      nowDate: function () {
          return this.now.getDate()
      },
      nowHour: function () {
          return this.now.getHours()
      },
      nowMinute: function () {
          return this.now.getMinutes()
      },
      nowSecond: function () {
          return this.now.getSeconds()
      },
      formatValue: function () {
          var t = this.parse(this.value)
          return t ? this.toString(t) : ''
      }
  },

  methods: {
      hide: function () {
          document.removeEventListener('click', this.closeOnDocumentClick, false)
          this.visible = false
      },

      show: function () {
          this.updateDate()
          this.visible = true
          document.addEventListener('click', this.closeOnDocumentClick, false)
      },

      closeOnDocumentClick: function (e) {
          if (!this.$el.contains(e.target)) {
              this.hide()
          }
      },

      getIdx: function(i, j) {
          return (i - 1) * 7 + j - 1
      },

      mouseEnter: function () {
          if (this.clearable && this.value) {
              this.isClear = true
          }
      },
      mouseLeave: function () {
          this.isClear = false
      },
      clear: function (e) {
          if (this.isClear) {
              e.stopPropagation()
              this.now = new Date()
              this.$emit('input', '', 0)
              this.$emit('clear')
          }
      },

      onChange: function (e) {
          var value = e.target.value.trim()
          if (!value) {
              this.hide()
              this.now = new Date()
              this.$emit('input', '', 0)
              return
          }

          var v = this.parse(value)
          if (v && !this.isDisabled(v)) {
              this.now = v
              this.change()
          }
          e.target.value = this.formatValue
      },

      showSelect: function (e) {
          if (this.disabled || this.visible) return
          if (!this.visible && this.value) {
              this.now = this.parse(this.value) || new Date()
          }
          this.show()
      },

      toggleState: function (state) {
          if (state !== this.state) {
              this.state = state
              if (state === 'year') {
                  var year = this.nowYear
                  this.yearStart = year - year % 10
              }
          } else if (state !== 'date') {
              this.state = 'date'
          }
      },

      getYearByIndex: function(i, j, start) {
          return start + i * 3 + j - 1
      },

      yearRangeClick: function (dir) {
          var start = this.yearStart
          this.yearStart = start - start % 10 + 10 * dir
      },

      selectYear: function (year, i, j) {
          if (i === 0 && j === 0) {
              this.yearRangeClick(-1)
          } else if (i === 3 && j === 2) {
              this.yearRangeClick(1)
          } else {
              this.now.setFullYear(year)
              this.now = new Date(this.now)
              this.state = 'month'
          }
      },

      selectMonth: function (i, j) {
          this.now.setMonth(i * 3 + j)
          this.now = new Date(this.now)
          this.updateDate()
          this.state = 'date'
      },

      yearClick: function (flag, update) {
          this.now.setFullYear(this.nowYear + flag)
          this.now = new Date(this.now)
          if (update) {
              this.updateDate()
          }
      },

      monthClick: function (flag) {
          this.now.setMonth(this.nowMonth + flag)
          this.now = new Date(this.now)
          this.updateDate()
      },

      selectHour: function (i) {
          this.now.setHours(i)
          this.now = new Date(this.now)
          this.change()
      },

      selectMinute: function (i) {
          this.now.setMinutes(i)
          this.now = new Date(this.now)
          this.change()
      },

      selectSecond: function (i) {
          this.now.setSeconds(i)
          this.now = new Date(this.now)
          this.change()
      },

      pickDate: function (index) {
          var data = this.date[index]
          if (data.disabled) return
          this.hide()
          var date = new Date(data.time)
          date.setHours(this.nowHour, this.nowMinute, this.nowSecond)
          this.now = date
          this.change()
      },

      change: function () {
          if (this.min && this.now < this.min) {
              this.now = new Date(this.min)
          }
          if (this.max && this.now > this.max) {
              this.now = new Date(this.max)
          }
          this.$emit('input', this.toString(), this.now.getTime())
      },

      isDisabled: function (t) {
          if (this.min) {
              var min = new Date(this.min)
              min.setHours(0, 0, 0, 0)
              if (t < min) return true
          }
          if (this.max) {
              var max = new Date(this.max)
              max.setHours(23, 59, 59, 999)
              if (t > max) return true
          }
          return false
      },

      updateDate: function () {
          var isDisabled = this.isDisabled
          var arr = []
          var time = new Date(this.now)
          // the first day
          time.setMonth(time.getMonth(), 1)
          var curFirstDay = time.getDay()
          if (curFirstDay === 0) {
              curFirstDay = 7
          }
          // the last day
          time.setDate(0)
          var lastDayCount = time.getDate()

          for (var i = curFirstDay; i > 0; i--) {
              var t = new Date(time.getFullYear(), time.getMonth(), lastDayCount - i + 1)
              arr.push({
                  text: lastDayCount - i + 1,
                  time: t,
                  status: 'date-pass',
                  disabled: isDisabled(t)
              })
          }

          // the last day of this month
          time.setMonth(time.getMonth() + 2, 0)
          var curDayCount = time.getDate()
          // fix bug when month change
          time.setDate(1)

          var value = this.parse(this.value)
          if (value) {
              value = this.toString(value, 'YYYY-MM-DD')
          }

          for (var i = 0; i < curDayCount; i++) {
              var t = new Date(time.getFullYear(), time.getMonth(), i + 1)
              arr.push({
                  text: i + 1,
                  time: t,
                  status: this.toString(t, 'YYYY-MM-DD') === value ? 'active' : '',
                  disabled: isDisabled(t)
              })
          }

          var j = 1
          while (arr.length < 42) {
              var t = new Date(time.getFullYear(), time.getMonth() + 1, j)
              arr.push({
                  text: j,
                  time: t,
                  status: 'date-future',
                  disabled: isDisabled(t)
              })
              j++
          }

          this.date = arr
      },

      // 仅支持
      // unix ms, YYYY-MM-DD, YYYY-MM-DD HH:mm:ss, YYYY-MM-DDTHH:mm:ss
      parse: function (str) {
          var time
          var DATE_RE = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:(?:\s*|T)(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/
          if (typeof str === 'number') {
              time = new Date(str)
          } else {
              var m = str.match(DATE_RE)
              if (!m) return null
              time = m[4]
                  ? new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6])
                  : new Date(m[1], m[2] - 1, m[3])
          }
          return isNaN(time.getTime()) ? null : time
      },

      toString: function (time, format) {
          time = time || this.now
          format = format || this.format
          var year = time.getFullYear()
          var month = time.getMonth() + 1
          var date = time.getDate()
          var monthName = time.getMonth() + 1
          var hour = time.getHours()
          var minute = time.getMinutes()
          var second = time.getSeconds()
          var pad = function (v) {
            return v >= 10 ? v : '0' + v
          }

          var map = {
              YYYY: year,
              MM: pad(month),
              M: month,
              DD: pad(date),
              D: date,
              HH: pad(hour),
              H: hour,
              mm: pad(minute),
              m: minute,
              ss: pad(second),
              s: second
          }

          return format.replace(/Y+|M+|D+|H+|m+|s+/g, function (str) {
            return map[str]
          })
      }
  },

  filters: {
      padding: function (v) {
          return v >= 10 ? v : '0' + v
      }
  }
}
</script>

<style lang="less">
.ms-datepicker-wrap {
  position: relative;
  display: inline-block;
  font-size: 14px;
}
.ms-datepicker-wrap .input-box input {
  height: 38px;
  line-height: 38px;
  padding: 0 32px 0 10px;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  border-radius: 3px;
  color: #444;
}
.ms-datepicker-wrap .input-box span {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 22px;
  height: 22px;
  /*background: url(../assets/image/icon-select.png) no-repeat;*/
}
.ms-datepicker-wrap .input-box span.clear {
  /*background: url(../assets/image/close.png) 50% 50% no-repeat;*/
  background-size: 50% 50%;
}
.ms-datepicker-wrap .input-box.readonly span {
  cursor: default;
}
.ms-datepicker-wrap .ms-date-picker {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 1000;
  width: 240px;
  margin-top: 5px;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.65);
  user-select: none;
}
.ms-datepicker-wrap .ms-date-header {
  position: relative;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.ms-datepicker-wrap .ms-date-header span {
  display: inline-block;
  cursor: pointer;
}
.ms-datepicker-wrap .ms-date-header .prev,
.ms-datepicker-wrap .ms-date-header .next {
  position: absolute;
  top: 0;
  color: rgba(0, 0, 0, 0.43);
}
.ms-datepicker-wrap .ms-date-header .prev span,
.ms-datepicker-wrap .ms-date-header .next span {
  padding: 0 5px;
}
.ms-datepicker-wrap .ms-date-header .prev {
  left: 8px;
}
.ms-datepicker-wrap .ms-date-header .next {
  right: 8px;
}
.ms-datepicker-wrap .ms-date-header .value {
  font-weight: 700;
}
.ms-datepicker-wrap .ms-date-header .year {
  margin-right: 10px;
}
.ms-datepicker-wrap .ms-date-body {
  position: relative;
  border-top: 1px solid #e9e9e9;
  padding: 4px 8px;
}
.ms-datepicker-wrap .ms-date-footer {
  border-top: 1px solid #e9e9e9;
  text-align: center;
}
.ms-datepicker-wrap .ms-date-footer span {
  display: inline-block;
  padding: 8px 10px;
  cursor: pointer;
}
.ms-datepicker-wrap .year-panel,
.ms-datepicker-wrap .month-panel,
.ms-datepicker-wrap .time-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
}
.ms-datepicker-wrap table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.ms-datepicker-wrap th,
.ms-datepicker-wrap td {
  text-align: center;
  padding: 3px 0;
}
.ms-datepicker-wrap th span,
.ms-datepicker-wrap td span {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
}
.ms-datepicker-wrap td span {
  cursor: pointer;
}
.ms-datepicker-wrap td.ms-date-pass span,
.ms-datepicker-wrap td.ms-date-future span,
.ms-datepicker-wrap td.disabled span {
  color: rgba(0, 0, 0, 0.25);
}
.ms-datepicker-wrap td:hover span {
  background-color: #ecf6fd;
}
.ms-datepicker-wrap td.disabled {
  cursor: not-allowed;
}
.ms-datepicker-wrap td.disabled:hover span {
  background-color: #fff;
  cursor: not-allowed;
}
.ms-datepicker-wrap td.active span {
  color: #fff;
  background-color: #108ee9;
}
.ms-datepicker-wrap .ms-date-body .month-panel td,
.ms-datepicker-wrap .ms-date-body .year-panel td {
  height: 54.5px;
  vertical-align: middle;
}
.ms-datepicker-wrap .ms-date-body .month-panel td:hover,
.ms-datepicker-wrap .ms-date-body .year-panel td:hover {
  color: #108ee9;
}
.ms-datepicker-wrap .ms-date-body .month-panel td span,
.ms-datepicker-wrap .ms-date-body .year-panel td span {
  width: auto;
  height: auto;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.ms-datepicker-wrap .ms-date-body .year-panel td.first,
.ms-datepicker-wrap .ms-date-body .year-panel td.last {
  color: rgba(0, 0, 0, 0.25);
}
.ms-datepicker-wrap .ms-date-body .time-panel .list {
  float: left;
  width: 33.333333%;
  height: 100%;
  text-align: center;
  overflow: auto;
}
.ms-datepicker-wrap .ms-date-body .time-panel ul {
  padding: 0;
}
.ms-datepicker-wrap .ms-date-body .time-panel li {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  list-style: none;
}
.ms-datepicker-wrap .ms-date-body .time-panel li:hover {
  background: #ecf6fd;
}
.ms-datepicker-wrap .ms-date-body .time-panel li.active {
  background: #f7f7f7;
  font-weight: 700;
}
</style>
