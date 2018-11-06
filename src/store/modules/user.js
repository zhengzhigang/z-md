import storage from '../../utils/storage'
import { removeToken } from '../../utils/auth'
const accout = {
  state: {
    user: {
      userName: '',
      userId: '',
      token: null
    },
    token: null
  },
  getters: {
    getUser: state => state.user,
    getToken: state => state.token
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
      if (user && user.token) {
        state.token = user.token
      }
    },
    CLEAR_USER (state) {
      state.user = null
      state.token = null
    }
  },
  actions: {
    checkUser ({ commit }) {
      commit('SET_USER', storage.get('userInfo'))
    },
    login ({ commit }, user) {
      commit('SET_USER', user)
      storage.set('userInfo', user)
    },
    loginout ({ commit }) {
      commit('CLEAR_USER')
      storage.remove('userInfo')
      removeToken() // 移除Cookies
    }
  }
}
export default accout
