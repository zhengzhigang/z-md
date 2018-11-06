<template lang="html">
  <div class="panel-center">
    <ms-subheader>
      编辑元数据
    </ms-subheader>
    <div class="ms-bread">
      <router-link :to="{ path: 'metaDataList'}">数据表列表</router-link> >
      <a>编辑元数据</a>
    </div>
    <div class="ms-form">
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">选择数据库:</label>
        <div class="ms-form-input-block">
          <input width="300" type="text" readonly :value="seletedDb" class="ms-form-input-text">
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">已选数据表:</label>
        <div class="ms-form-input-block">
          <input width="300" type="text" readonly :value="seletedDbTable" class="ms-form-input-text">
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">选择周表:</label>
        <div class="ms-form-input-block">
          <ms-form-organization v-if="dbTableWeek.length" :organization="dbTableWeek" :value="selectedDbTableWeek" @input="changeDbTableWeek "></ms-form-organization>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">选择月表:</label>
        <div class="ms-form-input-block">
          <ms-form-organization v-if="dbTableMonth.length" :organization="dbTableMonth" :value="selectedDbTableMonth" @input="changeDbTableMonth"></ms-form-organization>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">表类型:</label>
        <div class="ms-form-input-block">
          <ms-form-radio v-model="tableType" :label="1">明细表</ms-form-radio>
          <ms-form-radio v-model="tableType" :label="0">al报表</ms-form-radio>
        </div>
      </div>

      <div class="ms-row ms-form-item">
        <label class="ms-form-label">日期字段:</label>
        <div class="ms-form-input-block">
          <ms-form-organization v-if="dbTableFields.length" :organization="dbTableFields" :value="dateField" @input="changeDateField"></ms-form-organization>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">日期格式:</label>
        <div class="ms-form-input-block">
          <ms-form-radio v-model="dateFormater" label="yyyy-MM-dd">yyyy-MM-dd</ms-form-radio>
          <ms-form-radio v-model="dateFormater" label="yyyyMMdd">yyyyMMdd</ms-form-radio>
        </div>
      </div>

      <div class="ms-row ms-form-item">
        <label class="ms-form-label">绑定筛选器:</label>
        <div class="ms-form-input-block">
          <div class="ms-form-item">
            <template v-for="(item, index) in relationList" v-if="relationList.length">
              <div class="ms-row" :key="index">
                <ms-form-organization  key="dbColunm" hint="选择字段" :organization="dbTableFields" :value="item.dbColunm" @input="changeRelation(arguments[0], 'dbColunm', item)"></ms-form-organization>
                <span class="ms-icon">绑定到</span>
                <ms-form-organization  key="filter" hint="选择筛选器" :organization="relationFilters" :value="item.filter" @input="changeRelation(arguments[0], 'filter', item)"></ms-form-organization>
                <span class="ms-icon" v-if="index === relationList.length - 1" @click="addFilter(item)"><i class="ion-plus size-16 vertical-m"></i></span>
                <span class="ms-icon" @click="deleteFilter(index)"><i class="ion-minus size-16 vertical-m"></i></span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">额外查询条件:</label>
        <div class="ms-form-input-block">
          <textarea placeholder="例如: hospital_id = 'ALL'  and doctor_id = 'ALL'" name="name" rows="4" cols="60" class="ms-form-textarea" v-model="extraSql"></textarea>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <label class="ms-form-label">新建基础指标:</label>
        <div class="ms-form-input-block">
          <a class="ms-button" @click="addBaseQuata">新增</a>
        </div>
      </div>
      <div class="ms-row ms-form-item">
        <div class="ms-form-item-block">
          <div class="ms-list-items" v-if="basicFields.length">
            <div class="ms-list-item" v-for="(item, inx) in basicFields">
              <div class="basic">
                <div class="basic-content">
                  <span>{{item.name}}</span>
                  <span>{{item.dbColunm}}</span>
                </div>
                <div class="basic-meta">
                  <a class="ms-button" @click="editBasic(item,inx)">编辑</a>
                  <a class="ms-button ms-danger" @click="deleteBasic(item, inx)">删除</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-actions">
        <div class="ms-row">
          <div class="ms-col-24">
            <span style="float: right">
              <a class="ms-button ms-success" @click="printAction">测试Sql</a>
              <a class="ms-button ms-info" @click="saveAction">保存</a>
            </span>
          </div>
        </div>
      </div>
      <div class="sql-wrap">
        <textarea readonly name="name" rows="15" cols="30" class="ms-form-textarea" :value="sqlContent" v-if="sqlContent"></textarea>
      </div>
    </div>

    <ms-dialog  v-model="dialogVisible" width="600" title="新建基础指标" key="newMeta" @confirm-success="saveBaseQuata" :disabled="lockDialogBtn">
      <div class="ms-form-item">
        <span>指标名称:</span>
        <input width="100%" type="text" name="" value="" placeholder="指标名称" class="ms-form-input-text" v-model="basicName">
      </div>
      <div class="ms-form-item">
        <span>选择字段:</span>
        <div class="ms-form-item">
          <textarea rows="4" cols="60"
          class="ms-form-textarea expression-textarea"
          v-model="basicExpression"
          @focus="showTip = true"
          ></textarea>
        </div>
        <div class="tips" v-show="showTip && filterFields.length > 0">
          <div class="tip-search">
            <input type="text" class="ms-form-input-text" v-model="tipKey" placeholder="搜索">
          </div>
          <div class="tip-content">
            <div v-for="item in filterFields" @click="addToExp(item)">{{item.label}}</div>
          </div>
        </div>
      </div>
    </ms-dialog>
    <ms-toast v-model="toastVisible" :type="toastType" :text="toastText" top="15"></ms-toast>
  </div>
