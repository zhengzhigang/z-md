import fetch from '@/utils/fetch'
// 筛选器列表
function getFilterList () {
  return fetch({
    url: '/api/filter/all/list',
    method: 'get'
  })
}
// 筛选器组件数据
function getFilterComponents () {
  return fetch({
    url: '/api/filter/create/components',
    method: 'get'
  })
}
// 删除筛选器
function deleteFilter (data) {
  return fetch({
    url: '/api/filter/delete',
    method: 'post',
    data
  })
}
// 编辑筛选器
function editFilter (data) {
  return fetch({
    url: '/api/filter/edit',
    method: 'get',
    params: data
  })
}
// 保存筛选器
function saveFilter (data) {
  return fetch({
    url: '/api/filter/save',
    method: 'post',
    data
  })
}
export {
  getFilterList,
  getFilterComponents,
  deleteFilter,
  editFilter,
  saveFilter
}
