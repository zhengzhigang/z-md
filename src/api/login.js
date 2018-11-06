import fetch from '@/utils/fetch'

function loginByName (userName, password) {
  const data = {
    userName,
    password
  }
  return fetch({
    url: '/api/login',
    method: 'post',
    data
  })
}
export {
  loginByName
}
