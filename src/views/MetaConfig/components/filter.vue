<template lang="html">
<div>
  <div v-for="(item, index) in filters" :key="index">
    <div class="ms-form-item" v-if="item.type === 'three-level linkage'">
      <span>{{item.name}}：</span>
      <ms-form-organization :key="item.id" :organization="item.source" v-model="item.value" v-if="item.useCustomValue==false"></ms-form-organization>
      <div class="ms-form-input-inline" v-if="item.customFilter!=null && item.useCustomValue">
        <ms-form-organization :key="item.id" :organization="item.customFilter.source" v-model="item.customFilter.value[0]"></ms-form-organization>
        <input type="text" class="ms-form-input-text" placeholder="" v-model="item.customFilter.value[1]">
      </div>
      <span  class="ms-button" @click="switchCompont(item)" v-if="item.customFilter!=null">切换</span>

    </div>
    <div class="ms-form-item" v-if="item.type === 'two-level linkage'">
      <span>{{item.name}}：</span>
      <ms-form-organization :key="item.id" :organization="item.source" v-model="item.value" v-if="item.useCustomValue==false"></ms-form-organization>
      <div class="ms-form-input-inline" v-if="item.customFilter!=null && item.useCustomValue">
        <ms-form-organization :key="item.id" :organization="item.customFilter.source" v-model="item.customFilter.value[0]"></ms-form-organization>
        <input type="text" class="ms-form-input-text" placeholder="" v-model="item.customFilter.value[1]">
      </div>
      <span  class="ms-button" @click="switchCompont(item)" v-if="item.customFilter!=null">切换</span>
    </div>
    <div class="ms-form-item" v-if="item.type === 'drop list'">
      <span>{{item.name}}：</span>
      <ms-form-organization :key="item.id" :organization="item.source" v-model="item.value" v-if="item.useCustomValue==false"></ms-form-organization>
      <div class="ms-form-input-inline" v-if="item.customFilter!=null && item.useCustomValue">
        <ms-form-organization :key="item.id" :organization="item.customFilter.source" v-model="item.customFilter.value[0]"></ms-form-organization>
        <input type="text" class="ms-form-input-text" placeholder="" v-model="item.customFilter.value[1]">
      </div>
      <span  class="ms-button" @click="switchCompont(item)" v-if="item.customFilter!=null">切换</span>
    </div>
    <div class="ms-form-item" v-if="item.type === 'common filter'">
      <span>{{item.name}}:</span>
      <div class="ms-form-input-inline">
        <ms-form-organization :key="item.id" :organization="item.source" v-model="item.value[0]" v-if="item.useCustomValue==false"></ms-form-organization>
        <input type="text" class="ms-form-input-text" placeholder="" v-model="item.value[1]">
      </div>
      <div class="ms-form-input-inline" v-if="item.customFilter!=null && item.useCustomValue">
        <ms-form-organization :key="item.id" :organization="item.customFilter.source" v-model="item.customFilter.value[0]"></ms-form-organization>
        <input type="text" class="ms-form-input-text" placeholder="" v-model="item.customFilter.value[1]">
      </div>
      <span  class="ms-button" @click="switchCompont(item)" v-if="item.customFilter!=null">切换</span>
    </div>
  </div>
</div>
</template>

<script>
import MsFormOrganization from '@/components/Form/FormOrganization'
import MsFormRadio from '@/components/Form/FormRadio'
export default {
  name: 'ms-custom-filter',
  data () {
    return {
      curFilters: this.filters
    }
  },
  props: {
    filters: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    filters (newVal) {
      if (Array.isArray(newVal)) {
        this.curFilters = newVal
      }
    }
  },
  components: {
    MsFormOrganization,
    MsFormRadio
  },

  methods: {
    switchCompont (item) {
      item.useCustomValue = !item.useCustomValue
    }
  }
}
</script>

<style lang="less">
</style>
