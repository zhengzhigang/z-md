import fetch from '@/utils/fetch'
/**
 *
 * @param {用户id} id
 */
function userInfo (id) {
  return fetch({
    url: '/api/userPermission/search',
    method: 'get',
    params: {
      userId: id
    }
  })
}
/**
 * 获取用户列表
 */
function users () {
  return fetch({
    url: '/api/template/mars/users',
    method: 'get'
  })
}
/**
 * 获取模板列表
 */
function getTemplates () {
  return fetch({
    url: '/api/template/list',
    method: 'get'
  })
}
/**
 * 添加模板
 * @param {Object} data
 */
function addTemplate (data = {}) {
  return fetch({
    url: '/api/userPermission/addTemplate',
    method: 'post',
    data
  })
}
/**
 * 删除模板
 * @param {Object} data
 */
function removeTemplate (data = {}) {
  return fetch({
    url: '/api/userPermission/rmTemplate',
    method: 'post',
    data
  })
}
export {
  userInfo,
  users,
  getTemplates,
  addTemplate,
  removeTemplate
}
