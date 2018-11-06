<template lang="html">
<div class="login-wrap">
  <div class="login-inner">
    <div class="login-title">
      登录
    </div>
    <div class="login-form">
      <form autocomplete="off"> 
        <div class="ms-form-item">
          <input type="text"  class="ms-form-input-text" placeholder="用户名" v-model="userName" @input="accountInput">
        </div>
        <div class="ms-form-item">
          <input type="password" class="ms-form-input-text" placeholder="密码" v-model="password" @input="passwordInput">
        </div>
      </form> 
    </div>
    <div class="ms-actions">
      <a class="ms-button ms-info login-btn" :disabled="lockLoginBtn" @click="loginAction">{{loginText}}</a>
    </div>
    <ms-toast v-model="toastVisible" :type="toastType" :text="toastText" top="15"></ms-toast>
  </div>
</div>
</template>

<script>
import MsToast from '@/components/Modal/Toast'
import * as api from '@/api/login'
import { setToken } from '@/utils/auth'
export default {
  data () {
    return {
      userName: '',
      password: '',
      loginText: '登录',
      lockLoginBtn: false,
      toastText: '',
      toastVisible: false,
      toastType: 'error'
    }
  },
  methods: {
    loginAction () {
      let userName = this.userName
      let password = this.password
      if (!this.userName.trim()) {
        this.toastText = '用户名不能为空'
        this.toastVisible = true
        return
      }
      if (!this.password.trim()) {
        this.toastText = '密码不能为空'
        this.toastVisible = true
        return
      }
      this.lockLoginBtn = true
      this.loginText = '登录中...'
      api.loginByName(userName, password).then(res => {
        this.lockLoginBtn = false
        this.loginText = '登录'
        this.$store.dispatch('login', res)
        setToken(res.token) // 设置token存cookie
        this.$router.push({ path: '/' })
      }).catch(error => {
        this.lockLoginBtn = false
        this.loginText = '登录'
        this.toastText = error.msg
        this.toastVisible = true
      })
    },
    accountInput () {
      if (this.userName !== '' && this.password !== '') {
        this.lockLoginBtn = false
      } else {
        this.lockLoginBtn = true
      }
    },
    passwordInput () {
      if (this.userName !== '' && this.password !== '') {
        this.lockLoginBtn = false
      } else {
        this.lockLoginBtn = true
      }
    }
  },
  components: {
    MsToast
  }
}
</script>

<style lang="less">
.login-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ecf0f5;
  overflow: hidden;
  background: rgba(84, 135, 222, .8);
}
.login-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 378px;
  padding: 32px 64px;
  text-align: left;
  background: #fff;
  box-shadow: 0 0 6px 0 rgba(0,0,0,.12);
  transform: translate(-50%, -50%);
  .login-title {
    font-size: 16px;
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid transparent;
  }
}
.login-form {
  input {
    width: 100%;
  }
}
.login-btn {
  width: 100%;
  margin: 0;
}
</style>
