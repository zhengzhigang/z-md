<template>
<div class="user-permission-page page-center">
    <ms-subheader>用户权限</ms-subheader>
    <div class="panel-center">
        <div class="ms-card">
            <div class="ms-card-header">
                <div class="ms-form-item">
                    <div class="ms-form-label">选择用户：</div>
                    <div class="ms-form-input-block">
                        <ms-form-organization :organization="users" :value="user" @input="selectUser"></ms-form-organization>
                        <a class="user-refresh ms-button ms-info" @click="getUsersOptions">刷新</a>
                    </div>
                </div>
            </div>

            <div class="ms-card-body" v-if="userInfo">
                <div class="ms-form-item user-info">
                    <ms-subtitle>用户信息</ms-subtitle>
                    <ul>
                        <li>用户ID: {{ userInfo.id }}</li>
                        <li>用户名称: {{ userInfo.name }}</li>
                        <li>用户邮箱: {{ userInfo.mail }}</li>
                    </ul>
                </div>
            </div>

            <div v-else>
                <ms-empty>暂无数据</ms-empty>
            </div>
        </div>
        <div class="ms-card user-template" v-if="userInfo">
            <div class="ms-card-header">
                <ms-subtitle>可查看模板</ms-subtitle>
            </div>

            <div class="ms-card-body">
                <div class="ms-form-item clearfix">
                    <input type="text" class="ms-form-input-text"
                        v-model="name"
                        placeholder="输入模板名称搜索">
                    <div class="after">
                        <a class="ms-button ms-info" @click="createAction">新增</a>
                        <a class="ms-button ms-danger" v-show="selectTem.length" @click="removeMore">批量删除</a>
                    </div>
                </div>
                <div class="ms-form-item">
                    <div v-if="tranformTem.length === 0 && !adding">
                        <ms-empty>暂无数据</ms-empty>
                    </div>
                    <div class="template-table" v-else>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div class="checkbox" @click.stop="allCheck">
                                            <input type="checkbox" :checked="allChecked" />
                                        </div>
                                    </th>
                                    <th>模板ID</th>
                                    <th>模板名称</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="adding-row" v-if="adding">
                                    <td width="10%">
                                        <div class="checkbox">
                                            <input type="checkbox" disabled/>
                                        </div>
                                    </td>
                                    <td>
                                        <span>{{ newRow.id }}</span>
                                    </td>
                                    <td>
                                        <div class="create-table-tr" v-if="adding && allTemplates.length">
                                            <ms-form-organization
                                                :organization="allTemplates"
                                                :value="newRow.id"
                                                @input="rowSelectTem">
                                            </ms-form-organization>
                                        </div>
                                    </td>
                                    <td>
                                        <a class="edit-btn save" @click="addTem">保存</a>
                                        <a class="edit-btn remove" @click="cancelTem">取消</a>
                                    </td>
                                </tr>

                                <tr v-for="(t, inx) in tranformTem" :key="t.id">
                                    <td width="10%">
                                        <div class="checkbox" @click.stop="toggleCheck(t)">
                                            <input type="checkbox" :checked="t._checked" />
                                        </div>
                                    </td>
                                    <td>
                                        <span>{{ t.id }}</span>
                                    </td>
                                    <td>
                                        <span>{{ t.name }}</span>
                                    </td>
                                    <td>
                                        <a class="edit-btn remove" @click="removeTem(t, inx)">移除</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ms-toast v-model="toastVisible"
        :text="toastText"
        :type="toastType"></ms-toast>
</div>
</template>
<script>
import MsSubheader from '@/components/Subheader/index'
import MsSubtitle from '@/components/Subheader/Subtitle'
import MsTable from '@/components/Table/table'
import MsCheckbox from '@/components/Form/FormCheckbox'
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsEmpty from '@/components/Error/Empty'
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/permission'

