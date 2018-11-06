<template lang="html">
<div>
  <m-header></m-header>
  <div class="page-wrapper">
    <div class="page-side">
      <div class="sidebar">
          <side-menu :menus="menus"></side-menu>
      </div>
    </div>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
  <m-footer></m-footer>
</div>
</template>

<script>
import MHeader from './Head'
import MFooter from './Foot'
import { SideMenu } from '@/components/menu'
import * as api from '@/api/newMeta/database'
export default {
  name: 'app',
  data () {
    return {
      menus: [{
        showChild: false,
        title: '指标管理',
        subTitle: '',
        group: true,
        subMenu: [{
          title: '',
          group: [{
            link: 'userPermissions',
            title: '用户权限',
            subTitle: ''
          }, {
            link: 'metaDataList',
            title: '数据库表',
            subTitle: ''
          }, {
            link: 'baseFieldList',
            title: '基础指标',
            subTitle: ''
          }, {
            link: 'customDataList',
            title: '自定义指标',
            subTitle: ''
          }, {
            link: 'templateList',
            title: '模板管理',
            subTitle: ''
          }, {
            link: 'customFilterList',
            title: '筛选器管理',
            subTitle: ''
          }]
        }]
      },
      {
        showChild: false,
        title: '常用工具',
        subTitle: '',
        group: true,
        subMenu: [{
          title: '',
          group: [{
            link: 'http://hue.igengmei.com/notebook/editor?type=hive',
            title: 'hue',
            subTitle: ''
          }, {
            link: 'http://114.215.27.233:8083/#/',
            title: 'zeppelin',
            subTitle: ''
          }, {
            link: 'http://mars.igengmei.com/',
            title: 'mars报表平台',
            subTitle: ''
          }, {
            link: 'http://dataweb01:7070/kylin/models',
            title: 'Kylin',
            subTitle: ''
          }]
        }]
      },
      {
        showChild: false,
        title: '元数据管理',
        subTitle: '',
        group: true,
        subMenu: [{
          title: '',
          group: [{
            link: '',
            title: '数据库_01',
            subTitle: '',
            subMenu: [
              {
                title: '',
                group: [{
                  link: 'databaseInfo',
                  title: '数据库表_01'
                }, {
                  link: 'databaseInfo',
                  title: '数据库表_02'
                }, {
                  link: 'databaseInfo',
                  title: '数据库表_03'
                }]
              }
            ]
          }, {
            link: '',
            title: '数据库_02',
            subTitle: '',
            subMenu: [
              {
                title: '',
                group: [{
                  link: 'databaseInfo',
                  title: '数据库表_01'
                }, {
                  link: 'databaseInfo',
                  title: '数据库表_02'
                }, {
                  link: 'databaseInfo',
                  title: '数据库表_03'
                }]
              }
            ]
          }]
        }]
      }]
    }
  },
  watch: {
    $route () {
      window.scrollTo(0, 0)
    }
  },
  mounted () {
    api.getDatabaseList().then((res) => {
      var lg = this.menus.length - 1
      const _page = this
      res.map((item, index) => {
        _page.menus[lg].subMenu[0].group[index] = {link: '', title: item.db_name, subTitle: '', subMenu: [{title: '', group: []}]}
        api.getTableList(item.db_id).then((res) => {
          res.map((items) => {
            _page.menus[lg].subMenu[0].group[index].subMenu[0].group.push({link: 'databaseInfo', title: items.table_name, id: items.table_id})
          })
        })
      })
    })
  },
  components: {
    MHeader,
    MFooter,
    SideMenu
  }
}
</script>

<style lang="less">
.page-wrapper {
    position: relative;
    width: 100%;
    margin: 4rem auto;
    .page-side {
      position: fixed;
      top: 3.5rem;
      width: 230px;
      height: 100%;
      overflow-y: auto;
      z-index: 1000;
      background-color: #f9fafc;
      border-right: 1px solid #d2d6de;
      .sidebar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    .page-content {
      margin-left: 250px;
      min-height: 900px;
      background: #fff;
      margin-right: 20px;
      /*height: auto;*/
      /*padding: 0px 20px 50px 20px;*/
      /*background-color: #ecf0f5;*/
      .panel-center {
      }
    }
}
</style>
