import MsFormRadio from '@/components/Form/FormRadio'
import MsSubheader from '@/components/Subheader'
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsFormMultipleSelect from '@/components/Form/FormMultipleSelect'
import MsFormInputText from '@/components/Form/FormInputText'
import MsDialog from '@/components/Modal/Dialog'
import MsConfirm from '@/components/Modal/Confirm'
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/newMeta/database'
import {
  isEmptyProp
} from '@/utils/help'
export default {
  components: {
    MsSubheader,
    MsFormOrganization,
    MsFormMultipleSelect,
    MsDialog,
    MsConfirm,
    MsToast,
    MsFormInputText,
    MsFormRadio
  },
  data () {
    return {
      id: '',
      // 数据指标
      basicName: '',
      basicExpression: '',
      // 弹框类
      dialogVisible: false,
      toastVisible: false,
      toastText: '',
      toastType: 'error',
      hasRepeatRelation: false,
      lockDialogBtn: false,
      editingBase: false,
      editingBaseIndex: 0,
      tableType: 1,
      dateFormater: 'yyyy-MM-dd',
      sqlContent: '',
      showTip: false,
      tipKey: ''
    }
  },
  computed: {
    filterFields () {
      let key = this.tipKey
      if (key) {
        return this.dbTableFields.filter(i => i.label.indexOf(key) !== -1)
      } else {
        return this.dbTableFields
      }
    }
  },
  watch: {
    dialogVisible (newVal) {
      if (!newVal) {
        this.editingBase = newVal
      }
    }
  },
  methods: {
    addToExp (item) {
      this.basicExpression += item.label
    },
    relationValidate (val, key, item) {
      let relations = this.relationList.slice(0)
      let hasRelation = relations.filter(item => {
        return (item.filter === val || item.dbColunm === val)
      }).length
      this.hasRepeatRelation = hasRelation > 1
      if (hasRelation > 1) {
        this.toastText = '筛选条件有重复项'
        this.toastVisible = true
      }
    },
    changeRelation (val, key, item) {
      let relations = this.relationList.slice(0)
      // 是否存在关联关系
      item[key] = val
      if (val && relations.length > 1) {
        this.relationValidate(val, key, item)
      }
    },
    addFilter (item) {
      if (this.hasRepeatRelation) {
        this.toastText = '筛选条件有重复项'
        this.toastVisible = true
        return
      }
      // 为空
      if (isEmptyProp(item)) {
        this.toastText = '请确保筛选条件不能为空'
        this.toastVisible = true
        return
      }
      // 不为空
      let relationList = this.relationList
      let addItem = {
        dbColunm: '',
        filter: ''
      }
      relationList.push(addItem)
    },
    deleteFilter (index) {
      if (this.relationList.length > 1) {
        this.relationList.splice(index, 1)
        let relations = this.relationList.slice(0)
        let len = relations.filter(item => {
          return (item.filter === relations[index]['filter'] || item.dbColunm === relations[index]['dbColunm'])
        }).length
        this.hasRepeatRelation = len > 1
      }
    },
    // 新建基础指标
    addBaseQuata () {
      if (!this.seletedDb) {
        this.toastText = '数据库不能为空'
        this.toastVisible = true
        return
      }
      if (!this.seletedDbTable) {
        this.toastText = '数据表不能为空'
        this.toastVisible = true
        return
      }
      this.dialogVisible = true
      this.basicName = ''
      this.basicExpression = ''
      this.editingBase = false
    },
    saveBaseQuata () {
      if (!this.basicName) {
        this.toastText = '指标名字不能为空'
        this.toastVisible = true
        return
      }
      if (!this.basicExpression) {
        this.toastText = '求值表达式不能为空'
        this.toastVisible = true
        return
      }
      if (this.lockDialogBtn) return
      this.lockDialogBtn = true
      let param = {
        dbName: this.seletedDb,
        dbTable: this.seletedDbTable,
        name: this.basicName,
        dbColunm: this.basicExpression
      }

      // 验证指标名称是否重复接口
      api.validateBaseFieldName(param).then(res => {
        // 编辑基础指标数据
        if (this.editingBase) {
          this.basicFields.splice(this.editingBaseIndex, 1, {
            name: this.basicName,
            dbColunm: this.basicExpression
          })
        } else {
          this.basicFields.push({
            name: this.basicName,
            dbColunm: this.basicExpression
          })
        }
        this.dialogVisible = false
        this.lockDialogBtn = false
      }).catch(error => {
        this.lockDialogBtn = false
        this.toastText = error.msg
        this.toastVisible = true
      })
    },
    editBasic (item, inx) {
      this.addBaseQuata()
      this.editingBase = true
      this.editingBaseIndex = inx
      this.basicName = item.name
      this.basicExpression = item.dbColunm
    },
    deleteBasic (item, index) {
      if (this.basicFields.length) {
        this.basicFields.splice(index, 1)
      }
    },
    getQueryParam () {
      let param = {}
      if (!this.seletedDb) {
        this.toastText = '数据库不能为空'
        this.toastVisible = true
        return false
      }
      if (!this.seletedDbTable) {
        this.toastText = '数据表不能为空'
        this.toastVisible = true
        return false
      }
      param = {
        id: this.id,
        dbName: this.seletedDb,
        dbTable: this.seletedDbTable,
        dbTableWeek: this.selectedDbTableWeek,
        dbTableMonth: this.selectedDbTableMonth,
        filters: this.relationList,
        extraSql: this.extraSql,
        basicFields: this.basicFields,
        tableType: this.tableType,
        dateField: this.dateField,
        dateFormater: this.dateFormater
      }
      return param
    },
    saveAction () {
      let param = this.getQueryParam()
      if (param) {
        // 保存接口
        api.saveRelation(param).then((res) => {
          this.toastText = '保存成功'
          this.toastVisible = true
          this.toastType = 'info'
          setTimeout(() => {
            this.$router.push({
              path: 'metaDataList'
            })
          }, 1000)
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
        })
      }
    },
    printAction () {
      let param = this.getQueryParam()
      if (param) {
        api.printSql(param).then(res => {
          this.sqlContent = res.sql
        }).catch(error => {
          this.toastVisible = true
          this.toastText = error.msg
        })
      }
    }
  }
}