</template>

<script>
import * as api from '@/api/newMeta/database'
import mixin from './mixin'
export default {
  data () {
    return {
      // 数据表中所有字段
      dbTableFields: [],
      // 筛选器列表
      relationFilters: [],
      relationList: [],
      detail: {
        dbName: '',
        dbTable: '',
        extraSql: '',
        filters: [],
        basicFields: []
      },
      seletedDb: '',
      seletedDbTable: '',
      selectedDbTableWeek: '',
      selectedDbTableMonth: '',
      extraSql: '',
      basicFields: [],
      dbTableWeek: [],
      dbTableMonth: []
    }
  },
  mixins: [mixin],
  created () {
    this.fetchInit()
  },

  computed: {
  },
  methods: {
    fetchInit () {
      this.fetchMetaDetail()
    },

    fetchMetaDetail () {
      let query = this.$route.query
      this.fetchDbTableFields(query.dbName, query.dbTable)
      this.fetchRelationFilters()
      this.fetchDbTables(query.dbName)
      api.editRelation(query.dbName, query.dbTable).then((res) => {
        this.detail = res
        this.id = res.id || ''
        this.seletedDb = this.detail.dbName || ''
        this.seletedDbTable = this.detail.dbTable || ''
        this.extraSql = this.detail.extraSql || ''
        this.basicFields = this.detail.basicFields || []
        // 不能this.detail.tableType||1,因为tableType的取值可以为0
        this.tableType = this.detail.tableType
        this.dateField = this.detail.dateField
        this.dateFormater = this.detail.dateformater
        this.selectedDbTableWeek = this.detail.week || ''
        this.selectedDbTableMonth = this.detail.month || ''
        let relationList = this.detail.filters.map(item => {
          item.dbColunm = item.dbColunm
          item.filter = item.filter
          return item
        })
        if (relationList.length === 0) {
          this.relationList = [{
            dbColunm: '',
            filter: ''
          }]
        } else {
          this.relationList = relationList
        }
      })
    },

    fetchDbTableFields (dbName, dbTableName) {
      api.getDbTableFields(dbName, dbTableName).then((res) => {
        this.dbTableFields.splice(0)
        res.organization.forEach((item) => {
          this.dbTableFields.push(item)
        })
      })
    },

    fetchDbTables (dbName) {
      api.getDbTable(dbName).then((res) => {
        res.organization.forEach(item => {
          this.dbTableWeek.push(item)
          this.dbTableMonth.push(item)
        })
      })
    },

    // 获取筛选器列表
    fetchRelationFilters () {
      api.getRelationFilters().then((res) => {
        res.organization.forEach((item) => {
          this.relationFilters.push(item)
        })
      })
    },

    changeDbTableWeek (val) {
      // 获取某个数据中某张数据表中的所有字段
      this.selectedDbTableWeek = val
    },

    changeDbTableMonth (val) {
      // 获取某个数据中某张数据表中的所有字段
      this.selectedDbTableMonth = val
    },

    changeDateField (val) {
      this.dateField = val
    }
  }
}
</script>

<style lang="less">
.basic {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(81, 130, 228, 0.1);
  &-content {
    width: 80%;
    display: inline-flex;
    align-items: center;
    span {
      width: 50%;
      display: inline-block;
    }
  }
}
.sql-wrap {
  textarea {
    width: 100%;
  }
}
.tips {
  width: 400px;
  padding: 10px;
  margin: 0 10px;
  border: 1px solid rgba(81,130,228,.2);
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
