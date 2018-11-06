<template lang="html">
  <div class="panel-center">
    <div>
      <ms-subheader>基础指标列表</ms-subheader>
      <div class="ms-form">
        <div class="ms-form-item">
          <div class="ms-form-item-inline">
            <i class="ion-ios-search size-24 vertical-m"></i>
            <input width="300" type="text" name="" v-model="filterKey" class="ms-form-input-text" placeholder="指标名称">
          </div>
        </div>
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" actions height="400px">
            <template slot="others" scope="props">
              <a class="ms-button" @click="editRow(props.content)">编辑</a>
            </template>
          </ms-table>
        </div>
      </div>
      <ms-toast v-model="toastVisible" type="info" :text="toastText"></ms-toast>
    </div>
  </div>
</template>

<script>
import MsSubheader from '@/components/Subheader'
import MsTable from '@/components/Table/table'
import MsConfirm from '@/components/Modal/Confirm'
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/newMeta/database'
export default {
  data () {
    return {
      columns: [{
        title: '指标名称',
        key: 'name'
      }, {
        title: '数据库',
        key: 'dbName'
      }, {
        title: '数据表',
        key: 'dbTableName'
      }],
      tableList: [],
      filterKey: '',
      edit: false,
      detail: null,
      confirmVisible: false,
      toastVisible: false,
      toastText: '',
      deleteItem: null
    }
  },

  created () {
    this.fetchInit()
  },
  computed: {
    filterData () {
      let key = this.filterKey
      if (key) {
        return this.tableList.filter(item => {
          return (item.dbName.indexOf(key) !== -1 || item.dbTableName.indexOf(key) !== -1 || item.name.indexOf(key) !== -1)
        })
      } else {
        return this.tableList.slice()
      }
    }
  },
  methods: {
    fetchInit () {
      this.fetchMetaList()
    },
    // 基础指标数据列表
    fetchMetaList () {
      api.getBaseFieldList().then((res) => {
        res.baseFieldList.forEach((item) => {
          this.tableList.push(item)
        })
      })
    },
    editRow (item) {
      this.$router.push({ path: 'editMetaData',
        query: {
          dbName: item.dbName,
          dbTable: item.dbTableName
        }})
    }
  },
  components: {
    MsSubheader,
    MsTable,
    MsConfirm,
    MsToast
  }
}
</script>

<style lang="less">
</style>
