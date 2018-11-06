<template lang="html">
  <div class="panel-center">
    <div>
      <ms-subheader>数据表列表</ms-subheader>
      <div class="ms-form">
        <div class="ms-form-item">
          <div class="ms-form-item-inline">
            <i class="ion-ios-search size-24 vertical-m"></i>
            <input width="300" type="text" name="" v-model="filterKey" class="ms-form-input-text" placeholder="数据表名">
            <a class="ms-button ms-info" @click="newMetaData">新增</a>
          </div>
        </div>
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" actions height="400px">
            <template slot="others" scope="props">
              <a class="ms-button" @click="editRow(props.content)">编辑</a>
              <a class="ms-button ms-danger" @click="deleteRow(props.content, props.index)">删除</a>
            </template>
          </ms-table>
        </div>
      </div>
      <ms-confirm v-model="confirmVisible" @confirm-success="deleteMetaList">
        <p>确定要删除吗?</p>
      </ms-confirm>
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
        return this.tableList.filter((item) => {
          return (item.dbName.indexOf(key) !== -1 || item.dbTableName.indexOf(key) !== -1)
        })
      } else {
        return this.tableList.slice(0)
      }
    }
  },
  methods: {
    fetchInit () {
      this.fetchMetaList()
    },
    // 元数据列表
    fetchMetaList () {
      api.getMetaTable().then((res) => {
        res.metaList.forEach((item) => {
          this.tableList.push(item)
        })
      })
    },
    editRow (item) {
      this.$router.push({
        path: 'editMetaData',
        query: {
          dbName: item.dbName,
          dbTable: item.dbTableName
        }
      })
    },

    deleteRow (item, index) {
      this.confirmVisible = true
      this.deleteItem = {
        index: index,
        content: item
      }
    },
    deleteMetaList () {
      if (this.tableList.length) {
        let id = this.deleteItem.content.id
        let index = this.deleteItem.index
        api.deleteMetaList(id).then(res => {
          this.tableList.splice(index, 1)
          this.confirmVisible = false
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
        })
      }
    },
    newMetaData () {
      this.$router.push({ path: 'newMetaData' })
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
