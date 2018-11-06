<template lang="html">
  <div class="panel-center">
    <ms-subheader>
      自定义数据指标
    </ms-subheader>
    <div class="ms-bread">
      <router-link :to="{ path: 'customDataList'}">数据指标列表</router-link> >
      <a>自定义基础指标</a>
    </div>
    <div class="ms-form">
      <div class="ms-form-item">
        <span>基础指标:</span>
        <ms-form-organization :organization="baseSource" :value="seletedBase" @input="changeBase"></ms-form-organization>
      </div>
      <ms-subtitle>选择筛选条件</ms-subtitle>
      <transition name="fade"  tag="div">
        <ms-custom-filter :filters="customFilters" v-if="customFilters.length"></ms-custom-filter>
      </transition>
      <div class="ms-actions">
        <div class="ms-row">
          <div class="ms-col-24">
            <span style="float: right">
              <a class="ms-button ms-info" @click="saveAction">保存</a>
            </span>
          </div>
        </div>
      </div>
    </div>

    <ms-confirm v-model="confirmVisible" title="请输入自定义指标名称" @confirm-success="confirmSubmit">
      <div class="ms-row relationList-box">
        <input style="width: 100%;" type="text" v-model="customName" placeholder="请输入名称" class="ms-form-input-text">
      </div>
    </ms-confirm>
    <ms-toast v-model="toastVisible" type="info" :text="toastText"></ms-toast>
  </div>
</template>

<script>
import MsSubheader from '@/components/Subheader'
import MsSubtitle from '@/components/Subheader/Subtitle'
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsFormMultipleSelect from '@/components/Form/FormMultipleSelect'
import MsDialog from '@/components/Modal/Dialog'
import MsConfirm from '@/components/Modal/Confirm'
import MsToast from '@/components/Modal/Toast'
import MsCustomFilter from '@/views/MetaConfig/components/filter'
import * as api from '@/api/newMeta/database'
import mixin from './mixin'
export default {
  data () {
    return {
      // 选择基础指标
      baseSource: [],
      seletedBase: '',
      // 自定义筛选条件
      customFilters: [],
      customName: '', // 自定义指标名称

      confirmVisible: false,
      toastVisible: false,
      toastText: ''
    }
  },
  mixins: [mixin],
  created () {
    this.fetchInit()
  },

  methods: {
    fetchInit () {
      this.fetchBaseOptions()
    },
    // 获取基础指标
    fetchBaseOptions () {
      api.getBaseQuota().then((res) => {
        res.organization.forEach((item) => {
          this.baseSource.push(item)
        })
      })
    },
    // 改变基础指标
    changeBase (val) {
      this.seletedBase = val
      if (val) {
        this.customFilters = []
        api.getBaseQuotaFilters(val).then((res) => {
          res.basicFilters.forEach((item) => {
            this.customFilters.push(item)
          })
        })
      }
    }
  },
  components: {
    MsSubheader,
    MsSubtitle,
    MsFormOrganization,
    MsFormMultipleSelect,
    MsDialog,
    MsConfirm,
    MsToast,
    MsCustomFilter
  }
}
</script>

<style lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
