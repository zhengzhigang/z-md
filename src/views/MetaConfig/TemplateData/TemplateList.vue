<template lang="html">
  <div class="panel-center">
    <div>
      <ms-subheader>
        模板列表
      </ms-subheader>
      <div class="ms-form">
        <div class="ms-form-item">
          <i class="ion-ios-search size-24 vertical-m"></i>
          <input width="300" type="text" name="" v-model="filterKey" class="ms-form-input-text" placeholder="模板名">
          <a class="ms-button ms-info" @click="newMetaData">新增</a>
        </div>
        <div class="ms-form-item">
          <ms-table :columns="columns" :data="filterData" actions>
            <template slot="others" scope="props">
              <a class="ms-button" @click="editRow(props.content)">编辑</a>
              <a class="ms-button ms-danger" @click="deleteRow(props.content, props.index)">删除</a>
              <a class="ms-button ms-success" @click="editRole(props.content)">权限</a>
              <a class="ms-button ms-info" @click="cloneRole(props.content)">克隆</a>
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
        title: '模板ID',
        key: 'id'
      }, {
        title: '模板名',
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
          return (item.id.indexOf(key) !== -1 || item.name.indexOf(key) !== -1)
        })
      } else {
        return this.tableList.slice(0)
      }
    }
  },
  methods: {
    fetchInit () {
      this.fetchTemplateList()
    },
    // 模板列表
    fetchTemplateList () {
      api.getTemplateList().then((res) => {
        res.templateList.forEach((item) => {
          this.tableList.push(item)
        })
      })
    },
    editRow (item) {
      this.$router.push({ path: 'editTemplate',
        query: {
          id: item.id
        }})
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
        api.deleteTemplateList(id).then(res => {
          this.tableList.splice(index, 1)
          this.confirmVisible = false
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
        })
      }
    },
    newMetaData () {
      this.$router.push({ path: 'newTemplate' })
    },
    editRole (item) {
      this.$router.push({ path: 'roleTemplate',
        query: {
          id: item.id
        }})
    },
    cloneRole (item) {
      let id = item.id
      api.cloneTemplateList(id).then(res => {
        this.fetchTemplateList()
      }).catch(error => {
        this.toastVisible = true
        this.toastText = error.msg
      })
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
