<template>
  <div class="radio-wrap">
    <ms-subheader>
      数据库表信息
    </ms-subheader>
    <div class="radio-group" v-model="tabView">
      <span v-for="(tab ,index) in tabs" :class="{cur:iscur==index}" @click="iscur=index,tabChange('select' + (index + 1))">{{tab.name}}</span>
    </div>
    <component v-bind:is="tabView"></component>
  </div>
</template>

<script>
  import MsSubheader from '@/components/Subheader'
  import select1 from './DataTableBasicInfo'
  import select2 from './DataTableLineage'
  import select3 from './DataTableReverse'
  import select4 from './DataTableField'
  import select5 from './DataTablePer'
  export default {
    data () {
      return {
        tabView: 'select1',
        tabs: [{
          name: '基本信息'
        }, {
          name: '正向血缘'
        }, {
          name: '反向血缘'
        }, {
          name: '字段信息'
        }, {
          name: '权限'
        }],
        iscur: 0,
        id: ''
      }
    },
    methods: {
      tabChange (tab) {
        this.tabView = tab
      }
    },
    components: {
      select1,
      select2,
      select3,
      select4,
      select5,
      MsSubheader
    }
  }
</script>

<style lang="less">
  .radio-group{
    font-size:0;
    text-align: center;
    background: #fff;
    padding-top: 20px;
  }
  .radio-group>span{
    cursor:pointer;
    display:inline-block;
    font-size:16px;
    line-height:26px;
    text-align:center;
    width:100px;
    border: 1px solid #999;
    border-right: none;
  }
  .radio-group>span:nth-last-child(1) {
    border: 1px solid #999;
  }
  .cur{
    color:#fff;
    background-color: #5487de;
  }
</style>
