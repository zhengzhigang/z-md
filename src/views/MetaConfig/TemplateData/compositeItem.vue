<template lang="html">
<div>
  <div class="ms-form-item ms-row">
    <div class="ms-col-24">
      <div class="title">
        <p>{{label}}</p>
      </div>
      <div class="content" v-for="(item, idx) in items" :key="idx">
        <span>{{item.title}}</span>
        <span>{{item.expression}}</span>
        <span>
          <a class="ms-button" @click="editRow(item, idx)">编辑</a>
          <a class="ms-button ms-danger" @click="deleteRow(item, idx)">删除</a>
        </span>
      </div>
    </div>
    <div class="ms-col-24">
      <div class="add-btn">
        <a class="ms-button ms-info" @click="newCompositeRow">添加</a>
      </div>
    </div>
  </div>
  <ms-dialog v-model="dialogVisible" @confirm-success="saveAction" :width="600">
    <div class="ms-form-item">
      <span>{{label}}</span>
      <div class="ms-form-item-block">
        <input type="text" class="ms-form-input-text" v-model="title">
      </div>
    </div>
    <div class="ms-form-item">
      <span>表达式</span>
      <div class="ms-form-item-block">
        <textarea rows="4" cols="60"
          class="ms-form-textarea expression-textarea"
          v-model="expression"
          @focus="showTip = true"
          ></textarea>
          <div class="tips" v-show="showTip && filterFields.length > 0">
            <div class="tip-search">
              <input type="text" class="ms-form-input-text" v-model="tipKey" placeholder="搜索">
            </div>
            <div class="tip-content">
              <div v-for="item in filterFields" @click="addToExp(item)">{{item.label}}</div>
            </div>
          </div>
      </div>
    </div>
  </ms-dialog>
  <ms-toast v-model="toastVisible" :type="toastType" :text="toastText"></ms-toast>
</div>
</template>

<script>
import MsFormInputText from '@/components/Form/FormInputText'
import MsDialog from '@/components/Modal/Dialog'
import MsToast from '@/components/Modal/Toast'
export default {
  name: 'composite-item',
  components: {
    MsFormInputText,
    MsDialog,
    MsToast
  },
  data () {
    return {
      items: this.composite || [],
      label: this.hint,
      title: '',
      expression: '',
      filterKey: '',
      tipKey: '',
      showTip: false,
      editing: false, // 是否是编辑
      editingInx: '',

      dialogVisible: false,
      toastText: '',
      toastVisible: false,
      toastType: 'error',
      filterFields: this.fields || []
    }
  },
  props: {
    hint: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    composite: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    composite (newVal) {
      let arr = []
      if (Array.isArray(newVal)) {
        arr = newVal
      }
      this.items = arr
    },
    fields (newVal) {
      let arr = []
      if (Array.isArray(newVal)) {
        let key = this.tipKey
        if (key) {
          arr = newVal.filter(i => i.label.indexOf(key) !== -1)
        } else {
          arr = newVal
        }
      }
      this.filterFields = arr
    }
  },
  methods: {
    addToExp (item) {
      this.expression += '{' + item.label + '}'
    },
    newCompositeRow () {
      this.dialogVisible = true
      this.clearForm()
    },
    clearForm () {
      this.title = ''
      this.expression = ''
      this.editing = false
      this.editingInx = ''
    },
    editRow (item, idx) {
      this.dialogVisible = true
      this.title = item.title
      this.expression = item.expression
      this.editing = true
      this.editingInx = idx
    },
    deleteRow (item, idx) {
      this.items.splice(idx, 1)
      let items = [...this.items]
      this.$emit('composite-content', items)
    },
    saveAction () {
      let title = this.title
      let items = []
      let expression = this.expression
      if (title && expression) {
        let editingInx = this.editingInx
        if (this.editing) {
          this.items.splice(editingInx, 1, {
            title,
            expression
          })
          items = [...this.items]
          let isRepeat = this.items.filter(i => i.title === title).length > 1
          if (isRepeat) {
            this.toastText = '名称已经存在'
            this.toastVisible = true
            return
          }
        } else {
          let isRepeat = this.items.filter(i => i.title === title).length >= 1
          if (isRepeat) {
            this.toastText = '名称已经存在'
            this.toastVisible = true
            return
          }
          items = [...this.items, {
            title,
            expression
          }]
        }
        this.items = items
        this.$emit('composite-content', items)
        this.dialogVisible = false
        this.clearForm()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-btn {
  text-align: right;
}
.expression-textarea {
  font-size: 12px;
}
.content {
  display: flex;
  justify-content: space-between;
  padding: 15px 0px;
  align-items: center;
}
.tips {
  width: 400px;
  padding: 10px;
  margin: 0 10px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1), 0 0 12px 5px rgba(0, 0, 0, 0.1);
}
.tip-search {
  input {
    width: 100%;
  }
}
.tip-content {
  height: 160px;
  overflow-y: auto;
  div {
    padding: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
