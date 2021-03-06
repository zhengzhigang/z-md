<template lang="html">
<div class="ms-table-wrap" ref="tableWrap">
    <div class="ms-table-content" ref="tableContent" :style="styleBody">
      <div class="fixed-header" v-if="fixedHead" ref="fixedHeader" :style="style">
        <table cellspacing="0" cellpadding="0">
          <thead class="ms-table_thead">
            <tr>
              <th v-for="(item, index) in columns" class="ms-table_cell" :rowspan="item.rowspan">
                <div>
                  <span>{{item.title}}</span>
                  <span class="ms-table-sort" v-if="item.sortable" @click="handleSort(item)">
                    <span v-if="!item.sortType">
                      <i class="ms-sort-arrow-up"></i>
                      <i class="ms-sort-arrow-down"></i>
                    </span>
                    <i class="ms-sort-arrow-up" :class="{'cur': item.sortType === 'asc'}" ></i>
                    <i class="ms-sort-arrow-down" :class="{'cur': item.sortType === 'desc'}"></i>
                  </span>
                  <span class="ms-table-tips" v-if="item.tip">
                    <i class="ms-question-sign">?</i>
                    <span class="ms-question-sign_wrap" v-text="item.tipText"></span>
                  </span>
                </div>
              </th>
              <th class="ms-table_cell" v-if="actions">
                <div>
                  <span>操作</span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <table cellspacing="0" cellpadding="0" ref="tableMain">
        <thead class="ms-table_thead">
          <tr>
            <th v-for="(item, index) in columns" class="ms-table_cell" :rowspan="item.rowspan">
              <div>
                <span>{{item.title}}</span>
                <span class="ms-table-sort" v-if="item.sortable" @click="handleSort(item)">
                  <span v-if="!item.sortType">
                    <i class="ms-sort-arrow-up"></i>
                    <i class="ms-sort-arrow-down"></i>
                  </span>
                  <i class="ms-sort-arrow-up" :class="{'cur': item.sortType === 'asc'}" ></i>
                  <i class="ms-sort-arrow-down" :class="{'cur': item.sortType === 'desc'}"></i>
                </span>
                <span class="ms-table-tips" v-if="item.tip">
                  <i class="ms-question-sign">?</i>
                  <span class="ms-question-sign_wrap" v-text="item.tipText"></span>
                </span>
              </div>
            </th>
            <th class="ms-table_cell" v-if="actions">
              <div>
                <span>操作</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="ms-table_body" v-if="sortData.length">
          <tr v-for="(item, inx) in sortData">
            <td class="ms-table_cell" v-for="(subItem, key) in item" v-if="columnsKeys.indexOf(String(subItem.key))!== -1">{{subItem.value}}</td>
            <td class="ms-table_cell" v-if="actions">
              <slot name="others" :content="arr2Obj(item)" :index="inx"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="ms-table-body" v-if="!sortData.length">
      <div class="empty_data">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ms-table',
  props: {
    height: {
      type: [Number, String]
    },
    columns: {
      type: [Array],
      default: function () {
        return []
      }
    },
    data: {
      type: [Array],
      default: function () {
        return []
      }
    },
    actions: Boolean
  },
  data () {
    return {
      scrollThs: [],
      style: null,
      styleBody: null,
      filterKey: '',
      filterMethod: '',
      fixedHead: false
    }
  },
  computed: {
    columnsKeys () {
      return this.columns.map(function (i) {
        return i.key
      })
    },
    bodyData () {
      let data = this.data
      let columns = this.columns.map(function (i) {
        return i.key
      })
      let orderData = data.map(item => {
        let arr = []
        for (var x in item) {
          if (item.hasOwnProperty(x)) {
            var obj = {
              key: x,
              value: item[x]
            }
            arr.push(obj)
          }
        }
        return arr.sort(function (a, b) {
          if (columns.indexOf(a.key) === -1) {
            return 1
          }
          if (columns.indexOf(b.key) === -1) {
            return -1
          } else {
            return columns.indexOf(a.key) - columns.indexOf(b.key)
          }
        })
      })
      return orderData
    },
    sortData () {
      let key = this.filterKey
      let type = this.filterMethod
      let arr = JSON.parse(JSON.stringify(this.bodyData))
      if (typeof type === 'string') {
        type = type === 'desc' ? -1 : 1
      }
      let order = (type && type < 0) ? -1 : 1
      if (key) {
        arr.sort(function (a, b) {
          let val1 = a[key]['value']
          let val2 = b[key]['value']
          if (typeof (val1) === 'number') {
            val1 = parseFloat(val1)
            val2 = parseFloat(val2)
          }
          return val1 === val2 ? 0 : val1 > val2 ? order : -order
        })
      }
      return arr
    }
  },
  watch: {
    columns (newVal) {
      this.style = {}
      this.styleBody = {}
      if (newVal.length) {
        this.$nextTick(function () {
          this.computedStyle()
        })
      }
    },
    data (newVal) {
      if (!newVal.length) {
        this.style = {}
        this.styleBody = {}
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.columns.length) {
        this.computedStyle()
      }
      if (this.height) {
        let content = this.$refs.tableContent
        content.addEventListener('scroll', this.onScroll, false)
      }
      window.addEventListener('resize', this.onResize, false)
    })
  },
  methods: {
    arr2Obj (item) {
      let obj = {}
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
          let element = item[i]
          obj[element.key] = element.value
        }
      }
      return obj
    },
    handleSort (item) {
      this.filterKey = item.key
      var method = item.sortType === 'asc' ? 'desc' : 'asc'
      this.filterMethod = method
      item.sortType = method
    },
    computedStyle () {
      this.style = {}
      this.styleBody = {}
      let wrap = this.$refs.tableWrap
      let content = this.$refs.tableContent
      let table = this.$refs.tableMain
      let main = window.getComputedStyle(wrap, null).width
      let body = window.getComputedStyle(content, null).width
      let realW = window.getComputedStyle(table, null).width
      let arr = [main, body, realW]
      arr = arr.map((item) => {
        return Math.floor(item.replace('px', ''))
      })
      arr.sort(function (a, b) {
        return b - a
      })
      let mainW = Math.floor(main.replace('px', ''))
      let maxWidth = (arr[0] - mainW) > 200 ? arr[0] + 'px' : main
      this.style = {
        width: maxWidth
      }
      if (this.height) {
        this.styleBody = {
          width: maxWidth,
          height: this.height
        }
      } else {
        this.styleBody = {
          width: maxWidth
        }
      }
      // 计算td中的宽度
      // let trs = table.querySelector('.ms-table_body tr')
      // let tds = trs.querySelectorAll('td')
      // let arrTd = []
      // for (let i = 0; i < tds.length; i++) {
      //   let width = window.getComputedStyle(tds[i], null).width
      //   arrTd.push(width)
      // }
      // this.scrollThs = arrTd
    },
    onScroll () {
      let content = this.$refs.tableContent
      if (content.scrollTop) {
        this.fixedHead = true
      } else {
        this.fixedHead = false
      }
    },
    onResize () {
      let self = this
      let resizeTimer = null
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        if (self.columns.length) {
          self.computedStyle()
        }
      }, 100)
    }
  },
  beforeDestroy () {
    let content = this.$refs.tableContent
    content.removeEventListener('scroll', this.onScroll, false)
    window.removeEventListener('resize', this.onResize, false)
  }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  display: none;
}
.ms-table-wrap {
  position: relative;
  width: 100%;
  overflow-y: hidden;
	overflow-x: auto;
  background: #fff;
  table {
    width: 100%;
    font-size: 14px;
    background-color: #fff;
    text-align: center;
    border: 1px solid #e7e7eb;
    // border: none;
    // border-top: 1px solid #e7e7eb;
    // border-bottom: 1px solid #e7e7eb;
    border-spacing: 0;
    border-collapse: collapse;
    box-sizing: border-box;
  }
}
.ms-table-content {
  overflow-y: auto;
  overflow-x: hidden;
  .ms-table_cell {
    border-top: 1px solid #e7e7eb;
    border-right: 1px solid #e7e7eb;
    text-align: center;
    padding: 10px 8px;
    min-width: 150px;
    max-width: 150px;
    word-break:break-all;
    word-wrap: break-word;
  }
}
.ms-table-sort {
  display: inline-block;
  position: relative;
  width: 10px;
  height: 12px;
  margin-left: 4px;
  margin-top: -1px;
  vertical-align: middle;
  overflow: hidden;
  cursor: pointer;
  i {
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    color: #bbbec4;
    transition: color .2s ease-in-out;
    &.cur {
      border-color: transparent transparent #2d8cf0 transparent;
    }
    &:first-child {
      top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent #bbbec4 transparent;
    }
    &:last-child {
      bottom: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #bbbec4 transparent transparent transparent;
    }
    &.cur {
      &:first-child {
        border-bottom-color: #2d8cf0;
      }
      &:last-child {
        border-top-color: #2d8cf0;
      }
    }
  }
}
.ms-table-tips {
  position: relative;
  cursor: pointer;
  .ms-question-sign {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    background: #444;
    font-style: normal;
    overflow: hidden;
    vertical-align: middle;
  }
  .ms-question-sign_wrap {
    display: none;
    position: absolute;
    min-width: 200px;
    left: 50%;
    top: 20px;
    padding: 5px 10px;
    background: #000;
    border-radius: 3px;
    font-size: 12px;
    color: #fff;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    -webkit-transition: all 0.3s;
    transition: all .5s;
  }
  &:hover {
    .ms-question-sign_wrap {
      display: block;
    }
  }
}
.fixed-header {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
  transition: all 0.3s;
  background: #fff;
}
.empty_data {
  padding: 100px 0;
  text-align: center;
  font-size: 14px;
  color: #8d8d8d;
}
</style>
