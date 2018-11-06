<template lang="html">
  <div class="panel-center">
    <ms-subheader>模板权限</ms-subheader>
    <div class="ms-bread">
      <router-link :to="{ path: 'templateList'}">模板列表</router-link> >
      <a>模板权限</a>
    </div>
    <div class="ms-form">
      <ms-subtitle>该模板已绑定的用户<a class="ms-button ms-info" @click="addUser">新增</a></ms-subtitle>
      <div class="ms-list-items">
        <div class="ms-list-item" v-for="(item, inx) in templateUser">
          <div class="user">
            <div class="user-content">
              {{item.label}}
            </div>
            <div class="user-meta">
              <a class="ms-button ms-danger" @click="deleteUser(inx)">删除</a>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-actions">
        <div class="ms-row">
          <div class="ms-col-24">
            <a class="ms-button ms-success" :disabled="!templateUser.length" @click="saveAction">保存</a>
          </div>
        </div>
      </div>
    </div>
    <ms-dialog v-if="dialogVisible"  v-model="dialogVisible" width="500" title="新增模板用户" scroll-area="300" @confirm-success="saveAddUser">
      <div class="ms-form-item ms-row">
        <div class="ms-col-24">
          <span>可选择的用户: </span>
          <div class="ms-form-input-inline">
            <ms-form-multiple-select  :organization="users" hint="选择用户" :value="currUser" @input="changeUser" :custom-style="{ width: '400px' }"></ms-form-multiple-select>
          </div>
        </div>
      </div>
    </ms-dialog>
    <ms-confirm v-model="confirmVisible" @confirm-success="confirmDelete">
      <p>确定删除吗？</p>
    </ms-confirm>
    <ms-toast v-model="toastVisible" :type="toastType" :text="toastText" top="20"></ms-toast>
  </div>
</template>

<script>
import MsSubheader from '@/components/Subheader/index'
import MsSubtitle from '@/components/Subheader/Subtitle'
import MsFormMultipleSelect from '@/components/Form/FormMultipleSelect'
import MsConfirm from '@/components/Modal/Confirm'
import MsDialog from '@/components/Modal/Dialog'
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/newMeta/database'
export default {
  data () {
    return {
      // 数据源部分
      users: [],
      currUser: null,
      cacheUsers: null,
      templateUser: [],
      // 弹框类
      dialogVisible: false,
      confirmVisible: false,
      toastVisible: false,
      toastText: '',
      toastType: 'error',
      deleteIndex: 0
    }
  },
  created () {
    this.fetchInit()
  },
  methods: {
    fetchInit () {
      this.fetchUserList()
      this.fetchTemplateUser()
    },
    fetchUserList () {
      let query = this.$route.query
      api.getUserList(query.id).then(res => {
        this.users = res.organization
      })
    },
    fetchTemplateUser () {
      let query = this.$route.query
      api.getTemplateUser(query.id).then(res => {
        this.templateUser = res.organization
      }).catch(error => {
        this.toastVisible = true
        this.toastText = error.msg
      })
    },
    changeUser (user, ends) {
      this.currUser = user
      let templateUser = this.templateUser.map(i => i)
      let addUser = ends.map(i => {
        return {
          value: i.value,
          label: i.label
        }
      })
      this.cacheUsers = templateUser.concat(addUser)
    },
    addUser () {
      this.dialogVisible = true
      this.currUser = []
    },
    saveAddUser () {
      // 数组去重
      let hash = {}
      let cacheUsers = this.cacheUsers
      cacheUsers = cacheUsers.reduce(function (item, next) {
        hash[next.value] ? '' : hash[next.value] = true && item.push(next)
        return item
      }, [])
      this.templateUser = cacheUsers
      // 关闭弹窗
      this.dialogVisible = false
    },
    deleteUser (inx) {
      this.confirmVisible = true
      this.deleteIndex = inx
    },
    confirmDelete () {
      let deleteIndex = this.deleteIndex
      this.templateUser.splice(deleteIndex, 1)
      this.confirmVisible = false
    },
    saveAction () {
      let users = this.templateUser.map(i => i.value)
      let id = this.$route.query.id
      let param = { id, users }
      api.saveTemplateUser(param).then(res => {
        this.toastVisible = true
        this.toastText = '保存成功'
        this.toastType = 'info'
      }).catch(error => {
        this.toastVisible = true
        this.toastText = error.msg
      })
    }
  },
  components: {
    MsSubheader,
    MsSubtitle,
    MsFormMultipleSelect,
    MsConfirm,
    MsDialog,
    MsToast
  }
}
</script>

<style lang="less">
.user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(81, 130, 228, 0.1);
  &-content {
    width: 80%;
    display: inline-flex;
    text-align: center;
  }
}
</style>
