<template lang="html">
  <div class="panel-center">
    <div>
      <div class="ms-form">
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" height="500">
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
          title: '用户',
          key: 'name'
        }, {
          title: '权限',
          key: 'info'
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
        this.getTablePriv(id)
      },
      getTablePriv (id) {
        this.tableList = []
        api.getTablePriv(id).then((res) => {
          res.map((item) => {
            this.tableList.push(item)
          })
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
