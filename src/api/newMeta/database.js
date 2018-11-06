import fetch from '@/utils/fetch'

// 根据用户id查询用户信息
function getUserInfo (id) {
  let url = `/api/userPermission/search?userId=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
//
function removeTemplate (param) {
  let url = `/api/userPermission/rmTemplate`
  const data = param
  return fetch({
    url: url,
    method: 'post',
    data: data
  })
}
// 获取数据库列表
function getDatabase () {
  return fetch({
    url: '/api/metaStore/databases',
    method: 'get'
  })
}
// 获取数据表列表
function getDbTable (dbName) {
  let url = `/api/metaStore/${dbName}/dbtables`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 获取元数据列表
function getMetaTable () {
  let url = `/api/metaStore/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 获取基础指标列表
function getBaseFieldList () {
  let url = `/api/metaStore/baseField/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 验证基础指标名称是否重复
function validateBaseFieldName (param) {
  let url = `/api/metaStore/baseField/repeatName`
  const data = param
  return fetch({
    url: url,
    method: 'post',
    data
  })
}
// 获取数据表所有字段
function getDbTableFields (dbName, dbTableName) {
  let url = `/api/metaStore/${dbName}/${dbTableName}/dbclounms`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 获取数据表所有字段
function getRelationFilters () {
  let url = `/api/filter/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 保存数据
function saveRelation (param) {
  let url = `/api/metaStore/save`
  return fetch({
    url: url,
    method: 'post',
    data: param
  })
}
// 元数据列表删除
function deleteMetaList (id) {
  let url = `/api/metaStore/delete`
  const data = {
    metaId: id
  }
  return fetch({
    url: url,
    method: 'post',
    data: data
  })
}
// 编辑元数据
function editRelation (dbname, dbtable) {
  let url = `/api/metaStore/${dbname}/${dbtable}/edit`
  return fetch({
    url: url,
    method: 'get'
  })
}
/**
 * 数据指标模块
 */
// 获取数据指标列表
function getSuperFieldsList () {
  let url = `/api/superField/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 编辑数据指标
function editSuperFields (id) {
  const url = `/api/superField/detail`
  let data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 删除数据指标
function deleteSuperFields (id) {
  const url = `/api/superField/delete`
  let data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 删除数据指标
function saveSuperFields (param) {
  const url = `/api/superField/save`
  let data = param
  return fetch({
    url: url,
    method: 'post',
    data
  })
}
// 获取基础数据指标
function getBaseQuota () {
  let url = `/api/metaStore/basicField/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 获取基础数据指标对应的筛选条件
function getBaseQuotaFilters (val) {
  let url = `/api/metaStore/basicField/filters/detail`
  let data = {
    id: val
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 获取模板列表
function getTemplateList () {
  let url = `/api/template/list`
  return fetch({
    url: url,
    method: 'get'
  })
}

// 删除模板
function deleteTemplateList (id) {
  let url = `/api/template/delete`
  const data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'post',
    data: data
  })
}
// 模板克隆
function cloneTemplateList (id) {
  let url = `/api/template/clone`
  const data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'post',
    data: data
  })
}
// 获取数据指标
function getSuperFields () {
  let url = `/api/metaStore/superField/list`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 获取开始和结束日期数据
function getDateList () {
  let url = `/api/filter/date/componentData`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据指标获得筛选器和分组数据
function getTemplateFilters (superFields) {
  let url = `/api/template/pageComnpent/detail`
  const data = {
    superFields: superFields
  }
  return fetch({
    url: url,
    method: 'post',
    data: data
  })
}
// 编辑页面,根据ID获得页面组件数据
function getTemplateDetail (id) {
  let url = `/api/template/detail`
  const data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 查询测试接口
function getTestTemplate (param) {
  let url = `/api/template/query`
  const data = param
  return fetch({
    url: url,
    method: 'post',
    data
  })
}
// 保存模板接口
function getSaveTemplate (param) {
  let url = `/api/template/save`
  const data = param
  return fetch({
    url: url,
    method: 'post',
    data
  })
}
// 获得用户列表
function getUserList (id) {
  let url = `/api/template/mars/users`
  const data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 获得模板的当前用户
function getTemplateUser (id) {
  let url = `/api/template/currentUsers`
  const data = {
    id: id
  }
  return fetch({
    url: url,
    method: 'get',
    params: data
  })
}
// 保存模板权限的用户
function saveTemplateUser (param) {
  let url = `/api/template/users/save`
  const data = param || {}
  return fetch({
    url: url,
    method: 'post',
    data
  })
}
// 打印sql
function printSql (data) {
  return fetch({
    url: '/api/metaStore/testSql',
    method: 'post',
    data
  })
}
/**
 * 数据库列表
 */
// 获取数据库列表
function getDatabaseList () {
  let url = `/api/metaStore/info/dbs`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表
function getTableList (id) {
  let url = `/api/metaStore/info/tables?db_id=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表的基本信息
function getTableInfo (id) {
  let url = `/api/metaStore/info/tablefield?table_id=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表的字段信息
function getTableField (param) {
  let url = `/api/metaStore/info/columnfield?table_id=${param.id}&num=${param.num}`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表的权限
function getTablePriv (id) {
  let url = `/api/metaStore/info/tablepriv?table_id=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表的正向血缘
function getTablelineage (id) {
  let url = `/api/metaStore/info/lineage?table_id=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
// 根据数据库id获取库下面的表的反向血缘
function getTableReverse (id) {
  let url = `/api/metaStore/info/reverse?table_id=${id}`
  return fetch({
    url: url,
    method: 'get'
  })
}
export {
  getDatabase,
  getDbTable,
  getMetaTable,
  getBaseFieldList,
  validateBaseFieldName,
  getDbTableFields,
  getRelationFilters,
  saveRelation,
  deleteMetaList,
  editRelation,
  getSuperFieldsList,
  editSuperFields,
  deleteSuperFields,
  saveSuperFields,
  getBaseQuota,
  getBaseQuotaFilters,
  getTemplateList,
  deleteTemplateList,
  cloneTemplateList,
  getSuperFields,
  getDateList,
  getTemplateFilters,
  getTemplateDetail,
  getTestTemplate,
  getSaveTemplate,
  getUserList,
  getTemplateUser,
  saveTemplateUser,
  printSql,
  getDatabaseList,
  getTableList,
  getTableInfo,
  getTableField,
  getTablePriv,
  getTablelineage,
  getTableReverse,
  getUserInfo,
  removeTemplate
}
