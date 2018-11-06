<template lang="html">
  <div class="panel-center">
    <div>
      <div class="ms-form">
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" :height="500">
          </ms-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MsTable from '@/components/Table/table'
  import * as api from '@/api/newMeta/database'
  export default {
    data () {
      return {
        columns: [{
          title: '表名',
          key: 'table_name'
        }, {
          title: '业务名称',
          key: 'bussiness_name'
        }, {
          title: '存储地址',
          key: 'storage_path'
        }, {
          title: '创建时间',
          key: 'create_time'
        }, {
          title: '最后修改时间',
          key: 'last_updated_time'
        }, {
          title: '分区数',
          key: 'partition_num'
        }, {
          title: '创建者',
          key: 'create_user'
        }],
        tableList: [],
        filterKey: ''
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
        this.getTableInfo(id)
      },
      getTableInfo (id) {
        this.tableList = []
        api.getTableInfo(id).then((res) => {
          this.tableList.push(res)
        })
      }
    },
    components: {
      MsTable
    }
  }
</script>

<style lang="less">
</style>
