import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { message } from '@/components/Message/index'
// http 请求 拦截器
axios.interceptors.request.use(config => {
  // const token = store.state.account.token
  // if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
  //   config.headers.Authorization = `${token}`
  // }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(config => {
  const response = config.data
  if (response.status === 0) {
    return response.data
  } else {
    return Promise.reject(response)
  }
}, error => {
  let response = error.response
  if (response) {
    message({
      content: response.statusText || ''
    })
    if (response.status) {
      switch (response.status) {
        case 401:
          // 10000 清除token信息并跳转到登录页面
          store.dispatch('loginout')
          router.push({
            path: 'login'
          })
          break
        default:
      }
    }
    return Promise.reject(error)
  }
})
export default axios
