<template>
  <li
    class="ms-menu-item"
    :class="{'open': showChild }">
    <div class="ms-menu-title-container" @click="toggleChild(currentId)">
        <span class="ms-menu-title" v-if="menuItem.title">{{menuItem.title}}</span>
        <span class="ms-menu-sub-title" v-if="menuItem.subTitle">{{menuItem.subTitle}}</span>
        <span class="ms-menu-title-arrow ion-chevron-down" v-if="menuItem.subMenu"></span>
    </div>
    <div v-if="menuItem.subMenu && menuItem.group" v-show="showChild">
      <div v-for="(subMenuItem, index) in menuItem.subMenu" :key="index">
        <div class="ms-menu-group-title" v-if="subMenuItem.title">{{subMenuItem.title}}</div>
        <menu-sub-item v-for="(item, index) in subMenuItem.group" :items="item" :key="index" :current="index"></menu-sub-item>
      </div>
    </div>
    <ul v-if="menuItem.subMenu && !menuItem.group" v-show="showChild">
      <router-link tag='li'
        :to="{ path: '/' + subMenuItem.link, activeClass: 'active'}"
        class="ms-sub-menu-item"
        :class="{ 'active': subMenuItem.active }"
        v-for="(subMenuItem, index) in menuItem.subMenu" :key="index">
        <span class="ms-sub-menu-title">{{subMenuItem.title}}</span>
        <span class="ms-sub-menu-sub-title" v-if="subMenuItem.subTitle">{{subMenuItem.subTitle}}</span>
      </router-link>
    </ul>
  </li>
</template>
<script>
import MenuSubItem from './menu-sub-item'
export default {
  name: 'side-menu-item',
  props: {
    menuItem: {
      type: Object,
      required: true
    },
    current: {
      type: Number
    },
    reset: Function
  },
  components: {
    MenuSubItem
  },
  data () {
    return {
      showChild: false,
      currentId: 0
    }
  },
  created () {
    if (this.menuItem.showChild) {
      this.showChild = true
    }
    this.currentId = this.current
  },
  methods: {
    gotoUrl (url) {
      url.indexOf('http') !== -1 ? window.location.href = url : this.$router.push('/' + url)
    },
    toggleChild (index) {
      if (!this.menuItem.subMenu) {
        this.$router.push({ path: '/' + this.menuItem.link, activeClass: 'active' })
      } else {
        this.showChild = !this.showChild
      }
    }
  }
}
</script>
<style lang="less">
.ms-menu-container {
    min-height: 40rem;
}
.ms-menu-item {
    position: relative;
    cursor: pointer;
}
.ms-menu-title-container {
    font-size: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
}
.ms-menu-sub-title,
.ms-sub-menu-sub-title{
    opacity: .67;
}
.ms-menu-title:hover,
.ms-sub-menu-item:hover {
    background: hsla(0,0%,87%,.2);
}
.ms-sub-menu-item {
    padding: 1rem 2rem;
    font-size: .9rem;
    cursor: pointer;
}
.ms-menu-title-arrow {
    position: absolute;
    font-size: .5rem;
    right: 1rem;
    top: 1.25rem;
    transform: rotate(0);
    transition: transform 0.2s ease;
}
.ms-menu-item.open .ms-menu-title-arrow {
    transform: rotate(180deg);
}
.ms-card {
    margin: 2rem 1rem;
}
.ms-menu-group-title {
    font-size: .8rem;
    padding-left: 1.5rem;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-50%, -1rem, 0);
    transform: translate3d(-50%, -1rem, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
}
@keyframes fadeOutUp {
  from {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(-50%, -1rem, 0);
    transform: translate3d(-50%, -1rem, 0);
  }
}
.fade-in-down-transition {
  animation-duration: .3s;
  animation-fill-mode: both;
}
.fade-in-down-enter {
    animation-name: fadeInDown;
}
.fade-in-down-leave {
    animation-name: fadeOutUp;
}
.linkActive {
  background: hsla(0,0%,87%,.2);
}
.disabledLinkActive {
  cursor: not-allowed;
}
</style>
