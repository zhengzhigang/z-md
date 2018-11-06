// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
// import { getToken } from './utils/auth'
import Directives from './directives'
import 'babel-polyfill'

Vue.config.productionTip = false

Object.keys(Directives).forEach(key => {
  Vue.directive(key, Directives[key])
})
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next()
//   } else if (getToken()) {
//     next()
//   } else if (to.path === '/help') {
//     next()
//   } else {
//     next({
//       path: 'login',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   }
// })
router.afterEach(route => {
  window.scrollTo(0, 0)
})
// 刷新页面用户数据如内存
// store.dispatch('checkUser')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
