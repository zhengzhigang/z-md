<template lang="html">
<div class="panel-center">
    <ms-subheader>编辑模板</ms-subheader>
    <div class="ms-bread">
        <router-link :to="{ path: 'templateList'}">模板列表</router-link> >
        <a>编辑模板</a>
    </div>
    <div>
        <div class="ms-form-item ms-row template-form-item">
            <div class="ms-col-24">
                <span>模板名称: </span>
                <div class="ms-form-input-inline">
                    <input type="text" class="ms-form-input-text" :value="templateName" readonly>
                </div>
            </div>
            <div class="ms-col-24">
                <span>数据指标: </span>
                <div class="ms-form-input-inline">
                    <ms-form-multiple-select
                        v-if="baseFields.length"
                        :organization="baseFields"
                        hint="请选择数据指标"
                        :value="superFields"
                        @input="changeSuper"
                        :custom-style="{ width: '500px' }"></ms-form-multiple-select>
                </div>
            </div>
        </div>
        <div class="ms-form-item ms-row template-form-item" v-if="compositeColumns.length">
            <composite-item
                :fields="compositeColumns"
                hint="复合列"
                :composite="compositeFields"
                @composite-content="compositeColumn"></composite-item>
        </div>
        <div class="ms-form-item ms-row template-form-item" v-if="rowsFields.length">
            <ms-subtitle>添加行组</ms-subtitle>
            <template v-for="(item, inx) in rowsFields">
                <div class="ms-form-item row-item" :key="inx">
                    <div class="ms-row ms-form-item">
                        <div class="ms-col-24">
                            <span>行组名称:</span>
                            <div class="ms-form-input-inline">
                                <input width="300" type="text" name="" v-model="item.rowName" class="ms-form-input-text" placeholder="行组名称">
                            </div>
                            <span style="float: right" v-if="inx > 0">
                                <a class="ms-button ms-error" @click="deleteColumn(inx)">删除</a>
                            </span>
                        </div>
                    </div>

                    <div class="ms-row ms-form-item">
                        <div class="ms-col-10">
                            <span>开始日期:</span>
                            <div class="ms-form-input-inline" v-if="item.customDate">
                                <input width="300" type="text" name="" v-model="item.startTime" class="ms-form-input-text" placeholder="开始时间">天前
                            </div>
                            <div class="ms-form-input-inline" v-else>
                                <ms-form-organization
                                    key="startTime"
                                    :organization="sTimeSource"
                                    v-model="item.startTime"></ms-form-organization>
                            </div>
                        </div>

                        <div class="ms-col-10">
                            <span>结束日期:</span>
                            <div class="ms-form-input-inline" v-if="item.customDate">
                                <input width="300" type="text" name="" v-model="item.endTime" class="ms-form-input-text" placeholder="结束时间">天前
                            </div>
                            <div class="ms-form-input-inline" v-else="customDate">
                                <ms-form-organization
                                    key="endTime"
                                    :organization="eTimeSource"
                                    v-model="item.endTime"></ms-form-organization>
                            </div>
                        </div>

                        <div class="ms-col-4">
                            <div class="ms-form-input-inline" v-if="item.customDate">
                                <a @click="toggleDate(rowsFields, inx)">选择日期</a>
                            </div>
                            <div class="ms-form-input-inline" v-else>
                                <a @click="toggleDate(rowsFields, inx)">自定义时间</a>
                            </div>
                        </div>
                    </div>

                    <div class="ms-row ms-form-item" v-if="item.filters.length">
                        <div class="ms-col-24">
                            <label>筛选条件:</label>
                            <div class="ms-form-input-inline">
                                <span  class="ms-button" @click="toggleFilter">{{switchFilter ? '收起' : '展开'}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="ms-row ms-form-item filter-collaspe" v-show="switchFilter" v-if="item.filters.length">
                        <div class="ms-form-item-block">
                            <ms-filter :filters="item.filters"></ms-filter>
                        </div>
                    </div>

                    <div class="ms-row ms-form-item">
                        <div class="ms-col-12">
                            <label>行组分组字段:</label>
                            <div class="ms-form-input-inline">
                                <div class="chips-wrap" v-if="item.localGroup.length">
                                    <span v-for="(subItem, inx) in item.localGroup" @click="deleteChip(item.localGroup, inx)">
                                        <i class="ion-android-cancel chip-wrap-icon_cancel"></i></a>
                                        <em>{{ subItem.label }}</em>
                                    </span>
                                    <span  class="ms-button" @click="resetSecondKey(item)">重置</span>
                                </div>
                            </div>
                        </div>

                        <div class="ms-col-12">
                            <label class="ms-form-label">聚合类型:</label>
                            <div class="ms-form-input-block">
                                <ms-form-organization
                                    :organization="aggregationTypes"
                                    v-model="item.aggFunc"></ms-form-organization>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <div class="ms-form-item-block text-rt">
                <span class="ms-button ms-info" @click="addRow">添加</span>
            </div>
        </div>

        <div class="ms-form-item ms-row template-form-item" v-if="compositeGroups.length">
            <composite-item
                :fields="compositeGroups"
                hint="复合行组"
                :composite="compositeRowGroup"
                @composite-content="compositeGroup"></composite-item>
        </div>

        <div class="ms-form-item ms-row template-form-item">
            <ms-subtitle>全局分组字段</ms-subtitle>
            <div class="ms-row ms-form-item">
                <label class="ms-form-label">全局分组字段(可多选):</label>
                <div class="ms-form-input-block">
                    <ms-form-multiple-select
                        v-if="globalFields.length"
                        key="global"
                        :organization="globalFields"
                        hint="请选择分组字段"
                        :value="globalGroup"
                        @input="changeGlobal"
                        :custom-style="{ width: '300px' }"></ms-form-multiple-select>
                </div>
            </div>
        </div>

        <div class="ms-row ms-form-item template-form-item">
            <label class="ms-form-label">表格行键:</label>
            <div class="ms-form-input-block">
                <div class="chips-wrap" v-if="rowKey.length">
                    <span v-for="(item, inx) in rowKey" @click="deleteKey(item, inx)">
                        <i class="ion-android-cancel chip-wrap-icon_cancel"></i></a>
                        <em>{{ item.label }}</em>
                    </span>
                    <span  class="ms-button" @click="resetKey">重置</span>
                </div>
            </div>
        </div>

        <div class="ms-row ms-form-item template-form-item">
            <div class="ms-form-item">
                <label class="ms-form-label">附加展示项:</label>
                <div class="ms-form-input-block">
                    <ms-form-multiple-select
                        v-if="extraSource.length"
                        :organization="extraSource"
                        hint="请选择数据指标"
                        :value="extraLabel"
                        @input="changeExtra"
                        :custom-style="{ width: '500px' }"></ms-form-multiple-select>
                </div>
            </div>
        </div>

        <div class="ms-row ms-form-item template-form-item" v-if="compositeColumns.length">
            <ms-subtitle>权限组</ms-subtitle>
            <div class="ms-form-item" v-if="permissionUse">
                <div class="ms-form-item" >
                    <label class="ms-form-label">启用:</label>
                    <div class="ms-form-input-block">
                        <ms-form-radio v-model="permissionUse.on" :label="1">是</ms-form-radio>
                        <ms-form-radio v-model="permissionUse.on" :label="0">否</ms-form-radio>
                    </div>
                </div>

                <div class="ms-form-item" v-if="permissionUse.on === 1">
                    <label class="ms-form-label">关联列:</label>
                    <div class="ms-form-input-block">
                        <div class="ms-form-item">
                            <label class="ms-form-label">商务:</label>
                            <div class="ms-form-input-block">
                                <ms-form-organization
                                    key="businessRow"
                                    :organization="compositeColumns"
                                    v-model="permissionUse.business"></ms-form-organization>
                            </div>
                        </div>

                        <div class="ms-form-item">
                            <label class="ms-form-label">商务组:</label>
                            <div class="ms-form-input-block">
                                <ms-form-organization
                                    key="businessGroup"
                                    :organization="compositeColumns"
                                    v-model="permissionUse.businessGroup"></ms-form-organization>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="ms-row ms-form-item template-form-item">
            <div class="ms-form-item">
                <label class="ms-form-label">展示筛选器:</label>
                <div class="ms-form-input-block">
                    <ms-form-multiple-select
                        v-if="globalFields.length"
                        key="displayFilterOrg"
                        :organization="displayFilterOrg"
                        hint="请选择筛选器"
                        :value="displayFilter"
                        @input="changeDisplayFilter"
                        :custom-style="{ width: '300px' }"></ms-form-multiple-select>
                </div>
            </div>

            <div class="ms-form-item">
                <label class="ms-form-label">展示分组字段:</label>
                <div class="ms-form-input-block">
                    <ms-form-multiple-select
                        v-if="globalFields.length"
                        key="displayGroupOrg"
                        :organization="displayGroupOrg"
                        hint="请选择分组字段"
                        :value="displayGroup"
                        @input="changeDisplayGroup"
                        :custom-style="{ width: '300px' }"></ms-form-multiple-select>
                </div>
            </div>
            <div class="ms-form-item">
                <label class="ms-form-label">展示天周月:</label>
                <div class="ms-form-input-block">
                    <ms-form-radio v-model="showTimeUnit" :label="1">是</ms-form-radio>
                    <ms-form-radio v-model="showTimeUnit" :label="0">否</ms-form-radio>
                </div>
            </div>

            <div class="ms-form-item">
                <label class="ms-form-label">日期选择方式:</label>
                <div class="ms-form-input-block">
                    <ms-form-radio v-model="dateType" label="single">单日</ms-form-radio>
                    <ms-form-radio v-model="dateType" label="double">时间区间</ms-form-radio>
                </div>
            </div>

            <div class="ms-form-item">
                <label class="ms-form-label">查询方式:</label>
                <div class="ms-form-input-block">
                    <ms-form-radio v-model="timeUnit" :label="0">按天</ms-form-radio>
                    <ms-form-radio v-model="timeUnit" :label="1">按周</ms-form-radio>
                    <ms-form-radio v-model="timeUnit" :label="2">按月</ms-form-radio>
                </div>
            </div>
        </div>

        <div class="ms-actions">
            <div class="ms-row">
                <div class="ms-col-24">
                    <span style="float: right">
                        <a class="ms-button ms-success" @click="testAction">测试</a>
                        <a class="ms-button ms-info" @click="saveTemplateAction">保存</a>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="test-table">
        <div class="ms-lists" v-if="tableHead.length">
            <ms-table :columns="tableHead" :data="tableData" height="500px"></ms-table>
        </div>
        <ms-loader :loader="loader" :top="20"></ms-loader>
    </div>

    <ms-confirm v-model="confirmVisible" title="请输入自定义指标名称" @confirm-success="confirmSubmit">
        <div class="ms-row relationList-box">
            <input style="width: 100%;"
                type="text"
                v-model="templateName"
                placeholder="请输入名称"
                class="ms-form-input-text">
        </div>
    </ms-confirm>
    <ms-toast v-model="toastVisible" :type="toastType" :text="toastText" :top="20"></ms-toast>
</div>
</template>

<script>
import * as api from '@/api/newMeta/database'
import mixin from './mixin'
export default {
  mixins: [mixin],

  data () {
    return {
      // 获取详情数据
      templateDetail: null,

      // 标志类型
      editing: true,
      switchFilter: true
    }
  },

  created () {
    this.fetchInit()
  },

  methods: {
    fetchInit () {
      this.fetchSuperFields()
      this.fetchDateList()
      this.fetchTemplateDetail()
    },

    // 获取模板详情页
    fetchTemplateDetail () {
      let query = this.$route.query
      api.getTemplateDetail(query.id).then(res => {
        this.templateDetail = res
        // 获取详情后组装成组件所需的格式
        let {
          id,
          templateName,
          globalGroupSource,
          aggFuncSource,
          superFields,
          globalGroup,
          rowKey,
          rowsFields,
          extraLabelSource,
          compositeFields,
          compositeRowGroup,
          extraLabel,
          showFilters,
          showGroupField,
          showTimeUnit,
          dateType,
          timeUnit,
          themisTeam,
          filtersInMars,
          globalGroupInMars
        } = res
        this.id = id
        // 级联选择器数据源
        this.globalFields = globalGroupSource
        this.displayFilterOrg = globalGroupSource
        this.displayGroupOrg = globalGroupSource
        this.aggregationTypes = aggFuncSource
        this.extraSource = extraLabelSource
        this.compositeColumns = superFields
        // 编辑页面各个表单项的值
        this.superFields = superFields.map(i => i.value)
        this.globalGroup = globalGroup.map(i => i.value)
        this.rowKey = rowKey
        this.templateName = templateName
        this.rowsFields = rowsFields.map(i => i)
        this.compositeFields = compositeFields
        this.compositeRowGroup = compositeRowGroup
        this.extraLabel = extraLabel
        this.showFilters = showFilters
        this.showGroupField = showGroupField
        this.showTimeUnit = showTimeUnit
        this.dateType = dateType
        this.timeUnit = timeUnit
        // databus v4 新添加字段
        this.permissionUse = themisTeam
        this.displayFilter = filtersInMars.map(i => i.value)
        this.displayGroup = globalGroupInMars.map(i => i.value)
        // 是编辑
        this.editing = false
        let fields = this.superFields
        // 请求一次获取筛选器的数据
        api.getTemplateFilters(fields).then(res => {
          this.templateFilters = [...res.filters]
        })
      })
    },

    changeSuper (items, endItems) {
      this.superFields = items
      this.compositeColumns = endItems
      if (items && items.length > 0) {
        if (this.editing) {
          this.clearSuperForm()
          this.fetchTemplateFilters(items)
        }
      } else {
        this.clearSuperForm()
      }
      this.editing = true
    }
  }
}
</script>

<style lang="less">
.template-form-item {
  background: #fff;
  padding: 20px;
}
.test-table {
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.row-item {
  margin-top: 10px;
  border-bottom: 1px dashed rgb(202, 213, 222);
}
.filter-item {
  margin-right: 15px;
}
.filter-collaspe {
  background: #fff;
  font-size: 12px;
  padding: 20px;
  transition: all 0.3s;
}
.chips-wrap {
  margin: 0px 0;
  span {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: #e0e0e0;
    position: relative;
    margin: 0 10px 8px 0;
    padding: 5px 10px;
    color: rgba(0, 0, 0, 0.87);
    border-radius: 3px;
    white-space: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    em {
      display: flex;
      align-items: center;
      font-style: normal;
      padding-left: 5px;
    }
  }
}
</style>
