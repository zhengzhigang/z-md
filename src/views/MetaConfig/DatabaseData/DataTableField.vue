<template lang="html">
  <div class="panel-center">
    <div>
      <div class="ms-form">
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" height="500">
          </ms-table>
          <Pagination v-if="total>0" :length="total" :value="active" @input="pageBar"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MsTable from '@/components/Table/table'
  import Pagination from '@/components/Pagination/index'
  import * as api from '@/api/newMeta/database'
  export default {
    data () {
      return {
        columns: [{
          title: '表名',
          key: 'table_name'
        }, {
          title: '字段名',
          key: 'column_name'
        }, {
          title: '详细信息',
          key: 'comment'
        }, {
          title: '更新',
          key: 'update_time'
        }],
        tableList: [],
        filterKey: '',
        total: 0,
        active: 1
      }
    },

    watch: {
      '$route': 'onRoute'
    },
    created () {
      this.onRoute()
    },
    computed: {
      filterData () {
        let key = this.filterKey
        if (key) {
          return this.tableList.filter((item) => {
            return (item.name.indexOf(key) !== -1 || item.id.indexOf(key) !== -1)
          })
        } else {
          return this.tableList.slice(0)
        }
      }
    },
    methods: {
      onRoute () {
        let id = this.id = this.$route.params.id
        this.getTableField(id)
      },
      getTableField (id) {
        var param = {id: id, num: 1}
        this.tableList = []
        api.getTableField(param).then((res) => {
          this.total = res.total
          res.data.map((item) => {
            this.tableList.push(item)
          })
        })
      },
      pageBar (item) {
        var param = {id: this.id, num: item}
        this.active = item
        this.tableList = []
        api.getTableField(param).then((res) => {
          res.data.map((item) => {
            this.tableList.push(item)
          })
        })
      }
    },
    components: {
      MsTable,
      Pagination
    }
  }
</script>

<style lang="less">
</style>
