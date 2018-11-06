<template lang="html">
<header class="ms-header">
	<router-link :to="{ path: '/' }">
		<div class="ms-header-logo">
			<span class="ms-header-logo-text">{{header.logo.title}}</span>
		</div>
	</router-link>
	<nav class="ms-header-nav-menus">
    <div class="user-menus" @click="toggleChild" ref="users">
      <div class="navbar-nav-menu-title" >
        <!-- <img class="user-avatar" src="../../assets/image/account/user.jpg" alt=""> -->
        {{getUser.userName}}
      </div>
      <ul class="navbar-nav-menu-content" v-show="userVisible">
        <li @click="loginoutConfirm = true">退出</li>
      </ul>
    </div>
	</nav>
	<ms-confirm title="确认退出吗?" v-model="loginoutConfirm" @confirm-success="loginout"></ms-confirm>
</header>
</template>

<script>
import MsConfirm from '@/components/Modal/Confirm'
import { mapGetters } from 'vuex'
export default {
  name: 'ms-header',
  data () {
    return {
      header: {
        logo: {
          title: '更美数据平台'
        },
        nav: []
      },
      userVisible: false,
      loginoutConfirm: false
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  },
  methods: {
    toggleChild () {
      this.userVisible ? this.hide() : this.show()
    },
    loginout () {
      this.$store.dispatch('loginout')
      this.$router.push({ path: '/login' })
    },
    show () {
      this.userVisible = true
      document.addEventListener('click', this.hideUser, false)
    },

    hide () {
      this.userVisible = false
      document.removeEventListener('click', this.hideUser, false)
    },

    hideUser (e) {
      if (!this.$refs.users.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  },
  components: {
    MsConfirm
  }
}
</script>

<style lang="less">
.ms-header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  height: 3.5rem;
  width: 100%;
  padding: 0 15px;
  z-index: 9990;
  // background: #dd4b39;
  background-color: #5487de;
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.ms-header-logo {
  width: 12rem;
  padding-left: 1rem;
}

.ms-header-logo-img {
  display: none;
  height: 2rem;
  margin: 1rem 1rem 0 0;
}

.ms-header-logo-text {
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  line-height: 3.5rem;
}

.ms-header-nav-menus {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.user-menus {
  position: relative;
  width: 150px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: rgba(0,0,0,0.1)
  }
  &:active {
    background-color: rgba(0,0,0,0.1)
  }
}
.navbar-nav-menu-title {
  height: 100%;
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar-nav-menu-content {
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  border-radius: 3px;
  color: #444;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  li {
    padding: 15px;
    &:active {
      background-color: rgba(0,0,0,0.1);
    }
  }
}
</style>
