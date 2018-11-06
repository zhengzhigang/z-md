<template>
<ul class="ms-menu">
  <side-menu-item
    v-for="(item, index) in menus"
    :menu-item="item" :current="index" :key="index">
  </side-menu-item>
</ul>
</template>
<script>
import SideMenuItem from './menu-item.vue'
export default {
  name: 'side-menu',
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  components: {
    SideMenuItem
  },
  methods: {
  }
}
</script>