export default {
  name: 'user-permission',
  components: {
    MsSubheader,
    MsSubtitle,
    MsTable,
    MsEmpty,
    MsCheckbox,
    MsToast,
    MsFormOrganization
  },
  data () {
    return {
      users: [
        {
          label: '选项1',
          value: 1
        },
        {
          label: '选项2',
          value: 2
        },
        {
          label: '选项3',
          value: 3
        }
      ],
      user: null,
      // 用户信息
      userInfo: null,
      // 搜索框
      name: '',
      templates: [],
      selectTem: [],
      allTemplates: [],
      newRow: {
        id: '',
        name: ''
      },
      // 状态区
      adding: false, // 正在添加中...
      allChecked: false,
      // toast弹框
      toastVisible: false,
      toastText: '',
      toastType: 'error'
    }
  },
  computed: {
    tranformTem () {
      let key = this.name
      let templates = this.templates
      if (key) {
        return templates.filter(t => {
          return t.name.indexOf(key) !== -1 || t.id.indexOf(key) !== -1
        })
      }
      return templates
    }
  },
  watch: {
    selectTem (curr, prev) {
      this.templates = this.updateList(this.templates, curr)
      let n1 = curr.length
      let n2 = this.templates.length
      if (n1 && n2 && n1 % n2 === 0) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    }
  },
  created () {
    this.getUsersOptions()
  },
  methods: {
    selectUser (userId) {
      if (userId === '') return false
      this.user = userId
      api.userInfo(userId).then(res => {
        this.userInfo = res.userInfo
        this.templates = res.templates.map(({ id, name }) => ({
          id,
          name,
          _checked: false
        }))
        // 清空先前的模板数据
        this.clearTemplates()
      })
    },
    getUsersOptions () {
      api.users().then(res => {
        this.users = res.organization
      })
    },
    // 清空模板数据
    clearTemplates () {
      this.allChecked = false
      this.selectTem = []
    },
    // 全选操作
    allCheck () {
      this.allChecked = !this.allChecked
      if (this.allChecked) {
        this.selectTem = this.templates.map(t => t.id)
      } else {
        this.selectTem = []
      }
    },
    toggleCheck (t) {
      let selectTem = this.selectTem
      let inx = selectTem.indexOf(t.id)
      if (t._checked) {
        if (inx !== -1) {
          selectTem.splice(inx, 1)
        }
      } else {
        if (inx === -1) {
          selectTem.push(t.id)
        }
      }
    },
    updateList (lists, tags) {
      if (!Array.isArray(lists)) return []
      if (!Array.isArray(tags)) return []
      if (!lists.length) return []
      return lists.map(function (l) {
        l._checked = tags.indexOf(l.id) !== -1
        return l
      })
    },
    createAction () {
      if (this.adding) return
      this.adding = true
      // 获取模板
      api.getTemplates().then(res => {
        this.allTemplates = res.templateList.map(({ id, name }) => ({
          value: id,
          label: name
        }))
      })
    },
    rowSelectTem (t, item) {
      let selectTem = this.allTemplates.filter(i => i.value === t)
      this.newRow = { id: selectTem[0].value, name: selectTem[0].label }
    },
    addTem () {
      let { id, name } = this.newRow
      if (!name) {
        this.showToast('请选择模板名称')
        return false
      }
      // 新增接口
      let data = {
        templateId: id,
        userId: this.user
      }
      api.addTemplate(data).then(res => {
        this.templates = res.templates.map(({ id, name }) => ({
          id,
          name,
          _checked: false
        }))
        this.adding = false
      })
    },
    cancelTem () {
      this.adding = false
      this.newRow = { id: '', name: '' }
    },
    removeTem (t, inx) {
      // 移除接口
      let data = {
        templateIds: [t.id],
        userId: this.user
      }
      api.removeTemplate(data).then(res => {
        this.templates = res.templates.map(({ id, name }) => ({
          id,
          name,
          _checked: false
        }))
        this.selectTem = []
      })
    },
    removeMore () {
      let selectTem = this.selectTem
      // 移除接口
      let data = {
        templateIds: selectTem,
        userId: this.user
      }
      api.removeTemplate(data).then(res => {
        this.templates = res.templates.map(({ id, name }) => ({
          id,
          name,
          _checked: false
        }))
        this.selectTem = []
        this.allChecked = false
      })
    },
    showToast (text, type = 'error', show = true) {
      this.toastText = text
      this.toastVisible = show
      this.toastType = type
    }
  }
}
</script>

<style lang="less">
.user-permission-page {
  .ms-card {
    padding: 16px 0;
    background: #fff;
    &-body {
      padding: 16px;
    }
  }
  .user-refresh {
    margin-left: 32px;
  }
  .user-info {
    ul {
      display: flex;
      padding: 16px;
    }
    li {
      padding: 8px 16px;
      flex: 1;
    }
  }

  .user-template {
    .after {
      float: right;
    }
  }

  .template-table {
    table {
      width: 100%;
      background: #fafafa;
    }
    th,
    td {
      text-align: center;
      transition: background 0.3s ease;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      border-bottom: 1px solid #e8e8e8;
      padding: 16px;
      word-break: break-all;
      transition: all 0.3s;
    }
    .checkbox {
      cursor: pointer;
      position: relative;
      input {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 16px;
        height: 16px;
      }
    }
    .edit-btn {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
