<template lang="html">
  <div class="panel-center">
    <div>
      <ms-subheader>
        筛选器列表
      </ms-subheader>
      <div class="ms-form">
        <div class="ms-form-item">
          <i class="ion-ios-search size-24 vertical-m"></i>
          <input width="300" type="text" name="" v-model="filterKey" class="ms-form-input-text" placeholder="筛选器名称">
          <a class="ms-button ms-info" @click="createNewFilter">新增</a>
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
      <ms-confirm v-model="confirmVisible" @confirm-success="deleteFilterList">
        <p>确定要删除吗?</p>
      </ms-confirm>
      <ms-toast v-model="toastVisible" type="info" :text="toastText"></ms-toast>
      <ms-dialog title="新建筛选器" 
        v-model="dialogVisible" 
        :width="500" 
        v-if="dialogVisible"
        @confirm-success="saveFilter">
        <div class="ms-form-item">
          <h3>名称</h3>
          <input type="text" class="ms-form-input-text" v-model="editItem.name">
        </div>
        <div class="ms-form-item">
          <h3>控件类型</h3>
          <ms-form-organization :organization="newfilter.types" v-model="editItem.type" :custom-style="{ width: '400px' }"></ms-form-organization>
        </div>
        <div class="ms-form-item">
          <h3>实现类</h3>
          <ms-form-organization :organization="newfilter.implyClasses" v-model="editItem.implyClass" :custom-style="{ width: '400px' }"></ms-form-organization>
        </div> 
      </ms-dialog>
    </div>
  </div>
</template>

<script>
import MsSubheader from '@/components/Subheader'
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsTable from '@/components/Table/table'
import MsConfirm from '@/components/Modal/Confirm'
import MsDialog from '@/components/Modal/Dialog'
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/custom-filter.js'
export default {
  data () {
    return {
      columns: [{
        title: '名称',
        key: 'name'
      }, {
        title: '控件类型',
        key: 'type'
      }, {
        title: '实现类',
        key: 'implyClass'
      }],
      tableList: [],
      filterKey: '',
      edit: false,
      editItem: null,
      confirmVisible: false,
      deleteItem: null,
      // 组件详情
      dialogVisible: false,
      newfilter: {
        types: [],
        implyClasses: []
      },
      toastVisible: false,
      toastText: ''
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
      this.fetchFilterList()
      this.fetchFilterComponents()
    },
    // 新建筛选器table列表
    fetchFilterList () {
      api.getFilterList().then(res => {
        let customFilters = res.customFilters
        if (customFilters && customFilters.length > 0) {
          this.tableList = [...customFilters]
        }
      })
    },
    // 筛选器组件列表
    fetchFilterComponents () {
      api.getFilterComponents().then((res) => {
        this.newfilter = res
      })
    },

    editRow (item) {
      let params = {
        id: item.id || ''
      }
      this.dialogVisible = true
      api.editFilter(params).then(res => {
        this.editItem = res
      }).catch(error => {
        this.toastVisible = true
        this.toastText = error.msg
      })
    },

    deleteRow (item, index) {
      this.confirmVisible = true
      this.deleteItem = {
        index: index,
        content: item
      }
    },
    deleteFilterList () {
      if (this.tableList.length) {
        let id = this.deleteItem.content.id
        let index = this.deleteItem.index
        let params = {
          id
        }
        api.deleteFilter(params).then(res => {
          this.tableList.splice(index, 1)
          this.confirmVisible = false
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
          this.confirmVisible = false
        })
      }
    },
    createNewFilter () {
      this.dialogVisible = true
      this.editItem = {
        id: '',
        name: '',
        typel: '',
        implyClass: ''
      }
    },
    saveFilter () {
      let editItem = this.editItem
      if (editItem) {
        if (!editItem.name) {
          this.toastVisible = true
          this.toastText = '名称不能为空'
          return
        }
        if (!editItem.type) {
          this.toastVisible = true
          this.toastText = '控件类型不能为空'
          return
        }
        if (!editItem.implyClass) {
          this.toastVisible = true
          this.toastText = '实现类不能为空'
          return
        }
      }
      let params = editItem
      api.saveFilter(params).then(res => {
        this.toastVisible = true
        this.toastText = res.msg
        this.dialogVisible = false
        // 刷新列表
        this.fetchFilterList()
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
    MsToast,
    MsDialog,
    MsFormOrganization
  }
}
</script>

<style lang="less">
</style>
