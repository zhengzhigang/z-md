
// 接口代理配置
// 开发使用了Easy mock工具， 地址: https://easy-mock.com
// const target = 'https://easy-mock.com/mock/5951fce09adc231f356b3a1f/superset'
// const target = 'http://172.30.8.181:8080/api'
const target = 'http://172.30.8.115:8080/api'
// const target = 'http://114.215.27.218:1010/api'
module.exports = {
  '/api': {
    target: target,
    changeOrigin: true,
    pathRewrite: {
      '/api': ''
    }
  }
}
