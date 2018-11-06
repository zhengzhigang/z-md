import MsSubheader from '@/components/Subheader/index'
import MsSubtitle from '@/components/Subheader/Subtitle'
import MsTable from '@/components/Table/table'
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsFormMultipleSelect from '@/components/Form/FormMultipleSelect'
import MsFormRadio from '@/components/Form/FormRadio'
import MsDialog from '@/components/Modal/Dialog'
import MsConfirm from '@/components/Modal/Confirm'
import MsToast from '@/components/Modal/Toast'
import MsFilter from '@/views/MetaConfig/components/filter'
import CompositeItem from './compositeItem'
import * as api from '@/api/newMeta/database'
import MsLoader from '@/components/Loader'
export default {
  components: {
    MsSubheader,
    MsSubtitle,
    MsTable,
    MsFormOrganization,
    MsFormMultipleSelect,
    MsFormRadio,
    MsDialog,
    MsConfirm,
    MsToast,
    MsFilter,
    CompositeItem,
    MsLoader
  },

  data () {
    return {
      switchFilter: false,
      loader: false,
      id: '',
      // 弹框
      dialogVisible: false,
      toastVisible: false,
      toastText: '',
      toastType: 'error',
      confirmVisible: false,
      // 数据源部分
      baseFields: [], // 数据指标
      sTimeSource: [], // 开始日期
      eTimeSource: [], // 结束日期
      globalFields: [], // 分组字段
      aggregationTypes: [], // 聚合类型
      templateFilters: [], // 模板筛选器
      compositeColumns: [],
      // 选择值部分
      templateName: '', // 模板名字
      superFields: [],
      rowsFields: [],
      globalGroup: [], // 全局字段
      groups: [], // 本地字段
      rowKey: [
        {
          label: '行组',
          value: 'rowMainKey'
        }
      ],
      compositeFields: [],
      compositeRowGroup: [],
      extraSource: [],
      extraLabel: [],
      showFilters: 0,
      showGroupField: 0,
      showTimeUnit: 0,
      dateType: 'single',
      timeUnit: 0,
      // 关联商务
      relationBusiness: [],
      relationBusinessGroup: [],
      // 展示筛选器
      displayFilterOrg: [],
      displayFilter: [],
      // 展示分组选项
      displayGroupOrg: [],
      displayGroup: [],
      // 权限启用
      permissionUse: {
        on: '',
        business: '',
        businessGroup: ''
      },
      // 表格
      tableHead: [],
      tableData: []
    }
  },

  computed: {
    compositeGroups () {
      let arr = []
      let rowsFields = this.rowsFields
      if (rowsFields.length > 0) {
        for (var i = 0; i < rowsFields.length; i++) {
          let item = rowsFields[i]
          if (item.rowName) {
            arr.push({
              label: item.rowName,
              value: item.rowName
            })
          }
        }
      }
      return arr
    }
  },

  methods: {
    toggleFilter () {
      this.switchFilter = !this.switchFilter
    },

    // 获取数据指标数据源
    fetchSuperFields () {
      api.getSuperFields().then(res => {
        this.baseFields = [...res.organization]
      })
    },

    fetchDateList () {
      api.getDateList().then(res => {
        this.sTimeSource = [...res.start]
        this.eTimeSource = [...res.end]
      })
    },

    // 根据数据指标获得筛选器和分组数据
    fetchTemplateFilters (val) {
      api.getTemplateFilters(val).then(res => {
        this.templateFilters = []
        this.globalFields = []
        this.aggregationTypes = []
        // 筛选器
        this.templateFilters = [...res.filters]
        // 分组数据
        this.globalFields = [...res.groupKeys]
        // 聚合类型
        this.aggregationTypes = [...res.aggFuncs]
        let filters = JSON.parse(JSON.stringify(this.templateFilters))
        this.fixedRowsFields(filters)
        // 展示筛选器和分组字段
        this.displayFilterOrg = [...res.groupKeys]
        this.displayGroupOrg = [...res.groupKeys]
      })
    },

    // 选择指标改变后，重新组装行组数据，渲染分组
    fixedRowsFields (filters) {
      this.rowsFields = []
      let rowItem = {
        rowName: '',
        startTime: '',
        endTime: '',
        filters: filters,
        localGroup: [{
          label: '行组',
          value: 'rowMainKey'
        }],
        customDate: false,
        aggFunc: '' // 选择聚合类型
      }
      this.rowsFields = [...[rowItem]]
    },

    deleteColumn (inx) {
      this.rowsFields.splice(inx, 1)
    },

    deleteChip (item, index) {
      item.splice(index, 1)
    },

    deleteKey (item, inx) {
      this.rowKey.splice(inx, 1)
    },

    toggleDate (items, inx) {
      let item = items[inx]
      item.startTime = ''
      item.endTime = ''
      item.customDate = !item.customDate
      items[inx] = item
    },

    // 添加行组
    addRow () {
      if (!this.emptyFilter()) return
      let filters = JSON.parse(JSON.stringify(this.templateFilters))
      let localGroup = [
        {
          label: '行组',
          value: 'rowMainKey'
        },
        ...this.groups.slice(0)
      ]
      let rowItem = {
        rowName: '',
        startTime: '',
        endTime: '',
        filters: filters,
        localGroup: localGroup,
        customDate: false,
        aggFunc: '' // 选择聚合类型
      }
      this.rowsFields.push(rowItem)
    },

    clearSuperForm () {
      this.rowsFields = []
      this.compositeFields = []
      this.globalFields = []
      this.globalGroup = []
      this.rowKey = [{
        label: '行组',
        value: 'rowMainKey'
      }]
      // 清空筛选器和分组字段
      this.displayFilterOrg = []
      this.displayFilter = []
      this.displayGroupOrg = []
      this.displayGroup = []
    },

    changeGlobal (items, endItems) {
      // 改变筛选条件和表格键的值
      this.globalGroup = items
      this.groups = endItems
      this.rowKey = [{
        label: '行组',
        value: 'rowMainKey'
      }]
      if (endItems.length) {
        endItems.forEach(item => {
          this.rowKey.push(item)
        })
      }
      this.rowsFields = this.rowsFields.map(item => {
        let arr = [
          {
            label: '行组',
            value: 'rowMainKey'
          },
          ...endItems.slice(0)
        ]
        item.localGroup = arr
        return item
      })
    },

    // 展示筛选器
    changeDisplayFilter (items) {
      this.displayFilter = items
    },

    // 展示分组字段
    changeDisplayGroup (items) {
      this.displayGroup = items
    },

    compositeColumn (content) {
      this.compositeFields = content
    },

    compositeGroup (content) {
      this.compositeRowGroup = content
    },

    changeExtra (items) {
      this.extraLabel = items
    },

    emptyFilter () {
      let rowsFields = this.rowsFields
      for (var i = 0; i < rowsFields.length; i++) {
        let item = rowsFields[i]
        if (!item.rowName) {
          this.toastText = '行组不能为空'
          this.toastVisible = true
          return false
        }
        if (!item.startTime) {
          this.toastText = '开始日期不能为空'
          this.toastVisible = true
          return false
        }
        if (!item.endTime) {
          this.toastText = '结束日期不能为空'
          this.toastVisible = true
          return false
        }
        let filters = item.filters.filter(i => {
          return i.value.length === 0
        })
        if (filters.length) {
          this.toastText = '筛选条件不能为空'
          this.toastVisible = true
          return false
        }
        if (!item.aggFunc) {
          this.toastText = '聚合类型不能为空'
          this.toastVisible = true
          return false
        }
      }
      return true
    },

    // 验证表单
    validateForm () {
      if (!this.superFields.length) {
        this.toastText = '数据指标不能为空'
        this.toastVisible = true
        return false
      }
      if (!this.rowsFields.length) {
        this.toastText = '行组不能为空'
        this.toastVisible = true
        return false
      }
      return this.emptyFilter()
    },

    resetSecondKey (item) {
      item.localGroup = [
        {
          label: '行组',
          value: 'rowMainKey'
        },
        ...this.groups
      ]
    },

    resetKey () {
      this.rowKey = [
        {
          label: '行组',
          value: 'rowMainKey'
        },
        ...this.groups
      ]
    },

    // 测试数据
    testAction () {
      if (this.validateForm()) {
        let param = this.genSaveParam()
        if (this.loader) return
        this.loader = true
        api.getTestTemplate(param)
          .then(res => {
            // 渲染表格
            this.tableHead = res.table.tableHead
            this.tableData = res.table.tableBody
            this.loader = false
          })
          .catch(error => {
            this.loader = false
            this.toastText = error.msg
            this.toastVisible = true
          })
      }
    },

    // 保存模板数据
    saveTemplateAction () {
      if (this.validateForm()) {
        this.confirmVisible = true
      }
    },

    genSaveParam () {
      let rowsFields = this.rowsFields.slice(0)
      rowsFields = rowsFields.map(item => {
        let obj = {
          rowName: item.rowName,
          aggFunc: item.aggFunc,
          startTime: item.startTime,
          endTime: item.endTime,
          customDate: item.customDate
        }
        obj.localGroup = item.localGroup.map(i => i.value)
        obj.filters = item.filters.map(i => {
          let customValue = null
          if (i.customFilter && i.customFilter.value) {
            customValue = i.customFilter.value
          }
          return {
            value: i.value,
            id: i.id,
            customValue: customValue,
            useCustomValue: i.useCustomValue
          }
        })
        return obj
      })
      let superFields = this.superFields
      let globalGroup = this.globalGroup
      let rowKey = this.rowKey.map(i => i.value)
      return {
        id: this.id,
        templateName: this.templateName,
        superFields: superFields,
        rowGroups: rowsFields,
        globalGroup: globalGroup,
        rowKey: rowKey,
        compositeFields: this.compositeFields,
        compositeRowGroup: this.compositeRowGroup,
        extraLabel: this.extraLabel,
        showFilters: this.showFilters,
        showGroupField: this.showGroupField,
        showTimeUnit: this.showTimeUnit,
        dateType: this.dateType,
        timeUnit: this.timeUnit,
        // databus v4 新增字段
        themisTeam: this.permissionUse,
        filtersInMars: this.displayFilter,
        globalGroupInMars: this.displayGroup
      }
    },

    confirmSubmit () {
      if (!this.templateName.trim()) {
        this.toastText = '模板名字不能为空'
        this.toastVisible = true
        return false
      }
      let param = this.genSaveParam()
      // 保存模板接口
      api.getSaveTemplate(param)
        .then(res => {
          this.toastText = '保存成功'
          this.toastType = 'info'
          this.toastVisible = true
          this.confirmVisible = false
          setTimeout(() => {
            this.$router.push({
              path: 'templateList'
            })
          }, 1000)
        })
        .catch(error => {
          this.toastText = error.msg
          this.toastVisible = true
        })
    }
  }
}
