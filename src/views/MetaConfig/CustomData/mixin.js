import * as api from '@/api/newMeta/database'
export default {
  data () {
    return {
      id: ''
    }
  },
  methods: {
    // 保存
    saveAction () {
      if (!this.seletedBase) {
        this.toastVisible = true
        this.toastText = '请选择基础指标'
        return
      }
      this.confirmVisible = true
    },
    confirmSubmit () {
      if (!this.customName.trim()) {
        this.toastVisible = true
        this.toastText = '名字不能为空'
        return
      }
      // 提交接口
      let param = {
        id: this.id,
        name: this.customName,
        basicField: this.seletedBase,
        filterValues: this.customFilters.map(i => {
          let customValue = null
          if (i.customFilter && i.customFilter.value) {
            customValue = i.customFilter.value
          }
          return {
            id: i.id,
            value: i.value,
            customValue: customValue,
            useCustomValue: i.useCustomValue
          }
        })
      }
      api.saveSuperFields(param).then(res => {
        this.toastText = '保存成功'
        this.toastVisible = true
        setTimeout(() => {
          this.$router.push({
            path: 'customDataList'
          })
        }, 1000)
      }).catch(error => {
        this.toastText = error.msg
        this.toastVisible = true
      })
    }
  }
}
