<template lang="html">
  <div class="panel-center">
    <div>
      <ms-subheader>
        数据指标列表
      </ms-subheader>
      <div class="ms-form">
        <div class="ms-form-item">
          <i class="ion-ios-search size-24 vertical-m"></i>
          <input width="300" type="text" name="" v-model="filterKey" class="ms-form-input-text" placeholder="指标名称">
          <a class="ms-button ms-info" @click="newMetaData">新增</a>
        </div>
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" actions height="500px">
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
        title: 'ID',
        key: 'id'
      }, {
        title: '数据指标',
        key: 'name'
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
          return (item.name.indexOf(key) !== -1 || item.id.indexOf(key) !== -1)
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
    // 数据指标列表
    fetchMetaList () {
      api.getSuperFieldsList().then((res) => {
        res.superFileds.forEach((item) => {
          this.tableList.push(item)
        })
      })
    },
    editRow (item) {
      this.$router.push({ path: 'editCustomData',
        query: {
          id: item.id
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
        api.deleteSuperFields(id).then(res => {
          this.tableList.splice(index, 1)
          this.confirmVisible = false
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
          this.confirmVisible = false
        })
      }
    },
    newMetaData () {
      this.$router.push({ path: 'customDataQuota' })
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
