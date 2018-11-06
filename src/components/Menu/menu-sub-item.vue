<template>
    <ul >
            <li
              class="ms-sub-menu-item"
              @click.stop="gotoUrl(items.link)"
              :class="{'open': showChild }"
            >
                <div @click="toggleChild">
                    <span class="ms-sub-menu-title">{{items.title}}</span>
                    <span class="ms-sub-menu-sub-title" v-if="items.subTitle">{{items.subTitle}}</span>
                    <span class="ms-sub-menu-title-arrow ion-chevron-down" v-if="items.subMenu"></span>
                </div>
                <div v-if="items.subMenu" v-show="showChild">
                  <div v-for="(subMenuItem, index) in items.subMenu" :key="index">
                    <div class="ms-sub-menu-group-title" v-if="subMenuItem.title">{{subMenuItem.title}}</div>
                    <div class="tree-search">
                      <input type="search" name="" v-model="filterKey" class="tree-search-input" placeholder="搜索">
                    </div>
                    <ul >
                        <li
                          @click.stop="gotoUrl(groupItem.link, groupItem.id, groupItem.title)"
                          class="ms-sub-menu-item"
                          :class="{ 'active': groupItem.active }"
                          v-for="(groupItem, index) in subMenuItem.group" :key="index"
                          v-if="filterItem(groupItem)"
                        >
                          <span class="ms-sub-menu-title">{{groupItem.title}}</span>
                          <span class="ms-sub-menu-sub-title" v-if="groupItem.subTitle">{{groupItem.subTitle}}</span>
                        </li>
                    </ul>
                  </div>
                </div>
            </li>
        </ul>
</template>
<script>
export default {
  name: 'menu-sub-item',
  props: {
    items: {
      type: Object,
      required: true
    },
    current: {
      type: Number
    }
  },
  data () {
    return {
      showChild: false,
      currentId: 0,
      filterKey: ''
    }
  },
  created () {
    this.currentId = this.current
  },
  methods: {
    filterItem (groupItem) {
      if (this.filterKey === '') {
        return true
      }
      return groupItem.title.indexOf(this.filterKey) > -1
    },
    gotoUrl (url, id, title) {
      if (!url) {
        return
      }
      let path = id ? ('/' + url + '/' + id) : ('/' + url)
      url.indexOf('http') !== -1 ? window.location.href = url : this.$router.push({ path: path, query: {title: title} })
    },
    toggleChild () {
      this.showChild = !this.showChild
    }
  }
}
</script>
<style lang="less">
.ms-sub-menu-sub-title{
    opacity: .67;
}
.ms-sub-menu-item:hover {
    background: hsla(0,0%,87%,.2);
}
.ms-sub-menu-item {
    position: relative;
    padding: 1rem 2rem;
    font-size: .9rem;
    cursor: pointer;
    .ms-sub-menu-item {
      padding: 1rem 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
}
.ms-sub-menu-title-arrow {
    position: absolute;
    font-size: .5rem;
    right: 1rem;
    top: 1.25rem;
    transform: rotate(0);
    transition: transform 0.2s ease;
}
.ms-sub-menu-item.open .ms-sub-menu-title-arrow {
    transform: rotate(180deg);
}
.ms-sub-menu-group-title {
    font-size: .8rem;
    padding-left: 1.5rem;
}
.tree-search {
  padding: 10px 10px 10px 0;
  .tree-search-input {
    display: inline-block;
    width: 180px;
    height: 32px;
    line-height: 28px;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid rgba(81,130,228,.5);
    vertical-align: middle;
    outline: none;
    font-size: 12px;
  }
}
</style>

