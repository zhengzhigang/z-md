<template lang='html'>
  <div class='panel-center'>
    <div>
      <div class='ms-form'>
        <div class='ms-form-item'>
          <div ref="main" style="width: 100%;min-height: 600px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/newMeta/database'
  import echarts from 'echarts'
  export default {
    data () {
      return {
        id: '',
        tableList: {},
        option: {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: '#20a0ff',
            formatter: '{b}'
          },
          series: [
            {
              type: 'tree',
              data: [],
              top: '1%',
              left: '15%',
              bottom: '1%',
              right: '15%',
              symbol: 'rect',
              symbolSize: [18, 12],
              label: {
                show: false,
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left',
                  fontSize: 12,
                  color: '#333'
                }
              },
              leaves: {
                label: {
                  normal: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right'
                  }
                },
                itemStyle: {
                  borderColor: '#20a0ff',
                  backgroundColor: '#b6d1ff',
                  borderWidth: 2
                }
              },
              expandAndCollapse: false,
              animationDuration: 550,
              animationDurationUpdate: 750,
              orient: 'RL'
            }
          ]
        }
      }
    },
    watch: {
      '$route': 'onRoute',
      tableList (newVal) {
        this.option.series[0].data[0] = this.tableList
      }
    },
    mounted () {
      this.onRoute()
    },
    methods: {
      traverseList (arr, param, children, myChart) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === param.id && !param.data.sign) {
            if (!arr[i].children) {
              arr[i].children = children
            } else {
              arr[i].children = undefined
            }
            myChart.setOption(this.option)
            break
          }
          if (arr[i].children) {
            this.traverseList(arr[i].children, param, children, myChart)
          }
        }
      },
      onRoute () {
        this.tableList = {
          value: this.$route.params.id,
          name: this.$route.query.title,
          id: this.guid()
        }
        this.createTree()
      },
      createTree () {
        let _this = this
        let chart = this.$refs.main
        chart.removeAttribute('_echarts_instance_')
        let myChart = echarts.init(chart)
        myChart.on('click', clickFun)
        echarts.util.each(this.tableList.children, function (datum, index) {
          index % 2 === 0 && (datum.collapsed = true)
        })
        this.option.series[0].data[0] = this.tableList
        myChart.setOption(this.option)
        if (this.option && typeof this.option === 'object') {
          myChart.setOption(this.option, true)
        }
        function clickFun (param) {
          if (typeof param.seriesIndex === 'undefined') {
            return
          }
          if (param.type === 'click') {
            api.getTableReverse(param.value).then((res) => {
              let children
              if (res.length === 0) {
                return
              }
              children = res.map((item) => {
                return {
                  name: item.table_name,
                  value: item.table_id,
                  sign: item.table_id === param.value,
                  id: _this.guid()
                }
              })
              if (_this.tableList.id === param.id) {
                if (!_this.tableList.children) {
                  _this.tableList.children = children
                } else {
                  _this.tableList.children = undefined
                }
                myChart.setOption(_this.option)
              } else {
                _this.traverseList(_this.tableList.children, param, children, myChart)
              }
            })
          }
        }
      },
      S4 () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      },
      guid () {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      }
    }
  }
</script>

<style lang='less'>
</style>
